import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminDashboard from './AdminDashboard.jsx';
import UserManagement from './UserManagement.jsx';

const admin = () => localStorage.setItem('writespace_session', JSON.stringify({
  userId: 'default-admin', username: 'admin', displayName: 'Administrator', role: 'admin',
}));
const wrap = (node) => render(<BrowserRouter>{node}</BrowserRouter>);

afterEach(() => vi.restoreAllMocks());

describe('administrator pages', () => {
  it('summarizes local records', () => {
    admin();
    localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'p', title: 'Post', authorName: 'A', createdAt: '2024-01-01' }]));
    wrap(<AdminDashboard />);
    expect(screen.getByText('Total Posts')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('creates a managed account with the selected administrator role persisted', async () => {
    admin();
    const user = userEvent.setup();
    wrap(<UserManagement />);
    expect(screen.getByTitle('Default admin cannot be deleted.')).toBeDisabled();
    await user.type(screen.getByLabelText('Display Name'), 'Eli');
    await user.type(screen.getByLabelText('Username'), 'eli');
    await user.type(screen.getByLabelText('Password'), 'pass');
    await user.selectOptions(screen.getByLabelText('Role'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Create User' }));

    const [created] = JSON.parse(localStorage.getItem('writespace_users'));
    expect(created).toMatchObject({ username: 'eli', role: 'admin' });
  });

  it('does not delete the default or current account', async () => {
    localStorage.setItem('writespace_session', JSON.stringify({
      userId: 'current-admin', username: 'current', displayName: 'Current', role: 'admin',
    }));
    localStorage.setItem('writespace_users', JSON.stringify([
      { id: 'current-admin', username: 'current', displayName: 'Current', password: 'pass', role: 'admin', createdAt: '2024-01-01' },
    ]));
    wrap(<UserManagement />);

    const protectedDeletes = screen.getAllByTitle('Default admin cannot be deleted.');
    expect(protectedDeletes).toHaveLength(2);
    protectedDeletes.forEach((button) => expect(button).toBeDisabled());
    expect(within(screen.getByText('Current').closest('div')).getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  it('keeps an eligible managed account when deletion is declined', async () => {
    admin();
    localStorage.setItem('writespace_users', JSON.stringify([
      { id: 'u1', username: 'mina', displayName: 'Mina', password: 'pass', role: 'user', createdAt: '2024-01-01' },
    ]));
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();
    wrap(<UserManagement />);
    await user.click(within(screen.getByText('Mina').closest('div')).getByRole('button', { name: 'Delete' }));

    expect(JSON.parse(localStorage.getItem('writespace_users'))).toHaveLength(1);
    expect(screen.getByText('Mina')).toBeInTheDocument();
  });

  it('removes an eligible managed account when deletion is confirmed', async () => {
    admin();
    localStorage.setItem('writespace_users', JSON.stringify([
      { id: 'u1', username: 'mina', displayName: 'Mina', password: 'pass', role: 'user', createdAt: '2024-01-01' },
    ]));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    wrap(<UserManagement />);
    await user.click(within(screen.getByText('Mina').closest('div')).getByRole('button', { name: 'Delete' }));

    expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual([]);
    expect(screen.queryByText('Mina')).not.toBeInTheDocument();
  });

  it('reports blank required fields without changing managed users', async () => {
    admin();
    localStorage.setItem('writespace_users', JSON.stringify([{ id: 'u1', username: 'mina', displayName: 'Mina', password: 'pass', role: 'user', createdAt: '2024-01-01' }]));
    const before = localStorage.getItem('writespace_users');
    const user = userEvent.setup();
    wrap(<UserManagement />);
    await user.type(screen.getByLabelText('Display Name'), ' ');
    await user.type(screen.getByLabelText('Username'), ' ');
    await user.type(screen.getByLabelText('Password'), 'pass');
    await user.click(screen.getByRole('button', { name: 'Create User' }));
    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required.');
    expect(localStorage.getItem('writespace_users')).toBe(before);
  });

  it.each(['admin', 'mina'])('rejects reserved or duplicate managed username %s without changing storage', async (username) => {
    admin();
    localStorage.setItem('writespace_users', JSON.stringify([{ id: 'u1', username: 'mina', displayName: 'Mina', password: 'pass', role: 'user', createdAt: '2024-01-01' }]));
    const before = localStorage.getItem('writespace_users');
    const user = userEvent.setup();
    wrap(<UserManagement />);
    await user.type(screen.getByLabelText('Display Name'), 'Eli');
    await user.type(screen.getByLabelText('Username'), username);
    await user.type(screen.getByLabelText('Password'), 'pass');
    await user.click(screen.getByRole('button', { name: 'Create User' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Username is already taken.');
    expect(localStorage.getItem('writespace_users')).toBe(before);
  });

  it('keeps dashboard posts when deletion is declined', async () => {
    admin();
    localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'p1', title: 'Post', authorName: 'A', createdAt: '2024-01-01' }]));
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();
    wrap(<AdminDashboard />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(JSON.parse(localStorage.getItem('writespace_posts'))).toHaveLength(1);
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('removes dashboard posts when deletion is confirmed', async () => {
    admin();
    localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'p1', title: 'Post', authorName: 'A', createdAt: '2024-01-01' }]));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    wrap(<AdminDashboard />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual([]);
  });
});
