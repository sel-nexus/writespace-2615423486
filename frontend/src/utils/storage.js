/** Provide resilient browser-local persistence for posts and users. */
const read = (key) => { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } };
/** Return all posts or an empty list when storage is malformed. */
export const getPosts = () => read('writespace_posts');
/** Persist a post array. */
export const savePosts = (posts) => localStorage.setItem('writespace_posts', JSON.stringify(posts));
/** Return all managed users or an empty list when storage is malformed. */
export const getUsers = () => read('writespace_users');
/** Persist a managed-user array. Plaintext passwords are intentional for this local-only MVP. */
export const saveUsers = (users) => localStorage.setItem('writespace_users', JSON.stringify(users));