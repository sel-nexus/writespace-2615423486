/** Manage the intentionally browser-local WriteSpace session. */
export const ADMIN = { userId: 'default-admin', username: 'admin', displayName: 'Administrator', role: 'admin' };
/** Return the saved session or null when it is absent or malformed. */
export const getSession = () => { try { const value = JSON.parse(localStorage.getItem('writespace_session') || 'null'); return value && value.userId && value.role ? value : null; } catch { return null; } };
/** Save a validated local session. */
export const setSession = (session) => localStorage.setItem('writespace_session', JSON.stringify(session));
/** End the current browser-local session. */
export const clearSession = () => localStorage.removeItem('writespace_session');