import { useState } from 'react';
import UserRow from '../components/UserRow.jsx';
import { ADMIN, getSession } from '../utils/auth.js';
import { getUsers, saveUsers } from '../utils/storage.js';
import { usernameAvailable } from '../utils/format.js';
/** Create and delete eligible browser-local managed accounts. */
export default function UserManagement() {
  const session = getSession();
  const [users, setUsers] = useState(getUsers());
  const [values, setValues] = useState({
    displayName: '',
    username: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!values.displayName.trim() || !values.username.trim() || !values.password) {
      return setError('All fields are required.');
    }
    if (!usernameAvailable(values.username, users)) return setError('Username is already taken.');
    const next = {
      id: crypto.randomUUID(),
      displayName: values.displayName.trim(),
      username: values.username.trim(),
      password: values.password,
      role: values.role,
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, next];
    saveUsers(updated);
    setUsers(updated);
    setValues({ displayName: '', username: '', password: '', role: 'user' });
    setError('');
  };
  const remove = (user) => {
    if (user.id === session.userId || user.username === 'admin') return;
    if (window.confirm('Delete this account?')) {
      const updated = users.filter((item) => item.id !== user.id);
      saveUsers(updated);
      setUsers(updated);
    }
  };
  const allUsers = [{ ...ADMIN, id: ADMIN.userId, createdAt: '2024-01-01T00:00:00.000Z' }, ...users];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800">Users</h1>
      <form onSubmit={submit} className="mt-6 rounded-xl bg-slate-50 p-5 shadow-sm">
        <h2 className="text-xl font-bold">Create User</h2>
        {error && <p role="alert" className="mt-3 text-red-600">{error}</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {[
            ['Display Name', 'displayName', 'text'],
            ['Username', 'username', 'text'],
            ['Password', 'password', 'password'],
          ].map(([label, key, type]) => (
            <label key={key}>
              {label}
              <input
                aria-label={label}
                value={values[key]}
                type={type}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                className="mt-1 w-full rounded border p-2"
                required
              />

            </label>
          ))}
          <label>
            Role
            <select
              aria-label="Role"
              value={values.role}
              onChange={(e) => setValues({ ...values, role: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            >
              <option value="admin">Admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>
        <button className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white">Create User</button>
      </form>
      <section className="mt-8 rounded-xl bg-white p-4 shadow-sm">
        {allUsers.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onDelete={remove}
            disabled={user.username === 'admin' || user.id === session.userId}
          />
        ))}
      </section>
    </main>
  );
}