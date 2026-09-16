import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import { getPosts, savePosts, getUsers } from '../utils/storage.js';
/** Present browser-local administrator metrics and recent post operations. */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const posts = getPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const users = getUsers();
  const remove = (post) => {
    if (window.confirm('Delete this post?')) {
      savePosts(posts.filter((item) => item.id !== post.id));
      navigate('/blogs');
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Administrator dashboard</h1>
        <p className="mt-2">Manage the writing and accounts stored in this browser.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-lg bg-white px-4 py-2 font-medium text-indigo-700" to="/write">Write New Post</Link>
          <Link className="rounded-lg border border-white/60 px-4 py-2 font-medium" to="/users">Manage Users</Link>
        </div>
      </section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Posts" value={posts.length} tone="bg-indigo-50 text-indigo-800" />
        <StatCard label="Total Users" value={users.length + 1} tone="bg-pink-50 text-pink-800" />
        <StatCard label="Total Admins" value={users.filter((user) => user.role === 'admin').length + 1} tone="bg-violet-50 text-violet-800" />
        <StatCard label="Total users" value={users.filter((user) => user.role === 'user').length} tone="bg-teal-50 text-teal-800" />
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-800">Recent Posts</h2>
        {posts.length ? (
          <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
                <span>
                  <strong>{post.title}</strong>
                  <span className="ml-2 text-sm text-slate-500">by {post.authorName}</span>
                </span>
                <span className="flex gap-3">
                  <Link className="text-indigo-600" to={`/edit/${post.id}`}>Edit</Link>
                  <button className="text-red-600" onClick={() => remove(post)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-slate-500">No posts yet.</p>
        )}
      </section>
    </main>
  );
}