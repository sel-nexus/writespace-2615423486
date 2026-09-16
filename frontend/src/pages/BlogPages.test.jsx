import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import WriteBlog from './WriteBlog.jsx';
import ReadBlog from './ReadBlog.jsx';
import Home from './Home.jsx';
const writer = { userId: 'u1', username: 'writer', displayName: 'Writer', role: 'user' };
const post = { id: 'p1', title: 'Other post', content: 'Saved content', createdAt: '2024-01-01T00:00:00.000Z', authorId: 'u2', authorName: 'Other' };
const session = () => localStorage.setItem('writespace_session', JSON.stringify(writer));
describe('blog pages', () => {
  it('validates title and content before saving', async () => {
    session();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <WriteBlog />
      </BrowserRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('creates an owned local post', async () => {
    session();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <WriteBlog />
      </BrowserRouter>,
    );

    await user.type(screen.getByLabelText('Title'), 'A local thought');
    await user.type(screen.getByLabelText('Content'), 'It persists.');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const saved = JSON.parse(localStorage.getItem('writespace_posts'))[0];
    expect(saved.authorId).toBe('u1');
    expect(saved.title).toBe('A local thought');
  });

  it('updates an owned post and routes to its readable result', async () => {
    session();
    localStorage.setItem(
      'writespace_posts',
      JSON.stringify([{ ...post, authorId: 'u1', authorName: 'Writer' }]),
    );

    render(
      <MemoryRouter initialEntries={['/edit/p1']}>
        <Routes>
          <Route path="/edit/:id" element={<WriteBlog />} />
          <Route path="/blog/:id" element={<ReadBlog />} />
        </Routes>
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'Updated post');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('heading', { name: 'Updated post' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('writespace_posts'))[0].title).toBe('Updated post');
  });

  it.each([['unauthorized', [post]], ['missing', []]])(
    'redirects %s edit requests to the post listing',
    (kind, posts) => {
      session();
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      render(
        <MemoryRouter initialEntries={['/edit/p1']}>
          <Routes>
            <Route path="/edit/:id" element={<WriteBlog />} />
            <Route path="/blogs" element={<h1>All Posts</h1>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByRole('heading', { name: 'All Posts' })).toBeInTheDocument();
    },
  );

  it('does not expose mutations on another writers post', () => {
    session();
    localStorage.setItem('writespace_posts', JSON.stringify([post]));

    render(
      <MemoryRouter initialEntries={['/blog/p1']}>
        <Routes>
          <Route path="/blog/:id" element={<ReadBlog />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(screen.getByText('Other post')).toBeInTheDocument();
  });

  it('shows a meaningful empty listing', () => {
    session();

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    expect(screen.getByText('No blogs yet. Be the first to write one!')).toBeInTheDocument();
  });
});