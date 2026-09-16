import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LandingPage from './LandingPage.jsx';
const renderPage = () => render(<BrowserRouter><LandingPage /></BrowserRouter>);
describe('LandingPage', () => { it('shows discovery content and the empty post message', () => { renderPage(); expect(screen.getByRole('heading', { name: 'WriteSpace' })).toBeInTheDocument(); expect(screen.getByText('No posts yet — check back soon!')).toBeInTheDocument(); }); it('shows no more than the newest three local posts', () => { localStorage.setItem('writespace_posts', JSON.stringify([1, 2, 3, 4].map((id) => ({ id: String(id), title: `Post ${id}`, content: 'Text', createdAt: `2024-01-0${id}T00:00:00.000Z`, authorName: 'Writer' })))); renderPage(); expect(screen.getByText('Post 4')).toBeInTheDocument(); expect(screen.queryByText('Post 1')).not.toBeInTheDocument(); }); });