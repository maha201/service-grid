/* eslint-disable no-useless-escape */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, X, Pencil, Trash2, Eye, ChevronLeft, ChevronRight, ArrowDownToLine, ArrowUpFromLine, BriefcaseBusiness, Receipt, CreditCard, Printer, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import ActionButton from './ActionButton';
import Dropdown from './Dropdown';
import DatePicker from './DatePicker';
import { useDemoData } from '../../hooks/useDemoData';
import { MODULES } from '../../utils/moduleConfig';

const labels = {customers:'Customer',equipment:'Equipment',requests:'Service Request',jobs:'Job',technicians:'Technician',inventory:'Inventory item',invoices:'Invoice'};
const numberKey = {requests:'number',jobs:'number',invoices:'number'};
const titleCase = (value='') => String(value).replace(/([A-Z])/g,' $1').replace(/^./, c=>c.toUpperCase());

export default function DataModule({ module }) {
  const [data, setData] = useDemoData();
  const config = MODULES[module];
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [draft, setDraft] = useState(null);
  const pageSize = 8;
  const rows = useMemo(() => data[module] || [], [data, module]);

  const getLabel = (field, value) => {
    const collection = field.type.split(':')[1];
    const item = (data[collection] || []).find((entry) => entry.id === value);
    return item ? item.name || item.number || item.employeeId : '—';
  };
  const filtered = useMemo(() => rows.filter((row) => {
    const matchesSearch = !search || config.search.some((key) => String(row[key] ?? '').toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = !filter || row[config.filter?.key] === filter;
    return matchesSearch && matchesFilter;
  }), [rows, search, filter, config]);
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const newDraft = (row = {}) => Object.fromEntries(config.fields.map((field) => [field.key, row[field.key] ?? (field.type === 'checkbox' ? false : '')]));
  const openForm = (row = null, preset = {}) => {
    const initial = { ...newDraft(row || {}), ...preset };
    if (module === 'requests') initial.requestDate ||= new Date().toISOString().slice(0,10);
    if (module === 'jobs') {
      const request = (data.requests || []).find((item) => item.id === initial.requestId);
      if (request) { initial.customerId ||= request.customerId; initial.equipmentId ||= request.equipmentId; initial.problem ||= request.description; initial.priority ||= request.priority; }
    }
    if (module === 'invoices') {
      const job = (data.jobs || []).find((item) => item.id === initial.jobId);
      if (job) { initial.customerId ||= job.customerId; initial.subtotal ||= job.totalAmount || job.labourCharge || 0; }
      initial.invoiceDate ||= new Date().toISOString().slice(0,10);
      initial.dueDate ||= new Date(Date.now()+14*86400000).toISOString().slice(0,10);
    }
    setDraft(initial); setDialog(row ? { mode:'edit', row } : { mode:'create' });
  };
  const numberFor = () => {
    const key = numberKey[module];
    if (!key) return undefined;
    const prefix = MODULES[module].numberPrefix;
    const year = new Date().getFullYear();
    const count = rows.reduce((max, record) => {
      const match = String(record[key] || '').match(/(\d+)$/);
      return Math.max(max, match ? Number(match[1]) : 0);
    }, 0);
    return `${prefix}-${year}-${String(count + 1).padStart(4,'0')}`;
  };
  const saveDraft = (event) => {
    event.preventDefault();
    for (const field of config.fields) {
      if (field.required && (draft[field.key] === '' || draft[field.key] == null)) return toast.error(`${field.label} is required`);
      if (field.type === 'email' && draft[field.key] && !/^\S+@\S+\.\S+$/.test(draft[field.key])) return toast.error(`Enter a valid ${field.label.toLowerCase()}`);
    }
    let saved = { ...draft };
    let partsToDeduct = [];
    if (module === 'equipment') saved.customerName = getLabel({type:'relation:customers'}, saved.customerId);
    if (module === 'requests') saved.number ||= numberFor();
    if (module === 'jobs') {
      if (saved.status === 'Completed' && (!saved.serviceNotes?.trim() || !saved.approval || !saved.signature?.trim())) return toast.error('Add service notes, customer approval, and signature before completing this job.');
      const completing = saved.status === 'Completed' && dialog.row?.status !== 'Completed' && !dialog.row?.partsDeducted;
      if (completing) {
        partsToDeduct = (Array.isArray(saved.spareParts) ? saved.spareParts : []).map((id) => data.inventory.find((item) => item.id === id)).filter(Boolean);
        const short = partsToDeduct.find((part) => Number(part.stock) < 1);
        if (short) return toast.error(`Not enough ${short.name} in inventory to complete this job.`);
        saved.partsDeducted = true;
      }
      saved.number ||= numberFor();
      saved.totalAmount = Number(saved.labourCharge || 0) + (Array.isArray(saved.spareParts) ? saved.spareParts.reduce((sum,id) => sum + Number(data.inventory.find((part) => part.id === id)?.sellingPrice || 0), 0) : 0);
    }
    if (module === 'invoices') {
      saved.number ||= numberFor();
      saved.subtotal = Number(saved.subtotal || 0); saved.tax = Number(saved.tax || 0); saved.discount = Number(saved.discount || 0);
      saved.total = Math.max(0, saved.subtotal + saved.tax - saved.discount);
      saved.paid = Number(saved.paid || 0);
      if (saved.paid >= saved.total && saved.total > 0) saved.paymentStatus = 'Paid';
      else if (saved.paid > 0) saved.paymentStatus = 'Partially Paid';
      else if (saved.paymentStatus === 'Paid') saved.paymentStatus = 'Unpaid';
    }
    const id = dialog.row?.id || `${module.slice(0,1)}-${Date.now()}`;
    saved.id = id;
    setData((current) => {
      const next = { ...current, [module]: dialog.row ? current[module].map((item) => item.id === id ? saved : item) : [saved, ...current[module]] };
      if (module === 'jobs' && saved.requestId) next.requests = next.requests.map((item) => item.id === saved.requestId ? { ...item, status: saved.status === 'Completed' ? 'Completed' : 'Assigned' } : item);
      if (module === 'jobs' && partsToDeduct.length) next.inventory = next.inventory.map((item) => partsToDeduct.some((part) => part.id === item.id) ? { ...item, stock:Number(item.stock)-1 } : item);
      if (module === 'jobs') next.technicians = next.technicians.map((item) => {
        const hasActiveJob = next.jobs.some((job) => job.technicianId === item.id && !['Completed','Cancelled'].includes(job.status));
        return item.availability === 'Unavailable' ? item : { ...item, availability: hasActiveJob ? 'On Job' : item.availability === 'On Job' ? 'Available' : item.availability };
      });
      return next;
    });
    setDialog(null); toast.success(`${config.singular} ${dialog.row ? 'updated' : 'created'}`);
  };
  const deleteRow = (row) => {
    const links = {
      customers: [['equipment','customerId'],['requests','customerId'],['jobs','customerId'],['invoices','customerId']],
      equipment: [['requests','equipmentId'],['jobs','equipmentId']],
      requests: [['jobs','requestId']], technicians:[['jobs','technicianId']], jobs:[['invoices','jobId']],
      inventory: [['jobs','spareParts']],
    }[module] || [];
    const linked = links.some(([collection,key]) => (data[collection] || []).some((item) => module === 'inventory' ? Array.isArray(item[key]) ? item[key].includes(row.id) : String(item[key] || '').toLowerCase().includes(row.name.toLowerCase()) : item[key] === row.id));
    if (linked) return toast.error(`This ${config.singular} is linked to other records and cannot be deleted.`);
    if (!window.confirm(`Delete ${config.singular} “${row.name || row.number || row.employeeId}”? This cannot be undone.`)) return;
    setData((current) => ({ ...current, [module]: current[module].filter((item) => item.id !== row.id) }));
    toast.success(`${config.singular} deleted`);
  };
  const beginJob = (row) => {
    const related = data.jobs.find((job) => job.requestId === row.id);
    if (related) return toast.error('A job already exists for this request.');
    openForm(null, { requestId:row.id, customerId:row.customerId, equipmentId:row.equipmentId, priority:row.priority, problem:row.description, status:'Pending', scheduledDate:row.visitDate });
  };
  const updateStock = (row, direction) => {
    const quantity = Number(window.prompt(`${direction === 'in' ? 'Stock received' : 'Stock issued'} quantity`, '1'));
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    if (direction === 'out' && quantity > Number(row.stock)) return toast.error('Not enough stock available.');
    setData((current) => ({ ...current, inventory: current.inventory.map((item) => item.id === row.id ? { ...item, stock:Number(item.stock) + (direction === 'in' ? quantity : -quantity) } : item) }));
    toast.success(`Stock ${direction === 'in' ? 'received' : 'issued'}`);
  };
  const recordPayment = (row) => {
    const due = Math.max(0, Number(row.total)-Number(row.paid||0));
    const amount = Number(window.prompt(`Record payment (remaining balance $${due.toFixed(2)})`, String(due)));
    if (!Number.isFinite(amount) || amount <= 0) return;
    if (amount > due) return toast.error('Payment cannot exceed the remaining balance.');
    setData((current) => ({ ...current, invoices:current.invoices.map((item) => item.id === row.id ? { ...item, paid:Number(item.paid||0)+amount, paymentStatus:Number(item.paid||0)+amount >= Number(item.total) ? 'Paid' : 'Partially Paid' } : item) }));
    toast.success('Payment recorded');
  };

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><h1 className="text-xl font-semibold text-slate-900">{config.title}</h1><p className="mt-1 text-sm text-slate-500">{config.description}</p></div>
      <button onClick={() => openForm()} className="sg-primary-button inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4"/>Add {labels[module]}</button>
    </div>
    {module === 'inventory' && rows.some((item) => Number(item.stock) <= Number(item.minStock)) && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Low stock: {rows.filter((item)=>Number(item.stock)<=Number(item.minStock)).map((item)=>item.name).join(', ')}</div>}
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1)}} placeholder={`Search ${config.title.toLowerCase()}...`} className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"/></div>
        {config.filter && <Dropdown aria-label={config.filter.label} value={filter} onChange={(value)=>{setFilter(value);setPage(1)}} placeholder={`All ${config.filter.label.toLowerCase()}s`} options={[...new Set(rows.map((r)=>r[config.filter.key]).filter(Boolean))]} className="sm:max-w-56"/>}
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500"><tr>{config.columns.map(([,label])=><th key={label} className="px-5 py-3.5">{label}</th>)}<th className="px-5 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
        {pageRows.map((row)=><tr key={row.id} className="hover:bg-slate-50/70">{config.columns.map(([key,,kind])=><td key={key} className="max-w-[260px] truncate px-5 py-4 text-slate-700">{renderCell(row,key,kind,data)}</td>)}<td className="px-4 py-3"><div className="flex justify-end gap-1">
          {module==='requests' && !data.jobs.some((job)=>job.requestId===row.id) && <Action icon={BriefcaseBusiness} label="Create job" onClick={()=>beginJob(row)}/>}
          {module==='jobs' && row.status==='Completed' && !data.invoices.some((invoice)=>invoice.jobId===row.id) && <Action icon={Receipt} label="Create invoice" onClick={()=>openForm(null,{jobId:row.id,customerId:row.customerId,subtotal:row.totalAmount||row.labourCharge,paymentStatus:'Unpaid'})}/>}
          {module==='inventory' && <><Action icon={ArrowDownToLine} label="Stock in" onClick={()=>updateStock(row,'in')}/><Action icon={ArrowUpFromLine} label="Stock out" onClick={()=>updateStock(row,'out')}/></>}
          {module==='invoices' && row.paymentStatus!=='Paid' && row.paymentStatus!=='Draft' && <Action icon={CreditCard} label="Record payment" onClick={()=>recordPayment(row)}/>}
          {module==='invoices' && <Action icon={Printer} label="Print invoice" onClick={()=>printInvoice(row,data)}/>}
          <Action icon={Eye} label="View" variant="view" onClick={()=>setDialog({mode:'view',row})}/><Action icon={Pencil} label="Edit" variant="edit" onClick={()=>openForm(row)}/><Action icon={Trash2} label="Delete" variant="delete" onClick={()=>deleteRow(row)}/>
        </div></td></tr>)}
        {!pageRows.length && <tr><td colSpan={config.columns.length+1} className="px-5 py-14 text-center text-sm text-slate-500">No {config.title.toLowerCase()} found.</td></tr>}
      </tbody></table></div>
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span>{filtered.length ? `Showing ${(page-1)*pageSize+1}–${Math.min(page*pageSize,filtered.length)} of ${filtered.length}` : '0 records'}</span><div className="flex items-center gap-2"><ActionButton icon={ChevronLeft} label="Previous page" disabled={page===1} onClick={()=>setPage((p)=>p-1)}/><span>Page {page} of {Math.max(1,Math.ceil(filtered.length/pageSize))}</span><ActionButton icon={ChevronRight} label="Next page" disabled={page>=Math.ceil(filtered.length/pageSize)} onClick={()=>setPage((p)=>p+1)}/></div></div>
    </section>
    {dialog && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(e)=>{if(e.target===e.currentTarget)setDialog(null)}}><section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4"><div><h2 className="font-semibold text-slate-900">{dialog.mode==='view' ? `${config.singular} details` : `${dialog.mode==='edit'?'Edit':'Add'} ${config.singular}`}</h2>{dialog.row?.number && <p className="mt-0.5 text-xs text-slate-500">{dialog.row.number}</p>}</div><ActionButton icon={X} label="Close" onClick={()=>setDialog(null)}/></div>
      {dialog.mode==='view' ? <Details module={module} row={dialog.row} data={data} onEdit={()=>openForm(dialog.row)}/> : <form onSubmit={saveDraft} className="grid gap-4 p-5 sm:grid-cols-2">{config.fields.map((field)=><Field key={field.key} field={field} value={draft[field.key]} customerId={draft.customerId} data={data} onChange={(value)=>setDraft((current)=>{
        const next={...current,[field.key]:value};
        if(module==='equipment' && field.key==='customerId') next.equipmentId='';
        if(module==='requests' && field.key==='customerId') next.equipmentId='';
        if(module==='jobs' && ['labourCharge','spareParts'].includes(field.key)) next.totalAmount=Number(next.labourCharge||0)+(Array.isArray(next.spareParts)?next.spareParts.reduce((sum,id)=>sum+Number(data.inventory.find((part)=>part.id===id)?.sellingPrice||0),0):0);
        if(module==='invoices' && field.key==='jobId'){const job=data.jobs.find((item)=>item.id===value);if(job){next.customerId=job.customerId;next.subtotal=job.totalAmount||job.labourCharge||0;next.total=Number(next.subtotal||0)+Number(next.tax||0)-Number(next.discount||0)}}
        if(module==='invoices' && ['subtotal','tax','discount'].includes(field.key)) next.total=Math.max(0,Number(next.subtotal||0)+Number(next.tax||0)-Number(next.discount||0));
        return next;
      })}/>)}<div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:col-span-2"><ActionButton label="Cancel" onClick={()=>setDialog(null)} className="border border-slate-200 px-4">Cancel</ActionButton><button className="sg-primary-button px-4 py-2 text-sm font-semibold text-white">Save {config.singular}</button></div></form>}
    </section></div>}
  </div>;
}

