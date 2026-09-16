import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import LandingPage from './LandingPage.jsx';

const renderPage = () => render(<BrowserRouter><LandingPage /></BrowserRouter>);

describe('LandingPage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => delete window.__WRITESPACE_TEST_LATEST_WRITING_DELAY_MS__);

  it('shows a loading status before local posts hydrate, then the resolved empty state', async () => {
    expect(renderToString(<BrowserRouter><LandingPage /></BrowserRouter>)).toContain('role="status"');
    expect(renderToString(<BrowserRouter><LandingPage /></BrowserRouter>)).toContain('Loading latest writing…');

    renderPage();

    expect(screen.getByRole('heading', { name: 'WriteSpace' })).toBeInTheDocument();
    expect(await screen.findByText('No posts yet — check back soon!')).toBeInTheDocument();
  });

  it('keeps the loading status visible when browser tests configure a hydration delay', async () => {
    window.__WRITESPACE_TEST_LATEST_WRITING_DELAY_MS__ = 50;

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Loading latest writing…');
    expect(await screen.findByText('No posts yet — check back soon!')).toBeInTheDocument();
  });

  it('shows no more than the newest three local posts', async () => {
    localStorage.setItem('writespace_posts', JSON.stringify([1, 2, 3, 4].map((id) => ({ id: String(id), title: `Post ${id}`, content: 'Text', createdAt: `2024-01-0${id}T00:00:00.000Z`, authorName: 'Writer' }))));

    renderPage();

    expect(await screen.findByText('Post 4')).toBeInTheDocument();
    expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
  });
});