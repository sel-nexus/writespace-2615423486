import PropTypes from 'prop-types';
/** Render the role-specific WriteSpace avatar. */
export default function Avatar({ role, small = false }) { return <span aria-label={role === 'admin' ? 'Administrator avatar' : 'Writer avatar'} className={`${role === 'admin' ? 'bg-violet-600' : 'bg-indigo-500'} inline-flex ${small ? 'h-7 w-7 text-sm' : 'h-9 w-9'} items-center justify-center rounded-full text-white`}><span aria-hidden="true">{role === 'admin' ? '👑' : '📚'}</span></span>; }
Avatar.propTypes = { role: PropTypes.string.isRequired, small: PropTypes.bool };