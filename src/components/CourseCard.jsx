'use client';

import { useState, useEffect, useRef } from 'react';
import { ClockIcon, TrashIcon } from './Icons';
import { formatFee, getEnrolledCount } from '../data';

// ─── Shared sub-parts ─────────────────────────────────────────────────────────

function DeptTag({ children, accent = false }) {
  return (
    <span
      className={[
        'inline-block text-[11px] font-semibold px-2 py-[2px] rounded-full border',
        accent
          ? 'text-[var(--accent)] bg-[var(--accent-soft)] border-transparent'
          : 'text-[var(--text-muted)] bg-[var(--surface-2)] border-[var(--border)]',
      ].join(' ')}
    >
      {children}
    </span>
  );
}

function CardMeta({ duration, fee }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-[5px] text-[11.5px] text-[var(--text-muted)]">
        <ClockIcon />
        <span className="font-mono">{duration}</span>
      </span>
      <span className="text-[12.5px] font-semibold text-[var(--amber)] bg-[var(--amber-soft)] px-[9px] py-[2px] rounded-full font-mono w-fit">
        {formatFee(fee)}
      </span>
    </div>
  );
}

// ─── Catalog card (dashboard / add-preview) ───────────────────────────────────

export function CatalogCard({ course }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5',
        'flex flex-col gap-3 shadow-[0_1px_2px_var(--shadow)]',
        'transition-all duration-[180ms]',
        hovered ? '-translate-y-[3px] shadow-[0_10px_24px_var(--shadow)]' : '',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-start gap-[11px]">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-[var(--accent-soft)] flex items-center justify-center text-[18px] shrink-0">
          {course.icon}
        </div>
        <div>
          <p className="text-[14.5px] font-semibold mb-[5px] mt-[1px] font-['Space_Grotesk',sans-serif]">
            {course.title}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <DeptTag>{course.department}</DeptTag>
            <DeptTag accent>{getEnrolledCount(course.id)} enrolled</DeptTag>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--border)] pt-[13px] mt-auto gap-2.5">
        <CardMeta duration={course.duration} fee={course.fee} />
      </div>
    </div>
  );
}

// ─── Enrolled card (student portal – shows progress badge) ───────────────────

export function EnrolledCard({ course, onProgressClick }) {
  const [hovered, setHovered] = useState(false);
  const done = course.progress >= 100;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5',
        'flex flex-col gap-3 shadow-[0_1px_2px_var(--shadow)]',
        'transition-all duration-[180ms]',
        hovered ? '-translate-y-[3px] shadow-[0_10px_24px_var(--shadow)]' : '',
      ].join(' ')}
    >
      {/* Progress corner badge */}
      <button
        onClick={() => onProgressClick(course)}
        className={[
          'absolute top-4 right-4 rounded-full text-[11.5px] font-semibold px-[10px] py-[5px] border-none cursor-pointer transition-colors duration-150',
          done
            ? 'bg-[var(--green-soft)] text-[var(--green)]'
            : 'bg-[var(--accent-soft)] text-[var(--accent)]',
        ].join(' ')}
      >
        {done ? '✓ Done' : `${course.progress}%`}
      </button>

      <div className="flex items-start gap-[11px] pr-14">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-[var(--accent-soft)] flex items-center justify-center text-[18px] shrink-0">
          {course.icon}
        </div>
        <div>
          <p className="text-[14.5px] font-semibold mb-[5px] mt-[1px] font-['Space_Grotesk',sans-serif]">
            {course.title}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <DeptTag>{course.department}</DeptTag>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-[13px] mt-auto gap-2.5">
        <CardMeta duration={course.duration} fee={course.fee} />
      </div>
    </div>
  );
}

// ─── New-course card (student portal – shows enroll button) ──────────────────

export function NewCourseCard({ course, onEnroll }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5',
        'flex flex-col gap-3 shadow-[0_1px_2px_var(--shadow)]',
        'transition-all duration-[180ms]',
        hovered ? '-translate-y-[3px] shadow-[0_10px_24px_var(--shadow)]' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-[11px]">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-[var(--accent-soft)] flex items-center justify-center text-[18px] shrink-0">
          {course.icon}
        </div>
        <div>
          <p className="text-[14.5px] font-semibold mb-[5px] mt-[1px] font-['Space_Grotesk',sans-serif]">
            {course.title}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <DeptTag>{course.department}</DeptTag>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-[13px] mt-auto gap-2.5">
        <CardMeta duration={course.duration} fee={course.fee} />
        <button
          onClick={() => onEnroll(course)}
          className="text-[12.5px] font-semibold text-white bg-[var(--accent)] border-none rounded-[9px] px-[14px] py-2 cursor-pointer shrink-0 hover:brightness-110 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
        >
          Enroll
        </button>
      </div>
    </div>
  );
}

