import PropTypes from 'prop-types';
import Avatar from './Avatar.jsx';
import { formatDate } from '../utils/format.js';
/** Render an account record for desktop tables and mobile cards. */
export default function UserRow({ user, onDelete, disabled }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-3">
      <span className="flex items-center gap-2">
        <Avatar role={user.role} small />
        {user.displayName}
      </span>
      <span className="text-sm text-slate-500">
        {user.username} · {formatDate(user.createdAt)}
      </span>
      <span
        className={`${user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'} rounded-full px-3 py-0.5 text-sm font-medium`}
      >
        {user.role}
      </span>
      <button
        title={disabled ? 'Default admin cannot be deleted.' : 'Delete account'}
        disabled={disabled}
        onClick={() => onDelete(user)}
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};