function Field({field,value,data,customerId,onChange}) {
  let options=field.options;
  if(field.type.startsWith('relation:')){
    const collection=field.type.split(':')[1]; let records=data[collection]||[];
    if(field.key==='equipmentId' && collection==='equipment' && customerId) records=records.filter((item)=>item.customerId===customerId);
    options=records.map((item)=>({value:item.id,label:item.name||item.number||item.employeeId}));
  }
  const control='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10';
  if(field.type==='checkbox') return <label className="flex min-h-[74px] items-center gap-3 rounded-xl border border-slate-200 px-3 sm:col-span-2"><input type="checkbox" checked={!!value} onChange={(e)=>onChange(e.target.checked)} className="h-4 w-4 accent-teal-700"/><span className="text-sm font-medium text-slate-700">{field.label}</span></label>;
  if(field.type==='signature') return <SignaturePad value={value} onChange={onChange}/>;
  if(field.type==='image') return <label className="space-y-1.5"><span className="block text-xs font-semibold text-slate-600">{field.label}</span><span className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-500"><ImagePlus className="h-4 w-4"/>{value?'Photo selected':'Choose image'}<input type="file" accept="image/*" className="sr-only" onChange={(e)=>{const file=e.target.files?.[0];if(file){const reader=new FileReader();reader.onload=()=>onChange(reader.result);reader.readAsDataURL(file)}}}/></span>{value&&<img src={value} alt="Service evidence" className="mt-2 h-24 rounded-lg object-cover"/>}</label>;
  const type=field.type==='textarea'?'textarea':field.type.startsWith('relation:')?'select':field.type;
  const multi=field.key==='spareParts'&&field.type==='relation:inventory';
  return <label className={`space-y-2 ${type==='textarea'||multi?'sm:col-span-2':''}`}><span className="block text-xs font-semibold text-slate-600">{field.label}{field.required&&<b className="ml-1 text-rose-500">*</b>}</span>{type==='textarea'?<textarea required={field.required} rows="3" value={value||''} onChange={(e)=>onChange(e.target.value)} className={control} />:type==='select'?<Dropdown required={field.required&&!multi} multiple={multi} value={multi?(Array.isArray(value)?value:[]):value||''} onChange={onChange} options={options} placeholder={`Select ${field.label.toLowerCase()}`}/>:type==='date'?<DatePicker required={field.required} value={value} onChange={onChange}/>:<input required={field.required} type={type} min={type==='number'?0:undefined} step={type==='number'?'0.01':undefined} value={value??''} onChange={(e)=>onChange(e.target.value)} readOnly={field.key==='total'&&field.type==='number'} className={`${control} ${field.key==='total'?'bg-slate-50':''}`}/>}</label>;
}
function SignaturePad({value,onChange}){
  const canvasRef=useRef(null);const drawing=useRef(false);const [hasSignature,setHasSignature]=useState(!!value);
  useEffect(()=>{if(!canvasRef.current)return;const canvas=canvasRef.current;canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);if(!value)return;const img=new Image();img.onload=()=>canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);img.src=value;},[value]);
  const point=(event)=>{const canvas=canvasRef.current;const rect=canvas.getBoundingClientRect();return {x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height}};
  const start=(event)=>{const canvas=canvasRef.current;canvas.setPointerCapture(event.pointerId);const ctx=canvas.getContext('2d');const p=point(event);ctx.beginPath();ctx.moveTo(p.x,p.y);drawing.current=true};
  const move=(event)=>{if(!drawing.current)return;const ctx=canvasRef.current.getContext('2d');const p=point(event);ctx.lineWidth=2.5;ctx.lineCap='round';ctx.strokeStyle='#0f172a';ctx.lineTo(p.x,p.y);ctx.stroke();setHasSignature(true)};
  const stop=()=>{if(!drawing.current)return;drawing.current=false;onChange(canvasRef.current.toDataURL('image/png'))};
  const clear=()=>{const canvas=canvasRef.current;canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);drawing.current=false;setHasSignature(false);onChange('')};
  return <div className="space-y-1.5 sm:col-span-2"><span className="block text-xs font-semibold text-slate-600">Customer Signature</span><canvas ref={canvasRef} width="720" height="180" onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} className="h-32 w-full touch-none rounded-xl border border-dashed border-slate-300 bg-white"/><div className="flex justify-between text-[11px] text-slate-400"><span>Sign above using mouse or touch</span><ActionButton label="Clear signature" disabled={!hasSignature} onClick={clear}>Clear signature</ActionButton></div></div>;
}
function renderCell(row,key,kind,data){let value=row[key];if(kind==='customer')value=(data.customers.find((x)=>x.id===value)||{}).name;if(kind==='technician')value=(data.technicians.find((x)=>x.id===value)||{}).name;if(kind==='money')return `$${Number(value||0).toFixed(2)}`;if(kind==='badge'||kind==='stockBadge'){const low=kind==='stockBadge'&&Number(row.stock)<=Number(row.minStock);const tone=low||['Urgent','High','Overdue','Cancelled'].includes(value)?'bg-rose-50 text-rose-700': ['Completed','Paid','Active','Available'].includes(value)?'bg-emerald-50 text-emerald-700':['In Progress','On The Way','Assigned','Partially Paid','On Job'].includes(value)?'bg-blue-50 text-blue-700':'bg-slate-100 text-slate-600';return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{low?'Low stock':value}</span>}if(key.toLowerCase().includes('date')&&value){const date=new Date(`${value}T00:00:00`);return Number.isNaN(date.getTime())?value:date.toLocaleDateString()}if(key==='stock')return `${value} ${row.unit||''}`;return value||<span className="text-slate-300">—</span>}
function Action({icon,label,onClick,variant='neutral'}){return <ActionButton icon={icon} label={label} onClick={onClick} variant={variant} className="h-9 w-9 px-0"/>}
function Details({module,row,data,onEdit}){
  const related=module==='customers'?[
    ['Equipment',data.equipment.filter((x)=>x.customerId===row.id)],['Service requests',data.requests.filter((x)=>x.customerId===row.id)],['Invoices',data.invoices.filter((x)=>x.customerId===row.id)],
  ]:module==='technicians'?[['Assigned jobs',data.jobs.filter((x)=>x.technicianId===row.id)],['Completed jobs',data.jobs.filter((x)=>x.technicianId===row.id&&x.status==='Completed')]]:module==='jobs'?[['Customer',(data.customers.find((x)=>x.id===row.customerId)||{}).name],['Equipment',(data.equipment.find((x)=>x.id===row.equipmentId)||{}).name],['Technician',(data.technicians.find((x)=>x.id===row.technicianId)||{}).name],['Parts used',(Array.isArray(row.spareParts)?row.spareParts.map((id)=>data.inventory.find((part)=>part.id===id)?.name||id).join(', '):row.spareParts)]]:module==='equipment'?[['Customer',(data.customers.find((x)=>x.id===row.customerId)||{}).name]]:module==='inventory'?[['Used on jobs',data.jobs.filter((job)=>Array.isArray(job.spareParts)?job.spareParts.includes(row.id):String(job.spareParts||'').toLowerCase().includes(row.name.toLowerCase()))]]:[];
  return <div className="space-y-5 p-5"><div className="grid gap-3 sm:grid-cols-2">{Object.entries(row).filter(([key])=>key!=='id'&&!key.toLowerCase().includes('photo')&&key!=='signature'&&key!=='approval'&&key!=='partsDeducted').map(([key,value])=><div key={key} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{titleCase(key)}</p><p className="mt-1 break-words text-sm font-medium text-slate-800">{key==='spareParts'&&Array.isArray(value)?value.map((id)=>data.inventory.find((part)=>part.id===id)?.name||id).join(', ')||'—':String(value||'—')}</p></div>)}</div>
    {row.signature&&<div><h3 className="mb-2 text-sm font-semibold text-slate-800">Customer signature</h3><img src={row.signature} alt="Customer signature" className="h-28 w-full rounded-xl border border-slate-200 object-contain"/></div>}
    {row.beforePhoto||row.afterPhoto?<div className="grid grid-cols-2 gap-3">{[row.beforePhoto,row.afterPhoto].filter(Boolean).map((src,i)=><img key={src} src={src} alt={i?'After service':'Before service'} className="max-h-48 w-full rounded-xl object-cover"/>)}</div>:null}
    {related.map(([heading,items])=><div key={heading}><h3 className="mb-2 text-sm font-semibold text-slate-800">{heading}</h3>{Array.isArray(items)?items.length?<ul className="space-y-1.5">{items.map((item)=><li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-600">{item.name||item.number||item.employeeId} <span className="float-right text-xs text-slate-400">{item.status||item.paymentStatus||''}</span></li>)}</ul>:<p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">None linked</p>:<p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{items||'—'}</p>}</div>)}
    <button onClick={onEdit} className="sg-primary-button px-4 py-2 text-sm font-semibold text-white">Edit details</button></div>
}
function printInvoice(invoice,data){
  const customer=data.customers.find((item)=>item.id===invoice.customerId)||{};
  const job=data.jobs.find((item)=>item.id===invoice.jobId)||{};
  const popup=window.open('','_blank','width=800,height=900');
  if(!popup)return toast.error('Allow pop-ups to print this invoice.');
  popup.document.write(`<!doctype html><html><head><title>${invoice.number}</title><style>body{font:14px Arial,sans-serif;color:#1e293b;max-width:720px;margin:48px auto;padding:0 24px}header{display:flex;justify-content:space-between;border-bottom:2px solid #0f766e;padding-bottom:24px}h1{color:#0f766e}table{width:100%;border-collapse:collapse;margin-top:32px}td{padding:12px;border-bottom:1px solid #e2e8f0}td:last-child{text-align:right}.total{font-size:20px;font-weight:bold}</style></head><body><header><div><h1>ServiceGrid</h1><p>Service invoice</p></div><div><h2>${invoice.number}</h2><p>Date: ${invoice.invoiceDate}</p><p>Due: ${invoice.dueDate}</p></div></header><h3>Bill to</h3><p><b>${customer.name||'Customer'}</b><br>${customer.address||''}<br>${customer.city||''} ${customer.state||''} ${customer.pincode||''}<br>${customer.email||''}</p><table><tr><td>Service work ${job.number||''}</td><td>$${Number(invoice.subtotal||0).toFixed(2)}</td></tr><tr><td>Tax</td><td>$${Number(invoice.tax||0).toFixed(2)}</td></tr><tr><td>Discount</td><td>−$${Number(invoice.discount||0).toFixed(2)}</td></tr><tr class="total"><td>Total due</td><td>$${Number(invoice.total||0).toFixed(2)}</td></tr><tr><td>Paid</td><td>$${Number(invoice.paid||0).toFixed(2)}</td></tr><tr><td>Status</td><td>${invoice.paymentStatus}</td></tr></table><script>window.onload=()=>window.print()<\/script></body></html>`);
  popup.document.close();
}
