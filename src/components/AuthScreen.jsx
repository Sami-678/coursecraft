'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * AuthScreen
 * Email/password signup + login, shown when no user is logged in.
 *
 * Props:
 *   onAuthed  ()=>void   – optional callback after successful login/signup
 */
export default function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // stored in auth.users.raw_user_meta_data, used by the DB trigger
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onAuthed?.();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-5">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 w-[min(380px,100%)] shadow-[0_20px_50px_var(--shadow)]">

        {/* Brand */}
        <div className="flex items-center gap-[10px] mb-6">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[16px]">
            M
          </div>
          <span className="text-[17px] font-bold font-['Space_Grotesk',sans-serif]">
            Mile<b className="text-[var(--accent)]">stone</b>
          </span>
        </div>

        <h2 className="text-[18px] font-bold mb-1 font-['Space_Grotesk',sans-serif]">
          {mode === 'login' ? 'Log in' : 'Create an account'}
        </h2>
        <p className="text-[13px] text-[var(--text-muted)] mb-5">
          {mode === 'login'
            ? 'Welcome back — enter your details to continue.'
            : 'Sign up to enroll in courses and track your progress.'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <Field label="Full name">
              <Input
                type="text"
                placeholder="e.g. Ali Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
          )}

          <Field label="Email">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </Field>

          {error && (
            <p className="text-[12px] text-[var(--red)] bg-[var(--red-soft)] px-3 py-2 rounded-[9px] mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-white border-none rounded-[9px] py-[10px] text-[14px] font-semibold cursor-pointer hover:brightness-110 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <p className="text-[12.5px] text-[var(--text-muted)] text-center mt-5">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className="text-[var(--accent)] font-semibold bg-transparent border-none cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="text-[var(--accent)] font-semibold bg-transparent border-none cursor-pointer"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <label className="block text-[12.5px] text-[var(--text-muted)] font-semibold mb-4">
      {label}
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="block w-full mt-1.5 px-[11px] py-[9px] rounded-[9px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] text-[13.5px] outline-none focus:outline-2 focus:outline-[var(--accent)] focus:outline-offset-[1px]"
    />
  );
}
