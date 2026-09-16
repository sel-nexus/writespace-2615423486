import { Link, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import { getPosts, savePosts } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';
import { canManagePost, formatDate } from '../utils/format.js';
/** Display a post and expose mutation controls only to its authorized manager. */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const post = getPosts().find((item) => item.id === id);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <Link className="mt-4 inline-block text-indigo-600" to="/blogs">Back to All Posts</Link>
      </main>
    );
  }

  const allowed = canManagePost(session, post);
  const remove = () => {
    if (window.confirm('Delete this post?')) {
      savePosts(getPosts().filter((item) => item.id !== post.id));
      navigate('/blogs');
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link className="text-indigo-600" to="/blogs">Back to All Posts</Link>
      <article className="mt-6">
        <h1 className="text-4xl font-bold text-slate-800">{post.title}</h1>
        <div className="mt-5 flex items-center gap-3 text-slate-500">
          <Avatar role={post.authorRole || 'user'} />
          <span>{post.authorName}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <p className="mt-8 whitespace-pre-wrap text-lg leading-8 text-slate-700">{post.content}</p>
        {allowed && (
          <div className="mt-8 flex gap-3">
            <Link className="rounded-lg border border-indigo-200 bg-white px-4 py-2 font-medium text-indigo-600" to={`/edit/${post.id}`}>Edit</Link>
            <button className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600" onClick={remove}>Delete</button>
          </div>
        )}
      </article>
    </main>
  );
}