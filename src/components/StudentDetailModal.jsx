'use client';

/**
 * StudentDetailModal
 *
 * Props:
 *   student  { id, name, email, enrollments: [{courseId, progress}] }
 *   courses  Course[]
 *   onClose  ()=>void
 */
export default function StudentDetailModal({ student, courses, onClose }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-[min(380px,100%)] shadow-[0_20px_50px_var(--shadow)]">

        <h3 className="m-0 mb-1 text-[16px] font-['Space_Grotesk',sans-serif]">{student.name}</h3>
        <p className="mt-0 mb-4 text-[12px] text-[var(--text-muted)] font-mono">{student.email}</p>

        {/* Enrollments list */}
        {student.enrollments.length === 0 ? (
          <p className="text-[11px] text-[var(--text-muted)] font-mono">Not enrolled in any course yet.</p>
        ) : (
          <div>
            {student.enrollments.map((enr) => {
              const course = courses.find((c) => c.id === enr.courseId);
              if (!course) return null;
              const done = enr.progress >= 100;
              return (
                <div
                  key={enr.courseId}
                  className="flex items-center justify-between gap-3 py-[10px] border-b border-[var(--border)] last:border-b-0"
                >
                  <div>
                    <strong className="block text-[13.5px] font-semibold mb-1 font-['Space_Grotesk',sans-serif]">
                      {course.title}
                    </strong>
                    <span className="inline-block text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border)] px-2 py-[2px] rounded-full">
                      {course.department}
                    </span>
                  </div>
                  <span
                    className={[
                      'rounded-full text-[11.5px] font-semibold px-[10px] py-[5px] whitespace-nowrap',
                      done
                        ? 'bg-[var(--green-soft)] text-[var(--green)]'
                        : 'bg-[var(--accent-soft)] text-[var(--accent)]',
                    ].join(' ')}
                  >
                    {done ? '✓ Done' : `${enr.progress}%`}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-transparent border border-[var(--border)] text-[var(--text-muted)] rounded-[9px] px-[14px] py-[9px] text-[13px] font-semibold cursor-pointer hover:bg-[var(--surface-2)] transition-colors duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
