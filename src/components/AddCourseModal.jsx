'use client';

import { useState, useRef, useEffect } from 'react';
import { forwardRef } from 'react';
/**
 * AddCourseModal
 *
 * Props:
 *   onClose  {()=>void}
 *   onAdd    {(course)=>void}
 */
export default function AddCourseModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', dept: '', duration: '', fee: '' });
  const titleRef = useRef(null);

  // Auto-focus first field on mount
  useEffect(() => { titleRef.current?.focus(); }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.dept.trim() || !form.duration.trim()) return;
    onAdd({
      id: Date.now(),
      icon: '📘',
      title: form.title.trim(),
      department: form.dept.trim(),
      duration: form.duration.trim(),
      fee: parseFloat(form.fee) || 0,
      monthsAgo: 0,
      addedLabel: 'Added just now',
      enrolled: false,
      progress: 0,
    });
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-[min(380px,100%)] shadow-[0_20px_50px_var(--shadow)]">
        <h3 className="m-0 mb-4 text-[16px] font-['Space_Grotesk',sans-serif]">Add new course</h3>

        <ModalField label="Course name">
          <ModalInput ref={titleRef} placeholder="e.g. Web Development Fundamentals" value={form.title} onChange={set('title')} />
        </ModalField>

        <ModalField label="Department">
          <ModalInput placeholder="e.g. Computer Science" value={form.dept} onChange={set('dept')} />
        </ModalField>

        <ModalField label="Duration">
          <ModalInput placeholder="e.g. 6 weeks" value={form.duration} onChange={set('duration')} />
        </ModalField>

        <ModalField label="Fee (Rs)">
          <ModalInput type="number" min="0" placeholder="e.g. 8500" value={form.fee} onChange={set('fee')} />
        </ModalField>

        <div className="flex justify-end gap-2.5 mt-1.5">
          <button
            onClick={onClose}
            className="bg-transparent border border-[var(--border)] text-[var(--text-muted)] rounded-[9px] px-[14px] py-[9px] text-[13px] font-semibold cursor-pointer hover:bg-[var(--surface-2)] transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[var(--accent)] border-none text-white rounded-[9px] px-[14px] py-[9px] text-[13px] font-semibold cursor-pointer hover:brightness-110 transition-all duration-150"
          >
            Add course
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function ModalField({ label, children }) {
  return (
    <label className="block text-[12.5px] text-[var(--text-muted)] font-semibold mb-[14px]">
      {label}
      {children}
    </label>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

const ModalInput = forwardRef(function ModalInput(
  { type = 'text', placeholder, value, onChange, min },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min={min}
      className="block w-full mt-1.5 px-[11px] py-[9px] rounded-[9px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] text-[13.5px] outline-none focus:outline-2 focus:outline-[var(--accent)] focus:outline-offset-[1px]"
    />
  );
});


// Forward ref so the first field can be auto-focused
ModalInput.displayName = 'ModalInput';
const ForwardedModalInput = ({ type, placeholder, value, onChange, min }, ref) => (
  <input
    ref={ref}
    type={type || 'text'}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    min={min}
    className="block w-full mt-1.5 px-[11px] py-[9px] rounded-[9px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] text-[13.5px] outline-none focus:outline-2 focus:outline-[var(--accent)] focus:outline-offset-[1px]"
  />
);
