'use client';

import {
  DashboardIcon,
  StudentCapIcon,
  AddIcon,
  DeleteNavIcon,
  StudentsNavIcon,
} from './Icons';

// ─── Single nav link ──────────────────────────────────────────────────────────

function NavLink({ section, label, active, onClick, children }) {
  return (
    <button
      onClick={() => onClick(section)}
      className={[
        'flex items-center gap-[11px] w-full px-3 py-[10px] rounded-[10px]',
        'border-l-[3px] text-[13.5px] font-medium text-left transition-all duration-150',
        'focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2',
        active
          ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)] font-semibold'
          : 'bg-transparent text-[var(--text-muted)] border-transparent hover:bg-[var(--surface-2)] hover:text-[var(--text)]',
      ].join(' ')}
    >
      {children}
      <span className="font-['Space_Grotesk',sans-serif]">{label}</span>
    </button>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

/**
 * Sidebar
 *
 * Props:
 *   section  {string}            – currently active section key
 *   onNav    {(section)=>void}   – called when a nav link is clicked
 */
export default function Sidebar({ section, onNav }) {
  const isStudent = section === 'student';

  return (
    <aside className="w-[248px] shrink-0 bg-[var(--surface)] border-r border-[var(--border)] px-4 py-[22px] flex flex-col sticky top-0 h-screen overflow-y-auto">

      {/* Brand */}
      <div className="flex items-center gap-[10px] px-2 pb-[26px]">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[16px] shrink-0">
          M
        </div>
        <span className="text-[17px] font-bold font-['Space_Grotesk',sans-serif]">
          Mile<b className="text-[var(--accent)]">stone</b>
        </span>
      </div>

      {/* Main nav */}
      <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-muted)] px-[10px] mt-[14px] mb-2">
        Main
      </p>
      <div className="flex flex-col gap-[3px]">
        <NavLink section="dashboard" label="Dashboard" active={section === 'dashboard'} onClick={onNav}>
          <DashboardIcon />
        </NavLink>
        <NavLink section="student" label="Student" active={section === 'student'} onClick={onNav}>
          <StudentCapIcon />
        </NavLink>
      </div>

      {/* Management nav (hidden in student view) */}
      {!isStudent && (
        <>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-muted)] px-[10px] mt-[14px] mb-2">
            Management
          </p>
          <div className="flex flex-col gap-[3px]">
            <NavLink section="add" label="Add courses" active={section === 'add'} onClick={onNav}>
              <AddIcon />
            </NavLink>
            <NavLink section="delete" label="Delete courses" active={section === 'delete'} onClick={onNav}>
              <DeleteNavIcon />
            </NavLink>
            <NavLink section="students" label="Students" active={section === 'students'} onClick={onNav}>
              <StudentsNavIcon />
            </NavLink>
          </div>
        </>
      )}
    </aside>
  );
}
