'use client';

import { PlusCircleIcon } from './Icons';
import {
  CatalogCard,
  EnrolledCard,
  NewCourseCard,
  DeleteCard,
  AddPlaceholderCard,
  StudentCard,
} from './CourseCard';
import { STUDENTS } from '../data';

// ─── Shared ────────────────────────────────────────────────────────────────

function Grid({ children }) {
  return (
    <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(258px,1fr))' }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, className = '' }) {
  return (
    <p className={`text-[14px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.05em] font-['Space_Grotesk',sans-serif] mb-[14px] ${className}`}>
      {children}
    </p>
  );
}

// ─── Dashboard view ───────────────────────────────────────────────────────────

/**
 * DashboardView
 * Shows all courses in catalog format + an "Add" placeholder.
 *
 * Props:
 *   courses       Course[]
 *   onOpenAddModal ()=>void
 */
export function DashboardView({ courses, onOpenAddModal }) {
  return (
    <Grid>
      {courses.map((c) => <CatalogCard key={c.id} course={c} />)}
      <AddPlaceholderCard onClick={onOpenAddModal} />
    </Grid>
  );
}

// ─── Add Courses view ─────────────────────────────────────────────────────────

/**
 * AddCoursesView
 * CTA button + current catalog preview.
 *
 * Props:
 *   courses       Course[]
 *   onOpenAddModal ()=>void
 */
export function AddCoursesView({ courses, onOpenAddModal }) {
  return (
    <>
      <button
        onClick={onOpenAddModal}
        className="flex items-center gap-2.5 bg-[var(--accent)] text-white border-none rounded-[13px] px-5 py-[14px] text-[14px] font-semibold cursor-pointer mb-[30px] hover:brightness-110 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[3px]"
      >
        <PlusCircleIcon /> Add new course
      </button>

      <SectionLabel>Current courses</SectionLabel>
      <Grid>
        {courses.map((c) => <CatalogCard key={c.id} course={c} />)}
      </Grid>
    </>
  );
}

// ─── Delete Courses view ──────────────────────────────────────────────────────

/**
 * DeleteCoursesView
 *
 * Props:
 *   courses     Course[]
 *   onDelete    (course)=>void
 *   removingIds Set<number>
 *   errorIds    Set<number>
 */
export function DeleteCoursesView({ courses, onDelete, removingIds, errorIds }) {
  return (
    <Grid>
      {courses.map((c) => (
        <DeleteCard
          key={c.id}
          course={c}
          onDelete={onDelete}
          removing={removingIds.has(c.id)}
          showError={errorIds.has(c.id)}
        />
      ))}
    </Grid>
  );
}

// ─── Students admin view ──────────────────────────────────────────────────────

/**
 * StudentsView
 *
 * Props:
 *   onSelectStudent (student)=>void
 */
export function StudentsView({ onSelectStudent }) {
  return (
    <Grid>
      {STUDENTS.map((s) => (
        <StudentCard key={s.id} student={s} onClick={onSelectStudent} />
      ))}
    </Grid>
  );
}

// ─── Student portal view ──────────────────────────────────────────────────────

/**
 * StudentPortalView
 *
 * Props:
 *   courses        Course[]
 *   onEnroll       (course)=>void
 *   onProgressClick (course)=>void
 *   onOpenAddModal  ()=>void
 */
export function StudentPortalView({ courses, onEnroll, onProgressClick, onOpenAddModal }) {
  const enrolled = courses.filter((c) => c.enrolled);
  const available = courses.filter((c) => !c.enrolled);

  return (
    <>
      <SectionLabel>Enrolled courses</SectionLabel>
      {enrolled.length === 0 ? (
        <p className="text-[11px] text-[var(--text-muted)] font-mono mb-4">No enrolled courses yet.</p>
      ) : (
        <Grid>
          {enrolled.map((c) => (
            <EnrolledCard key={c.id} course={c} onProgressClick={onProgressClick} />
          ))}
        </Grid>
      )}

      <SectionLabel className="mt-[26px]">New courses</SectionLabel>
      <Grid>
        {available.map((c) => (
          <NewCourseCard key={c.id} course={c} onEnroll={onEnroll} />
        ))}
        <AddPlaceholderCard onClick={onOpenAddModal} />
      </Grid>
    </>
  );
}