// ─── Delete card (admin – shows trash button + age tag + error) ───────────────

export function DeleteCard({ course, onDelete, removing, showError }) {
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5',
        'flex flex-col gap-3 shadow-[0_1px_2px_var(--shadow)]',
        'transition-all duration-[180ms]',
        hovered && !removing ? '-translate-y-[3px] shadow-[0_10px_24px_var(--shadow)]' : '',
        removing ? 'opacity-0 scale-95' : 'opacity-100',
      ].join(' ')}
    >
      {/* Delete corner button */}
      <button
        onClick={() => onDelete(course)}
        onMouseEnter={() => setTrashHovered(true)}
        onMouseLeave={() => setTrashHovered(false)}
        aria-label={`Delete ${course.title}`}
        className={[
          'absolute top-4 right-4 rounded-full border-none p-[7px] flex items-center justify-center cursor-pointer transition-colors duration-150',
          trashHovered
            ? 'bg-[var(--red-soft)] text-[var(--red)]'
            : 'bg-[var(--surface-2)] text-[var(--text-muted)]',
        ].join(' ')}
      >
        <TrashIcon />
      </button>

      <div className="flex items-start gap-[11px] pr-14">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-[var(--accent-soft)] flex items-center justify-center text-[18px] shrink-0">
          {course.icon}
        </div>
        <div>
          <p className="text-[14.5px] font-semibold mb-[5px] mt-[1px] font-['Space_Grotesk',sans-serif]">
            {course.title}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <DeptTag>{course.department}</DeptTag>
            <DeptTag accent>{getEnrolledCount(course.id)} enrolled</DeptTag>
          </div>
        </div>
      </div>

      {/* Age tag */}
      <span className={[
        'text-[11px] font-mono',
        course.monthsAgo >= 2 ? 'text-[var(--red)]' : 'text-[var(--text-muted)]',
      ].join(' ')}>
        {course.addedLabel}
      </span>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-[13px] mt-auto gap-2.5">
        <CardMeta duration={course.duration} fee={course.fee} />
      </div>

      {/* Inline error message */}
      {showError && (
        <p className="text-[11px] text-[var(--red)] bg-[var(--red-soft)] px-[10px] py-[7px] rounded-[9px] m-0 font-mono">
          Can't delete — {course.addedLabel.toLowerCase()}.
        </p>
      )}
    </div>
  );
}

// ─── Add placeholder card ─────────────────────────────────────────────────────

export function AddPlaceholderCard({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'relative bg-[var(--surface)] border border-dashed rounded-2xl p-5',
        'flex flex-col items-center justify-center gap-3 min-h-[148px]',
        'cursor-pointer transition-all duration-150 w-full focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2',
        hovered
          ? 'border-[var(--accent)] text-[var(--accent)]'
          : 'border-[var(--border)] text-[var(--text-muted)]',
      ].join(' ')}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border border-dashed border-[var(--border)] flex items-center justify-center text-[17px]">
          +
        </div>
        <span className="text-[13px] font-semibold font-['Space_Grotesk',sans-serif]">
          Add new course
        </span>
      </div>
    </button>
  );
}

// ─── Student card (students admin view) ──────────────────────────────────────

export function StudentCard({ student, onClick }) {
  const [hovered, setHovered] = useState(false);
  const count = student.enrollments.length;

  // Get initials without importing the helper to keep component self-contained
  const initials = student.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      onClick={() => onClick(student)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(student)}
      aria-label={`View ${student.name}`}
      className={[
        'relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5',
        'flex flex-col gap-3 shadow-[0_1px_2px_var(--shadow)] cursor-pointer',
        'transition-all duration-[180ms]',
        hovered ? '-translate-y-[3px] shadow-[0_10px_24px_var(--shadow)]' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-[11px]">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-[13px] font-bold shrink-0 font-['Space_Grotesk',sans-serif]">
          {initials}
        </div>
        <div>
          <p className="text-[14.5px] font-semibold mb-[5px] mt-[1px] font-['Space_Grotesk',sans-serif]">
            {student.name}
          </p>
          <DeptTag>{student.email}</DeptTag>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-[13px] mt-auto">
        <span className="text-[12.5px] font-semibold text-[var(--amber)] bg-[var(--amber-soft)] px-[9px] py-[2px] rounded-full font-mono">
          {count} course{count === 1 ? '' : 's'} enrolled
        </span>
      </div>
    </div>
  );
}
