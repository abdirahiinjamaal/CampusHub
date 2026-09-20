import { ArrowUpRight } from 'lucide-react';
export default function StatCard({ label, value, detail, accent = 'mint' }) { return <div className={`stat-card ${accent}`}><div className="stat-top"><span>{label}</span><ArrowUpRight size={17} /></div><strong>{value}</strong>{detail && <small>{detail}</small>}</div>; }
