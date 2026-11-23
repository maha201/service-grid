import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ActionButton from './ActionButton';
import useAnchoredPosition from '../../hooks/useAnchoredPosition';

const toDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const toValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function DatePicker({ value, onChange, className = '', min, max, required = false, disabled = false, ...props }) {
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const selected = toDate(value);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => selected || new Date());
  const position = useAnchoredPosition(open, triggerRef, 304, 360);
  const monthStart = new Date(view.getFullYear(), view.getMonth(), 1);
  const gridStart = new Date(view.getFullYear(), view.getMonth(), 1 - monthStart.getDay());
  const days = Array.from({ length: 42 }, (_, index) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index));
  const minDate = toDate(min);
  const maxDate = toDate(max);

  useEffect(() => {
    if (!open) return undefined;
    const outside = (event) => {
      if (!triggerRef.current?.contains(event.target) && !popoverRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const showCalendar = () => {
    if (disabled) return;
    setView(selected || new Date());
    setOpen((current) => !current);
  };
  const selectDate = (date) => { onChange(toValue(date)); setView(date); setOpen(false); triggerRef.current?.focus(); };
  const changeMonth = (amount) => setView((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  const format = (date) => date?.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return <>
    <button
      {...props}
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-required={required || undefined}
      disabled={disabled}
      onClick={showCalendar}
      className={`flex min-h-[42px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm outline-none transition hover:border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${className}`}
    >
      <span className={selected ? 'text-slate-800' : 'text-slate-400'}>{selected ? format(selected) : 'Select a date'}</span>
      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
    {open && position && createPortal(
      <section ref={popoverRef} role="dialog" aria-label="Choose a date" className="fixed z-[100] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10" style={position}>
        <header className="mb-4 flex items-center justify-between">
          <ActionButton icon={ChevronLeft} label="Previous month" onClick={() => changeMonth(-1)} className="h-9 w-9 px-0" />
          <h2 className="text-sm font-semibold text-slate-900">{view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <ActionButton icon={ChevronRight} label="Next month" onClick={() => changeMonth(1)} className="h-9 w-9 px-0" />
        </header>
        <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">{['Su','Mo','Tu','We','Th','Fr','Sa'].map((day) => <span key={day} className="py-2">{day}</span>)}</div>
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day) => {
            const dayValue = toValue(day);
            const inMonth = day.getMonth() === view.getMonth();
            const active = value === dayValue;
            const unavailable = (minDate && day < minDate) || (maxDate && day > maxDate);
            return <button
              key={dayValue}
              type="button"
              disabled={!!unavailable}
              aria-pressed={active}
              onClick={() => selectDate(day)}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-xs font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-25 ${active ? 'bg-teal-700 text-white shadow-sm' : inMonth ? 'text-slate-700 hover:bg-teal-50 hover:text-teal-800' : 'text-slate-300 hover:bg-slate-50'}`}
            >{day.getDate()}</button>;
          })}
        </div>
        <footer className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          {value ? <ActionButton icon={X} label="Clear date" onClick={() => { onChange(''); setOpen(false); }} className="px-1.5">Clear</ActionButton> : <span />}
          <button type="button" onClick={() => selectDate(new Date())} className="rounded-lg px-3 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-50">Today</button>
        </footer>
      </section>, document.body,
    )}
  </>;
}
