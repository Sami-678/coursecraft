// ─── Seed data ────────────────────────────────────────────────────────────────

export const INITIAL_COURSES = [
  { id: 1, icon: '💻', title: 'Web Development Fundamentals', department: 'Computer Science',       duration: '6 weeks', fee: 8500,  monthsAgo: 0.25, addedLabel: 'Added 1 week ago',   enrolled: true,  progress: 68  },
  { id: 2, icon: '🧮', title: 'Data Structures & Algorithms',  department: 'Computer Science',       duration: '8 weeks', fee: 12000, monthsAgo: 3,    addedLabel: 'Added 3 months ago', enrolled: true,  progress: 100 },
  { id: 3, icon: '🎨', title: 'UI/UX Design Essentials',       department: 'Design',                 duration: '5 weeks', fee: 9000,  monthsAgo: 1,    addedLabel: 'Added 1 month ago',  enrolled: false, progress: 0   },
  { id: 4, icon: '🐍', title: 'Python for Data Science',       department: 'Data Science',           duration: '7 weeks', fee: 11500, monthsAgo: 4,    addedLabel: 'Added 4 months ago', enrolled: false, progress: 0   },
  { id: 5, icon: '☁️', title: 'Cloud & DevOps Basics',         department: 'Information Technology', duration: '6 weeks', fee: 13000, monthsAgo: 0.1,  addedLabel: 'Added 3 days ago',   enrolled: false, progress: 0   },
  { id: 6, icon: '📈', title: 'Digital Marketing Strategy',    department: 'Business',               duration: '4 weeks', fee: 7000,  monthsAgo: 2.5,  addedLabel: 'Added 2 months ago', enrolled: false, progress: 0   },
];

export const STUDENTS = [
  { id: 1, name: 'Ali Khan',    email: 'ali.khan@example.com',    enrollments: [{ courseId: 1, progress: 68 }, { courseId: 2, progress: 100 }] },
  { id: 2, name: 'Sara Ahmed',  email: 'sara.ahmed@example.com',  enrollments: [{ courseId: 1, progress: 40 }] },
  { id: 3, name: 'Bilal Tariq', email: 'bilal.tariq@example.com', enrollments: [{ courseId: 3, progress: 20 }, { courseId: 5, progress: 55 }] },
  { id: 4, name: 'Hina Raza',   email: 'hina.raza@example.com',   enrollments: [{ courseId: 2, progress: 90 }] },
  { id: 5, name: 'Usman Javed', email: 'usman.javed@example.com', enrollments: [] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a number as "Rs 8,500" */
export const formatFee = (n) => 'Rs ' + n.toLocaleString();

/** Get two-letter initials from a full name */
export const getInitials = (name) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/** Count how many students are enrolled in a course */
export const getEnrolledCount = (courseId) =>
  STUDENTS.filter((s) => s.enrollments.some((e) => e.courseId === courseId)).length;

/** Section metadata: title + subtitle */
export const SECTION_META = {
  dashboard: ['Dashboard',      'Courses currently offered across all departments.'],
  add:       ['Add Courses',    'Create a new milestone-based course.'],
  delete:    ['Delete Courses', 'Remove outdated courses. Courses added 2+ months ago are locked.'],
  students:  ['Students',       'View enrolled students and their course history.'],
  student:   ['Student Portal', 'Track your enrolled courses and discover new ones.'],
};
