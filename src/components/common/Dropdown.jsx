import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import useAnchoredPosition from '../../hooks/useAnchoredPosition';

export default function Dropdown({ value, onChange, options = [], placeholder = 'Select an option', multiple = false, required = false, disabled = false, className = '', ...props }) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const position = useAnchoredPosition(open, triggerRef, undefined, 292, 240);
  const items = options.map((option) => typeof option === 'string' ? { value: option, label: option } : option);
  const menuItems = !multiple && placeholder ? [{ value: '', label: placeholder }, ...items] : items;
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : [];
  const selectedItem = items.find((item) => item.value === value);
  const selectedItems = items.filter((item) => selectedValues.includes(item.value));

  const choose = (item) => {
    if (!item) return;
    if (multiple) onChange(selectedValues.includes(item.value) ? selectedValues.filter((value) => value !== item.value) : [...selectedValues, item.value]);
    else { onChange(item.value); setOpen(false); triggerRef.current?.focus(); }
  };

  useEffect(() => {
    if (!open) return undefined;
    const outside = (event) => {
      if (!triggerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    const keydown = (event) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keydown);
    };
  }, [open]);

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(Math.max(0, menuItems.findIndex((item) => item.value === value)));
    setOpen((current) => !current);
  };

  return <>
    <button
      {...props}
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-required={required || undefined}
      disabled={disabled}
      onClick={openMenu}
      onKeyDown={(event) => {
        if (!open && ['ArrowDown','ArrowUp','Enter',' '].includes(event.key)) { event.preventDefault(); setOpen(true); setActiveIndex(0); }
        else if (open && event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, menuItems.length - 1)); }
        else if (open && event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); }
        else if (open && event.key === 'Enter') { event.preventDefault(); choose(menuItems[activeIndex]); }
        else if (open && event.key === 'Escape') setOpen(false);
      }}
      className={`flex min-h-[42px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${className}`}
    >
      <span className={`truncate ${multiple && selectedItems.length ? 'text-slate-800' : !multiple && selectedItem ? 'text-slate-800' : 'text-slate-400'}`}>
        {multiple ? selectedItems.length ? selectedItems.map((item) => item.label).join(', ') : placeholder : selectedItem?.label || placeholder}
      </span>
      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && position && createPortal(
      <div ref={menuRef} role="listbox" aria-multiselectable={multiple || undefined} className="fixed z-[100] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10" style={position}>
        {menuItems.map((item, index) => {
          const selected = multiple ? selectedValues.includes(item.value) : value === item.value;
          return <button
            key={item.value}
            type="button"
            role="option"
            aria-selected={selected}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => choose(item)}
            className={`flex min-h-9 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${activeIndex === index ? 'bg-teal-50 text-teal-900' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <span className="truncate">{item.label}</span>
            {selected && <Check className="h-4 w-4 shrink-0 text-teal-700" />}
          </button>;
        })}
        {!menuItems.length && <p className="px-3 py-4 text-center text-sm text-slate-400">No options</p>}
      </div>, document.body,
    )}
  </>;
}
