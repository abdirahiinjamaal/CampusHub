import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {
  const [student, setStudent] = useState(() => JSON.parse(localStorage.getItem('horizonStudent') || 'null'));
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { if (student) localStorage.setItem('horizonStudent', JSON.stringify(student)); else localStorage.removeItem('horizonStudent'); }, [student]);
  const login = (value) => { setStudent(value); navigate('/student'); };
  const logout = () => { localStorage.removeItem('horizonToken'); setStudent(null); navigate('/'); };
  return <Routes>
    <Route path="/" element={student ? <Navigate to="/student" replace /> : <Login onLogin={login} />} />
    <Route path="/student/*" element={student ? <StudentDashboard student={student} onLogout={logout} /> : <Navigate to="/" state={{ from: location }} replace />} />
  </Routes>;
}
