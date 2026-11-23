import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, LockKeyhole, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@servicegrid.io');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    login(email);
    toast.success('Signed in to ServiceGrid');
    navigate('/dashboard');
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-teal-800 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-32 -top-36 h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="absolute -right-16 -top-20 h-[380px] w-[380px] rounded-full border border-white/10" />
        <Link to="/" className="relative inline-flex w-fit items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Layers className="h-5 w-5"/></span>
          <span className="text-lg font-bold tracking-tight">ServiceGrid</span>
        </Link>
        <div className="relative max-w-xl pb-10">
          <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-teal-50">FIELD SERVICE OPERATIONS</span>
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight xl:text-5xl">Keep every service visit moving.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-teal-50/80">Bring customer requests, jobs, technicians, equipment and billing together in one clear workspace.</p>
          <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-medium text-teal-50/70"><span>Service workflow</span><span>01 — 03</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-semibold"><span className="rounded-lg bg-white/10 px-3 py-3">Request</span><span className="rounded-lg bg-white/10 px-3 py-3">Dispatch</span><span className="rounded-lg bg-white/10 px-3 py-3">Resolve</span></div>
          </div>
        </div>
        <p className="relative text-xs text-teal-50/60">A calmer way to manage field work.</p>
      </section>

      <section className="flex min-h-screen flex-col justify-center bg-slate-50 px-5 py-10 sm:px-8 lg:bg-white lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white"><Layers className="h-4 w-4"/></span>ServiceGrid</Link>
          <div className="mb-8"><p className="text-sm font-semibold text-teal-700">Welcome back</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Sign in to your workspace</h2><p className="mt-2 text-sm leading-6 text-slate-500">Enter your account details to continue to ServiceGrid.</p></div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-2"><span className="block text-sm font-medium text-slate-700">Email address</span><span className="relative block"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input type="email" autoComplete="username" required value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="name@company.com" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"/></span></label>
            <label className="block space-y-2"><span className="block text-sm font-medium text-slate-700">Password</span><span className="relative block"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input type="password" autoComplete="current-password" required value={password} onChange={(event)=>setPassword(event.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"/></span></label>
            <button type="submit" className="sg-primary-button mt-2 flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Sign in</button>
          </form>
          <div className="mt-8 border-t border-slate-200 pt-5"><Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-800"><ArrowLeft className="h-4 w-4"/>Back to Website</Link></div>
        </div>
      </section>
    </main>
  );
}
