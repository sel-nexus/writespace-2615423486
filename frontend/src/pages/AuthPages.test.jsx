import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';

const wrap = (node) => render(<MemoryRouter>{node}</MemoryRouter>);
const renderLogin = () => render(
  <MemoryRouter initialEntries={['/login']}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<h1>Administrator destination</h1>} />
      <Route path="/blogs" element={<h1>Blogs destination</h1>} />
    </Routes>
  </MemoryRouter>,
);

describe('identity pages', () => {
  it('reports invalid credentials', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText('Username'), 'wrong');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password.');
  });

  it('logs in the default administrator and navigates to the administrator destination', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('heading', { name: 'Administrator destination' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('writespace_session'))).toMatchObject({ username: 'admin', role: 'admin' });
  });

  it('logs in a managed user and navigates to the blogs destination', async () => {
    localStorage.setItem('writespace_users', JSON.stringify([
      { id: 'managed-1', username: 'mina', displayName: 'Mina', password: 'pass', role: 'user' },
    ]));
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText('Username'), 'mina');
    await user.type(screen.getByLabelText('Password'), 'pass');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('heading', { name: 'Blogs destination' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('writespace_session'))).toMatchObject({ userId: 'managed-1', username: 'mina', role: 'user' });
  });

  it('rejects unmatched confirmation', async () => {
    const user = userEvent.setup();
    wrap(<RegisterPage />);
    await user.type(screen.getByLabelText('Display Name'), 'Mina');
    await user.type(screen.getByLabelText('Username'), 'mina');
    await user.type(screen.getByLabelText('Password'), 'one');
    await user.type(screen.getByLabelText('Confirm Password'), 'two');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.');
  });

  it.each(['admin', 'mina'])('rejects reserved or duplicate username %s without changing local storage', async (username) => {
    localStorage.setItem('writespace_users', JSON.stringify([{ id: 'existing', username: 'mina' }]));
    const before = localStorage.getItem('writespace_users');
    const user = userEvent.setup();
    wrap(<RegisterPage />);
    for (const [label, value] of [['Display Name', 'Mina'], ['Username', username], ['Password', 'one'], ['Confirm Password', 'one']]) {
      await user.type(screen.getByLabelText(label), value);
    }
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Username is already taken.');
    expect(localStorage.getItem('writespace_users')).toBe(before);
  });

  it('registers a user role in local storage', async () => {
    const user = userEvent.setup();
    wrap(<RegisterPage />);
    for (const [label, value] of [['Display Name', 'Mina'], ['Username', 'mina'], ['Password', 'one'], ['Confirm Password', 'one']]) {
      await user.type(screen.getByLabelText(label), value);
    }
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(JSON.parse(localStorage.getItem('writespace_users'))[0].role).toBe('user');
  });
});
