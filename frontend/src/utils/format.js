/** Format an ISO date for blog metadata. */
export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
/** Determine whether a session may modify a post. */
export const canManagePost = (session, post) => Boolean(session && post && (session.role === 'admin' || session.userId === post.authorId));
/** Return whether a username is available, including the reserved administrator name. */
export const usernameAvailable = (username, users) => username.trim().toLowerCase() !== 'admin' && !users.some((user) => user.username.toLowerCase() === username.trim().toLowerCase());