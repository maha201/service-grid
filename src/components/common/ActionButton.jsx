export default function ActionButton({ icon: Icon, label, onClick, variant = 'neutral', className = '', disabled = false, type = 'button', children }) {
  const tones = {
    neutral: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    view: 'text-teal-700 hover:bg-teal-50',
    edit: 'text-blue-700 hover:bg-blue-50',
    delete: 'text-rose-600 hover:bg-rose-50',
    primary: 'text-white hover:text-white',
  };
  return (
    <button
      type={type}
      title={label}
      aria-label={children ? undefined : label}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-2.5 text-xs font-semibold transition duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${tones[variant] || tones.neutral} ${className}`}
    >
      {Icon && <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-current/[0.08] transition group-hover:bg-current/[0.12]"><Icon className="h-3.5 w-3.5" /></span>}
      {children && <span>{children}</span>}
    </button>
  );
}
