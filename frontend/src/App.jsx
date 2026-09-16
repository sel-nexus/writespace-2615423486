import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Home from './pages/Home.jsx';
import ReadBlog from './pages/ReadBlog.jsx';
import WriteBlog from './pages/WriteBlog.jsx';
import PublicNavbar from './components/PublicNavbar.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { getSession } from './utils/auth.js';
const Placeholder = ({ title }) => <main className="mx-auto max-w-6xl px-4 py-12"><h1 className="text-3xl font-bold">{title}</h1></main>;
/** Route WriteSpace pages and select public or authenticated navigation. */
export default function App() { const session = getSession(); const location = useLocation(); const auth = ['/blogs','/write','/admin','/users'].some((path) => location.pathname.startsWith(path)); return <>{auth && session ? <Navbar /> : <PublicNavbar />}<Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="/blogs" element={<ProtectedRoute><Home /></ProtectedRoute>} /><Route path="/blog/:id" element={<ProtectedRoute><ReadBlog /></ProtectedRoute>} /><Route path="/write" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} /><Route path="/edit/:id" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} /><Route path="/admin" element={<ProtectedRoute adminOnly><Placeholder title="Dashboard" /></ProtectedRoute>} /><Route path="/users" element={<ProtectedRoute adminOnly><Placeholder title="Users" /></ProtectedRoute>} /><Route path="*" element={<LandingPage />} /></Routes></>; }