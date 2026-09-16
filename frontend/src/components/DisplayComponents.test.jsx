import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Avatar from './Avatar.jsx';
import BlogCard from './BlogCard.jsx';
import Navbar from './Navbar.jsx';
import PublicNavbar from './PublicNavbar.jsx';
import UserRow from './UserRow.jsx';

const writer = { userId: 'writer-1', username: 'writer', displayName: 'Writer', role: 'user' };
const administrator = { userId: 'admin-1', username: 'admin-1', displayName: 'Administrator', role: 'admin' };
const post = {
  id: 'post-1',
  title: 'A post',
  content: 'x'.repeat(121),
  authorId: writer.userId,
  authorName: writer.displayName,
  authorRole: 'user',
  createdAt: '2024-01-01T00:00:00.000Z',
};
const managedUser = { id: 'user-2', username: 'eli', displayName: 'Eli', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' };

const renderWithRoutes = (node) => render(
  <MemoryRouter initialEntries={['/blogs']}>
    <Routes>
      <Route path="*" element={node} />
      <Route path="/" element={<h1>Home</h1>} />
    </Routes>
  </MemoryRouter>,
);

describe('display components', () => {
  it('renders role-specific avatar labels', () => {
    const { rerender } = render(<Avatar role="admin" />);
    expect(screen.getByLabelText('Administrator avatar')).toBeInTheDocument();

    rerender(<Avatar role="user" small />);
    expect(screen.getByLabelText('Writer avatar')).toBeInTheDocument();
  });

  it('renders a truncated excerpt, rotating accent, and edit link only for a post manager', () => {
    const { rerender } = render(
      <MemoryRouter>
        <BlogCard post={post} index={2} session={writer} />
      </MemoryRouter>,
    );

    expect(screen.getByText(`${'x'.repeat(120)}…`)).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('border-pink-500');
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/edit/post-1');

    rerender(
      <MemoryRouter>
        <BlogCard post={post} index={2} session={{ ...writer, userId: 'someone-else' }} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link', { name: 'Edit' })).not.toBeInTheDocument();
  });

  it('shows guest public links and role-specific returning-user destinations', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PublicNavbar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Get Started' })).toHaveAttribute('href', '/register');

    localStorage.setItem('writespace_session', JSON.stringify(administrator));
    rerender(
      <MemoryRouter>
        <PublicNavbar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Administrator.*Go to Dashboard/i })).toHaveAttribute('href', '/admin');
  });

  it('shows authenticated role links, exposes the mobile menu, and logs out', async () => {
    localStorage.setItem('writespace_session', JSON.stringify(administrator));
    const user = userEvent.setup();
    renderWithRoutes(<Navbar />);

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/users');

    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(screen.getAllByRole('link', { name: 'Dashboard' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Logout' })).toHaveLength(2);

    await user.click(screen.getAllByRole('button', { name: 'Logout' })[1]);
    expect(localStorage.getItem('writespace_session')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });

  it('hides administrator links for an authenticated writer', () => {
    localStorage.setItem('writespace_session', JSON.stringify(writer));
    renderWithRoutes(<Navbar />);

    expect(screen.getByRole('link', { name: 'All Blogs' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
  });

  it('disables default and current account deletion while allowing an eligible account to be deleted', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const { rerender } = render(<UserRow user={{ ...administrator, id: 'default-admin' }} disabled onDelete={onDelete} />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();

    rerender(<UserRow user={{ ...writer, id: writer.userId }} disabled onDelete={onDelete} />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();

    rerender(<UserRow user={managedUser} disabled={false} onDelete={onDelete} />);
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeEnabled();
    await user.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(managedUser);
  });
});
