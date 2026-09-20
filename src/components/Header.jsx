import { Menu, X, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function Header({ student, onLogout, menuOpen, setMenuOpen }) {
  const links = [['/student', 'Dashboard'], ['/student/results', 'Results'], ['/student/fees', 'Fees'], ['/student/transcript', 'Transcript']];
  return <header className="site-header"><div className="header-inner"><NavLink to="/student" className="brand-link"><BrandMark /></NavLink><button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button><nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/student'} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}<div className="nav-divider" /><div className="profile-chip"><span className="avatar">{student.fullName.split(' ').map(n => n[0]).join('')}</span><span>{student.fullName}</span></div><button className="logout-btn" onClick={onLogout}><LogOut size={16} /> Log out</button></nav></div></header>;
}
