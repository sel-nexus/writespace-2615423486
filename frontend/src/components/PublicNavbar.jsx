import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { getSession } from '../utils/auth.js';
/** Render the public header with guest or returning-user actions. */
export default function PublicNavbar() {
  const session = getSession();
  const destination = session?.role === 'admin' ? '/admin' : '/blogs';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="font-bold text-indigo-600" to="/">WriteSpace</Link>
        {session ? (
          <Link className="flex items-center gap-2 text-sm font-medium text-slate-700" to={destination}>
            <Avatar role={session.role} small />
            {session.displayName}
            <span className="hidden sm:inline">Go to Dashboard</span>
          </Link>
        ) : (
          <div className="flex gap-3">
            <Link className="text-sm font-medium text-indigo-600" to="/login">Login</Link>
            <Link className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white" to="/register">
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}