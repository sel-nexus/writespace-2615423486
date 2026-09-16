import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PublicNavbar from './components/PublicNavbar.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { getSession } from './utils/auth.js';
const Placeholder = ({ title }) => <main className="mx-auto max-w-6xl px-4 py-12"><h1 className="text-3xl font-bold">{title}</h1></main>;
/** Route WriteSpace pages and select public or authenticated navigation. */
export default function App() { const session = getSession(); const location = useLocation(); const auth = ['/blogs','/write','/admin','/users'].some((path) => location.pathname.startsWith(path)); return <>{auth && session ? <Navbar /> : <PublicNavbar />}<Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="/blogs" element={<ProtectedRoute><Placeholder title="All Blogs" /></ProtectedRoute>} /><Route path="/write" element={<ProtectedRoute><Placeholder title="Write" /></ProtectedRoute>} /><Route path="/admin" element={<ProtectedRoute adminOnly><Placeholder title="Dashboard" /></ProtectedRoute>} /><Route path="/users" element={<ProtectedRoute adminOnly><Placeholder title="Users" /></ProtectedRoute>} /><Route path="*" element={<LandingPage />} /></Routes></>; }