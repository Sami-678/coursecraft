'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

// ─── Data & hooks ─────────────────────────────────────────────────────────────
import { SECTION_META } from '../data';
import { useToast } from '../hooks/useToast';

// ─── Layout components ────────────────────────────────────────────────────────
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import Toast   from './Toast';

// ─── Modal components ─────────────────────────────────────────────────────────
import AddCourseModal     from './AddCourseModal';
import StudentDetailModal from './StudentDetailModal';

// ─── Auth ─────────────────────────────────────────────────────────────────────
import AuthScreen from './AuthScreen';

// ─── View components ──────────────────────────────────────────────────────────
import {
  DashboardView,
  AddCoursesView,
  DeleteCoursesView,
  StudentsView,
  StudentPortalView,
} from './Views';

// ─────────────────────────────────────────────────────────────────────────────

export default function MilestoneApp() {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [session, setSession]   = useState(null);   // Supabase auth session, null = logged out
  const [authChecked, setAuthChecked] = useState(false); // avoids flash of login screen on load
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [studentRow, setStudentRow]   = useState(null); // row from `students` table for the logged-in user

  // ── Global state ────────────────────────────────────────────────────────────
  const [theme,   setTheme]   = useState('dark');
  const [section, setSection] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [addModalOpen,     setAddModalOpen]     = useState(false);
  const [selectedStudent,  setSelectedStudent]  = useState(null);

  // ── Delete animation state ───────────────────────────────────────────────────
  const [removingIds, setRemovingIds] = useState(new Set());
  const [errorIds,    setErrorIds]    = useState(new Set());

  // ── Toast ────────────────────────────────────────────────────────────────────
  const { toast, showToast } = useToast();

  // ── Derived topbar values ────────────────────────────────────────────────────
  const [title, subtitle] = SECTION_META[section] ?? ['', ''];
  const avatarInitials = studentRow?.name
    ? studentRow.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '..';
  const avatarName = studentRow?.name ?? session?.user?.email ?? 'Loading…';
  const avatarRole = isAdminUser ? 'Admin' : 'Student';

  // ── Auth: track session on load + on change ──────────────────────────────────
  useEffect(() => {
    // Check for an existing session (e.g. page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });

    // Listen for login/logout/signup events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Once logged in, fetch this user's `students` row + check admin status ────
  useEffect(() => {
    if (!session?.user) {
      setStudentRow(null);
      setIsAdminUser(false);
      return;
    }

    async function loadProfile() {
      const userId = session.user.id;

      const [{ data: studentData }, { data: adminData }] = await Promise.all([
        supabase.from('students').select('*').eq('id', userId).maybeSingle(),
        supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle(),
      ]);

      setStudentRow(studentData ?? null);
      setIsAdminUser(!!adminData);
      // Admins land on the dashboard; students land on their portal
      setSection(adminData ? 'dashboard' : 'student');
    }

    loadProfile();
  }, [session]);

  // ── Fetch courses (works whether logged in or not, since SELECT is public) ───
  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data);
      }
      setLoading(false);
    }
    fetchCourses();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleAddCourse = async (newCourse) => {
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        icon: newCourse.icon,
        title: newCourse.title,
        department: newCourse.department,
        duration: newCourse.duration,
        fee: newCourse.fee,
        months_ago: 0,
        added_label: 'Added just now',
      }])
      .select();

    if (error) {
      showToast(`Failed to add course: ${error.message}`, true);
      return;
    }

    setCourses((cs) => [data[0], ...cs]);
    setAddModalOpen(false);
    showToast(`"${newCourse.title}" added.`);
  };

  const handleDelete = async (course) => {
    if (course.months_ago >= 2) {
      setErrorIds((ids) => new Set([...ids, course.id]));
      setTimeout(() => {
        setErrorIds((ids) => { const n = new Set(ids); n.delete(course.id); return n; });
      }, 4000);
      showToast(`Can't delete "${course.title}" — ${course.added_label.toLowerCase()}.`, true);
      return;
    }

    setRemovingIds((ids) => new Set([...ids, course.id]));
    const { error } = await supabase.from('courses').delete().eq('id', course.id);

    if (error) {
      setRemovingIds((ids) => { const n = new Set(ids); n.delete(course.id); return n; });
      showToast(`Failed to delete: ${error.message}`, true);
      return;
    }

    showToast(`"${course.title}" deleted.`);
    setTimeout(() => {
      setCourses((cs) => cs.filter((c) => c.id !== course.id));
      setRemovingIds((ids) => { const n = new Set(ids); n.delete(course.id); return n; });
    }, 250);
  };

  const handleEnroll = async (course) => {
    if (!session?.user) {
      showToast('Please log in to enroll.', true);
      return;
    }

    const { error } = await supabase
      .from('enrollments')
      .insert([{ student_id: session.user.id, course_id: course.id, progress: 0 }]);

    if (error) {
      showToast(`Failed to enroll: ${error.message}`, true);
      return;
    }

    showToast(`Enrolled in ${course.title}!`);
  };

  const handleProgressClick = useCallback((course) => {
    showToast(
      course.progress >= 100
        ? `${course.title}: all milestones completed.`
        : `${course.title}: ${course.progress}% complete.`
    );
  }, [showToast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSection('dashboard');
  };

  // ── Render: wait for auth check before deciding what to show ─────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-muted)] text-[13px]">
        Loading…
      </div>
    );
  }

  // ── Render: not logged in → show auth screen ──────────────────────────────────
  if (!session) {
    return <AuthScreen />;
  }

  // ── Render: logged in → normal app ────────────────────────────────────────────
  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <Sidebar section={section} onNav={setSection} />

      {/* Main content column */}
      <div className="flex-1 min-w-0">

        {/* Top bar */}
        <Topbar
          title={title}
          subtitle={subtitle}
          theme={theme}
          onToggle={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
          avatarInitials={avatarInitials}
          avatarName={avatarName}
          avatarRole={avatarRole}
          onLogout={handleLogout}
        />

        {/* Section views */}
        <main className="px-10 pt-[30px] pb-[60px] max-w-[1080px]">

          {section === 'dashboard' && (
            <DashboardView
              courses={courses}
              onOpenAddModal={() => setAddModalOpen(true)}
            />
          )}

          {section === 'add' && (
            <AddCoursesView
              courses={courses}
              onOpenAddModal={() => setAddModalOpen(true)}
            />
          )}

          {section === 'delete' && (
            <DeleteCoursesView
              courses={courses}
              onDelete={handleDelete}
              removingIds={removingIds}
              errorIds={errorIds}
            />
          )}

          {section === 'students' && (
            <StudentsView onSelectStudent={setSelectedStudent} />
          )}

          {section === 'student' && (
            <StudentPortalView
              courses={courses}
              onEnroll={handleEnroll}
              onProgressClick={handleProgressClick}
              onOpenAddModal={() => setAddModalOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Modals */}
      {addModalOpen && (
        <AddCourseModal
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddCourse}
        />
      )}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          courses={courses}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Toast */}
      <Toast message={toast.message} isError={toast.isError} visible={toast.visible} />
    </div>
  );
}
