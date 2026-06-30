'use client';

/**
 * Toast
 * A fixed bottom-center notification that auto-dismisses.
 *
 * Props:
 *   message  {string}  – text to display
 *   isError  {boolean} – red variant when true
 *   visible  {boolean} – controls opacity / slide animation
 */
export default function Toast({ message, isError, visible }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'px-[18px] py-[10px] rounded-full text-[13px] font-medium',
        'border shadow-lg pointer-events-none max-w-[90vw] text-center',
        'transition-all duration-200',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
        isError
          ? 'bg-[var(--surface-2)] border-[var(--red)] text-[var(--red)]'
          : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]',
      ].join(' ')}
    >
      {message}
    </div>
  );
}
