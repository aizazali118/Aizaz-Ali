import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

/**
 * options: array of strings  OR  array of { value, label }
 * value / onChange: controlled like a normal <select>
 */
export default function AdminSelect({ value, onChange, options = [], placeholder = 'Select…', style = {} }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const normalize = (opt) => typeof opt === 'string' ? { value: opt, label: opt } : opt;
  const selected = options.map(normalize).find(o => o.value === value);

  return (
    <div ref={ref} className="relative" style={style}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 text-sm font-semibold transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(124,178,110,0.55)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: open ? '0 0 0 3px rgba(124,178,110,0.1)' : 'none',
          color: selected ? '#fff' : 'rgba(255,255,255,0.35)',
          borderRadius: '0.75rem',
          padding: '0.65rem 1rem',
        }}
      >
        <span className="truncate text-left">{selected ? selected.label : placeholder}</span>
        <FiChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'rgba(255,255,255,0.35)' }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 right-0 z-50 overflow-hidden"
          style={{
            top: 'calc(100% + 6px)',
            background: '#111a11',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.875rem',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {options.map((opt) => {
            const { value: v, label: l } = normalize(opt);
            const isActive = v === value;
            return (
              <button
                key={v}
                type="button"
                onClick={() => { onChange(v); setOpen(false); }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-left transition-colors duration-150"
                style={{
                  color: isActive ? '#7cb26e' : 'rgba(255,255,255,0.7)',
                  background: isActive ? 'rgba(124,178,110,0.1)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isActive ? 'rgba(124,178,110,0.1)' : 'transparent';
                  e.currentTarget.style.color = isActive ? '#7cb26e' : 'rgba(255,255,255,0.7)';
                }}
              >
                <span>{l}</span>
                {isActive && <FiCheck size={13} style={{ color: '#7cb26e', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}