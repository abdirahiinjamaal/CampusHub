import { ArrowRight, BookOpen, CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';

export default function Landing() {
  return <main className="landing-page">
    <header className="landing-header"><Link to="/" className="brand-link"><BrandMark /></Link><Link to="/login" className="landing-login-link">Student login <ArrowRight size={16} /></Link></header>
    <section className="landing-hero"><div className="landing-copy"><p className="eyebrow">HORIZON UNIVERSITY · EST. 1987</p><h1>A place to<br /><em>find your horizon.</em></h1><p className="landing-intro">A considered education for curious minds. Learn with purpose, build with confidence, and make your mark beyond the classroom.</p><Link to="/login" className="landing-primary-btn">Enter student portal <ArrowRight size={18} /></Link></div><div className="landing-visual" aria-label="Horizon University campus illustration"><div className="visual-sun" /><div className="visual-grid" /><div className="visual-building"><span className="building-roof" /><span className="building-body"><i /><i /><i /><i /><i /><i /><i /><i /></span><span className="building-door" /></div><div className="visual-ground" /><span className="visual-caption">01 / CAMPUS LIFE</span></div></section>
    <section className="landing-strip"><div><BookOpen size={19} /><span><strong>Learn deeply</strong><small>Small classes, serious thinking</small></span></div><div><CalendarDays size={19} /><span><strong>Shape your future</strong><small>Programs made for what’s next</small></span></div><div><MapPin size={19} /><span><strong>Nairobi, Kenya</strong><small>A global outlook, rooted here</small></span></div></section>
    <footer className="landing-footer"><span>© 2026 Horizon University</span><span>For students, by design.</span></footer>
  </main>;
}
