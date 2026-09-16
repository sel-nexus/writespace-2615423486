import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProtectedRoute from './ProtectedRoute.jsx';
import { canManagePost, usernameAvailable } from '../utils/format.js';

const writer = { userId: 'writer-1', username: 'writer', displayName: 'Writer', role: 'user' };
const ownerPost = { id: 'post-1', authorId: 'writer-1' };

const renderGuard = (adminOnly = false) => render(
  <MemoryRouter initialEntries={['/admin']}>
    <Routes>
      <Route
        path="/admin"
        element={(
          <ProtectedRoute adminOnly={adminOnly}>
            <h1>Protected content</h1>
          </ProtectedRoute>
        )}
      />
      <Route path="/login" element={<h1>Login page</h1>} />
      <Route path="/blogs" element={<h1>All Posts</h1>} />
    </Routes>
  </MemoryRouter>,
);

describe('shared authorization behavior', () => {
  it('redirects a guest from a protected route to login', () => {
    renderGuard();

    expect(screen.queryByRole('heading', { name: 'Protected content' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument();
  });

  it('redirects a non-admin from an admin route and allows an administrator', () => {
    localStorage.setItem('writespace_session', JSON.stringify(writer));
    const { unmount } = renderGuard(true);

    expect(screen.queryByRole('heading', { name: 'Protected content' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'All Posts' })).toBeInTheDocument();
    unmount();

    localStorage.setItem('writespace_session', JSON.stringify({ ...writer, role: 'admin' }));
    renderGuard(true);

    expect(screen.getByRole('heading', { name: 'Protected content' })).toBeInTheDocument();
  });

  it('permits post owners and administrators but not other writers to manage posts', () => {
    expect(canManagePost(writer, ownerPost)).toBe(true);
    expect(canManagePost({ ...writer, userId: 'writer-2' }, ownerPost)).toBe(false);
    expect(canManagePost({ ...writer, userId: 'admin-1', role: 'admin' }, ownerPost)).toBe(true);
  });

  it('rejects reserved and duplicate usernames while accepting a fresh username', () => {
    const users = [{ username: 'Mina' }];

    expect(usernameAvailable('admin', users)).toBe(false);
    expect(usernameAvailable('mina', users)).toBe(false);
    expect(usernameAvailable('eli', users)).toBe(true);
  });
});
