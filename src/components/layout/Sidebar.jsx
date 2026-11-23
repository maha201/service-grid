import { NavLink, useNavigate } from 'react-router-dom';
import { Layers, X, ChevronRight, UserRound, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { NAV_ITEMS } from '../../utils/navigation';
import { useAuth } from '../../hooks/useAuth';
import ActionButton from '../common/ActionButton';

export default function Sidebar({ isOpen, onClose }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const logout = () => { signOut(); toast.success('Logged out'); navigate('/login'); };
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-[228px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[72px] items-center justify-between px-4">
          <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm shadow-teal-900/20"><Layers className="h-[18px] w-[18px]" strokeWidth={2.2}/></div><div className="min-w-0"><span className="block truncate text-[14.5px] font-bold tracking-tight text-slate-900">ServiceGrid</span><span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Field operations</span></div></div>
          <ActionButton icon={X} label="Close navigation" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"/>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {['Workspace','Operations','Manage'].map((section)=><div key={section}><p className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{section}</p><div className="space-y-1">{NAV_ITEMS.filter((item)=>item.section===section).map(({label,path,icon:Icon})=><NavLink key={path} to={path} onClick={onClose} className={({isActive})=>`group relative flex items-center gap-2.5 rounded-xl px-2.5 py-[9px] text-[13px] font-medium transition-colors ${isActive?'bg-teal-50 text-teal-800':'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            {({isActive})=><>{isActive&&<span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-teal-700"/>}<Icon className={`h-[17px] w-[17px] shrink-0 ${isActive?'text-teal-700':'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={1.8}/><span className="flex-1 truncate">{label}</span>{isActive&&<ChevronRight className="h-3.5 w-3.5 shrink-0 text-teal-700/60"/>}</>}
          </NavLink>)}</div></div>)}
        </nav>
        <div className="border-t border-slate-100 p-3"><div className="rounded-xl bg-slate-50 p-2.5">
          <div className="mb-2 flex items-center gap-2.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">SG</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800">Service team</p><p className="mt-0.5 truncate text-[10px] text-slate-500">Workspace</p></div><span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-100"/></div>
          <div className="grid grid-cols-2 gap-1 border-t border-slate-200/70 pt-2"><NavLink to="/profile" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-white hover:text-teal-800"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-700/10 text-teal-700"><UserRound className="h-3.5 w-3.5"/></span>Profile</NavLink><ActionButton icon={LogOut} label="Log out" variant="delete" onClick={logout} className="justify-start px-1.5 text-[11px]">Log out</ActionButton></div>
        </div></div>
      </aside>
    </>
  );
}
