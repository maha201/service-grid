import { useLocation } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { NAV_ITEMS } from '../../utils/navigation';
import { useAuth } from '../../hooks/useAuth';
import ActionButton from '../common/ActionButton';

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const currentNav = NAV_ITEMS.find((item) => item.path === pathname);
  const pageTitle = currentNav?.label || (pathname === '/profile' ? 'Profile' : 'ServiceGrid');

  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 lg:px-9">
      <div className="flex items-center gap-3">
        <ActionButton icon={Menu} label="Open navigation" onClick={onMenuClick} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">ServiceGrid <span className="px-1 text-slate-300">/</span> Workspace</p>
          <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900">{pageTitle}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-2.5 text-sm text-slate-600">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white ring-2 ring-slate-100"><User className="h-4 w-4" /></div>
          <span className="hidden font-semibold capitalize text-slate-800 sm:inline">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
