import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
/** Present public discovery, local-post previews and conversion actions. */
export default function LandingPage() {
  const navigate = useNavigate();
  const session = getSession();
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const hydrateLatestPosts = () => {
      const latestPosts = getPosts()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setPosts(latestPosts);
      setIsLoadingPosts(false);
    };
    const testDelay = window.__WRITESPACE_TEST_LATEST_WRITING_DELAY_MS__;

    if (Number.isFinite(testDelay) && testDelay > 0) {
      const timeoutId = window.setTimeout(hydrateLatestPosts, testDelay);
      return () => window.clearTimeout(timeoutId);
    }

    hydrateLatestPosts();
  }, []);

  const read = () => navigate(session ? '/blogs' : '/login');

  return (
    <>
      <main>
        <section className="min-h-[100dvh] bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 px-4 py-20 text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">WriteSpace</h1>
              <p className="mt-5 max-w-lg text-xl">Your thoughts. Your space. Beautifully simple.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={read} className="rounded-lg bg-white px-5 py-3 font-medium text-indigo-700 shadow-sm">Start Reading</button>
                <Link className="rounded-lg border border-white/60 px-5 py-3 font-medium" to="/register">Get Started Free</Link>
              </div>
            </div>
            <div className="animate-pulse rounded-2xl bg-white/15 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold text-pink-100">A quiet place to write</p>
              <p className="mt-5 text-2xl font-bold">A thought worth keeping deserves a home.</p>
              <div className="mt-6 h-2 w-4/5 rounded bg-white/60" />
              <div className="mt-3 h-2 w-3/5 rounded bg-white/40" />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold text-slate-800">Made for words that matter.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl bg-indigo-50 p-6">
              <h3 className="font-bold text-indigo-800">Write Freely</h3>
              <p className="mt-2 text-slate-600">Plain-text writing with no distractions.</p>
            </article>
            <article className="rounded-xl bg-violet-50 p-6">
              <h3 className="font-bold text-violet-800">Private &amp; Local</h3>
              <p className="mt-2 text-slate-600">Your data stays in this browser.</p>
            </article>
            <article className="rounded-xl bg-pink-50 p-6">
              <h3 className="font-bold text-pink-800">Instant &amp; Fast</h3>
              <p className="mt-2 text-slate-600">No server and no lag.</p>
            </article>
          </div>
        </section>
        <section className="bg-slate-50 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-800">Latest writing</h2>
            {isLoadingPosts ? (
              <p className="mt-6 text-slate-600" role="status">Loading latest writing…</p>
            ) : posts.length ? (
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {posts.map((post, index) => <BlogCard key={post.id} post={post} index={index} session={session} />)}
              </div>
            ) : (
              <p className="mt-6 text-slate-600">No posts yet — check back soon!</p>
            )}
          </div>
        </section>
      </main>
      <footer className="bg-slate-800 px-4 py-8 text-slate-200">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4">
          <span>© {new Date().getFullYear()} WriteSpace</span>
          <div className="flex gap-4">
            <Link to="/">Home</Link>
            <Link to="/blogs">All Blogs</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </footer>
    </>
  );
}