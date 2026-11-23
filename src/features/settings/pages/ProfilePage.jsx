import { UserRound } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useDemoData } from '../../../hooks/useDemoData';

export default function ProfilePage() {
  const { user } = useAuth();
  const [data] = useDemoData();
  const name = data.settings.profileName || user?.name || 'Admin';
  const email = data.settings.profileEmail || user?.email || '';
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold text-slate-900">Profile</h1><p className="mt-1 text-sm text-slate-500">Your ServiceGrid account details.</p></div>
      <section className="max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><UserRound className="h-6 w-6"/></div><div><h2 className="font-semibold text-slate-900">{name}</h2><p className="mt-1 text-sm text-slate-500">Workspace administrator</p></div></div>
        <dl className="grid gap-4 pt-5 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</dt><dd className="mt-1 text-sm font-medium text-slate-700">{name}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</dt><dd className="mt-1 text-sm font-medium text-slate-700">{email}</dd></div></dl>
      </section>
    </div>
  );
}
