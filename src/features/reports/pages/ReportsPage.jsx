import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useDemoData } from '../../../hooks/useDemoData';
import ActionButton from '../../../components/common/ActionButton';
import Dropdown from '../../../components/common/Dropdown';
import DatePicker from '../../../components/common/DatePicker';

const REPORTS=['Job Status Report','Technician Performance Report','Customer Service History','Revenue Report','Inventory / Low Stock Report'];
export default function ReportsPage(){
  const [data]=useDemoData();const [report,setReport]=useState(REPORTS[0]);const [from,setFrom]=useState('');const [to,setTo]=useState('');const [customer,setCustomer]=useState('');
  const rows=useMemo(()=>{
    const inRange=(date)=>!date||((!from||date>=from)&&(!to||date<=to));
    if(report===REPORTS[0])return data.jobs.filter((x)=>inRange(x.scheduledDate)).map((x)=>({Job:x.number,Customer:name(data.customers,x.customerId),Technician:name(data.technicians,x.technicianId),Date:x.scheduledDate,Status:x.status,Amount:x.totalAmount||x.labourCharge||0}));
    if(report===REPORTS[1])return data.technicians.map((t)=>({Technician:t.name,Specialization:t.specialization,Assigned:data.jobs.filter((j)=>j.technicianId===t.id&&inRange(j.scheduledDate)).length,Completed:data.jobs.filter((j)=>j.technicianId===t.id&&j.status==='Completed'&&inRange(j.scheduledDate)).length,Availability:t.availability}));
    if(report===REPORTS[2])return data.requests.filter((x)=>(!customer||x.customerId===customer)&&inRange(x.requestDate)).map((x)=>({Request:x.number,Customer:name(data.customers,x.customerId),Equipment:name(data.equipment,x.equipmentId),Date:x.requestDate,Issue:x.category,Status:x.status}));
    if(report===REPORTS[3])return data.invoices.filter((x)=>inRange(x.invoiceDate)).map((x)=>({Invoice:x.number,Customer:name(data.customers,x.customerId),Date:x.invoiceDate,Total:x.total,Paid:x.paid,Status:x.paymentStatus}));
    return data.inventory.filter((x)=>Number(x.stock)<=Number(x.minStock)).map((x)=>({Part:x.name,Code:x.code,Available:x.stock,Minimum:x.minStock,Supplier:x.supplier,Status:'Low stock'}));
  },[data,report,from,to,customer]);
  const exportCsv=()=>{if(!rows.length)return;const cols=Object.keys(rows[0]);const quote=(v)=>`"${String(v??'').replaceAll('"','""')}"`;const csv=[cols.map(quote).join(','),...rows.map((r)=>cols.map((c)=>quote(r[c])).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download=`${report.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}.csv`;a.click();URL.revokeObjectURL(url);};
  return <div className="space-y-5"><div><h1 className="text-xl font-semibold text-slate-900">Reports</h1><p className="mt-1 text-sm text-slate-500">Explore operating activity and export filtered data.</p></div><section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"><div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 xl:grid-cols-5">
    <Filter label="Report"><Dropdown aria-label="Report" value={report} onChange={setReport} options={REPORTS}/></Filter>
    <Filter label="From"><DatePicker aria-label="From date" value={from} onChange={setFrom}/></Filter>
    <Filter label="To"><DatePicker aria-label="To date" value={to} onChange={setTo}/></Filter>
    {report===REPORTS[2]&&<Filter label="Customer"><Dropdown aria-label="Customer" value={customer} onChange={setCustomer} placeholder="All customers" options={data.customers.map((c)=>({value:c.id,label:c.name}))}/></Filter>}
    <div className="flex items-end"><ActionButton icon={Download} label="Export CSV" variant="primary" onClick={exportCsv} className="sg-primary-button w-full">Export CSV</ActionButton></div>
  </div></section><section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">{report}</h2><p className="mt-1 text-xs text-slate-500">{rows.length} records</p></div><span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">Total: {report===REPORTS[3]?`$${rows.reduce((n,r)=>n+Number(r.Total||0),0).toFixed(2)}`:rows.length}</span></div><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{Object.keys(rows[0]||{Result:'No results'}).map((key)=><th className="px-5 py-3" key={key}>{key}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row,i)=><tr key={i}>{Object.values(row).map((value,j)=><td className="px-5 py-3.5 text-slate-700" key={j}>{String(value)}</td>)}</tr>)}{!rows.length&&<tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No matching report data.</td></tr>}</tbody></table></div></section></div>;
}
function Filter({label,children}){return <label className="space-y-2 text-xs font-semibold text-slate-500"><span className="block">{label}</span>{children}</label>}
function name(collection,id){return collection.find((x)=>x.id===id)?.name||'—'}
