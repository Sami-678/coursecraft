'use client';

import { SunIcon, MoonIcon } from './Icons';

/**
 * Topbar
 *
 * Props:
 *   title       {string}
 *   subtitle    {string}
 *   theme       {'dark'|'light'}
 *   onToggle    {()=>void}   – toggle theme
 *   avatarInitials {string}
 *   avatarName     {string}
 *   avatarRole     {string}
 */
export default function Topbar({ title, subtitle, theme, onToggle, avatarInitials, avatarName, avatarRole, onLogout }) {
  return (
    <header className="flex justify-between items-start px-10 pt-[26px]">

      {/* Title block */}
      <div>
        <h1 className="m-0 mb-1 text-[23px] font-bold font-['Space_Grotesk',sans-serif]">
          {title}
        </h1>
        <p className="m-0 text-[13px] text-[var(--text-muted)] max-w-[480px]">
          {subtitle}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[14px] shrink-0">

        {/* Theme toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle dark and light mode"
          className="w-9 h-9 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] flex items-center justify-center cursor-pointer hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 transition-colors duration-150"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Avatar pill */}
        <div className="flex items-center gap-[9px] py-[5px] pr-3 pl-[6px] rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="w-7 h-7 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-[11px] font-bold">
            {avatarInitials}
          </div>
          <div className="leading-tight">
            <strong className="block text-[12.5px] font-['Space_Grotesk',sans-serif]">{avatarName}</strong>
            <span className="block text-[10.5px] text-[var(--text-muted)]">{avatarRole}</span>
          </div>
        </div>

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-[12px] font-semibold text-[var(--text-muted)] bg-transparent border border-[var(--border)] rounded-[9px] px-3 py-[7px] cursor-pointer hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors duration-150"
          >
            Log out
          </button>
        )}

      </div>
    </header>
  );
}
