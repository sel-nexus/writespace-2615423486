import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import PublicNavbar from './components/PublicNavbar.jsx';
/** Provide the initial public route while feature routes are added in subsequent slices. */
export default function App() { const location = useLocation(); return <><PublicNavbar /><Routes><Route path="*" element={<LandingPage key={location.pathname} />} /></Routes></>; }