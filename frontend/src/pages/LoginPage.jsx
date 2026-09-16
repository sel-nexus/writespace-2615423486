import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ADMIN, getSession, setSession } from '../utils/auth.js';
import { getUsers } from '../utils/storage.js';
/** Authenticate a browser-local administrator or managed user. */
export default function LoginPage() {
  const session = getSession();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  if (session) return <Navigate to={session.role === 'admin' ? '/admin' : '/blogs'} replace />;

  const submit = (event) => {
    event.preventDefault();
    const user = values.username === 'admin' && values.password === 'admin'
      ? { ...ADMIN }
      : getUsers().find((item) => item.username === values.username && item.password === values.password);
    if (!user) {
      setError('Invalid username or password.');
      return;
    }
    const next = {
      userId: user.id || user.userId,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
    setSession(next);
    navigate(next.role === 'admin' ? '/admin' : '/blogs');
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 p-4">
      <form onSubmit={submit} className="mx-auto mt-24 max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-indigo-700">WriteSpace</h1>
        <h2 className="mt-2 text-xl font-bold">Welcome back</h2>
        {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
        <label className="mt-5 block">
          Username
          <input
            aria-label="Username"
            required
            value={values.username}
            onChange={(e) => setValues({ ...values, username: e.target.value })}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        <label className="mt-4 block">
          Password
          <input
            aria-label="Password"
            type="password"
            required
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white" type="submit">Login</button>
        <p className="mt-4 text-sm">
          Need an account? <Link className="text-indigo-600" to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}