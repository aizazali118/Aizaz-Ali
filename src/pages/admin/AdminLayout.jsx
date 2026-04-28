import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import {
  FiHome, FiFileText, FiPlusCircle, FiLogOut, FiMenu, FiExternalLink,
  FiGrid, FiLayers, FiStar,
} from 'react-icons/fi';
import { useState } from 'react';

const nav = [
  { to: '/admin/dashboard',    Icon: FiHome,       label: 'Dashboard',    group: 'main'    },
  { to: '/admin/posts',        Icon: FiFileText,   label: 'Blog Posts',   group: 'content' },
  { to: '/admin/posts/new',    Icon: FiPlusCircle, label: 'New Post',     group: 'content' },
  { to: '/admin/portfolio',    Icon: FiGrid,       label: 'Portfolio',    group: 'content' },
  { to: '/admin/services',     Icon: FiLayers,     label: 'Services',     group: 'content' },
  { to: '/admin/testimonials', Icon: FiStar,       label: 'Testimonials', group: 'content' },
];

const D = {
  bg:      '#0d0f0d',
  sidebar: 'linear-gradient(160deg, #040a04 0%, #0a120a 100%)',
  card:    'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.08)',
  text:    'rgba(255,255,255,0.9)',
  muted:   'rgba(255,255,255,0.4)',
};

function NavItem({ to, Icon, label, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/admin/dashboard' && pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-white/55 hover:text-white hover:bg-white/8'
      }`}
    >
      <Icon size={15} /> {label}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const { admin, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: D.bg }}>
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );

  if (!admin) return <Navigate to="/admin" replace />;

  const groups = {
    main:    nav.filter(n => n.group === 'main'),
    content: nav.filter(n => n.group === 'content'),
  };

  const sidebar = (
    <aside className="flex flex-col h-full p-5">
      <div className="mb-7">
        <Logo dark size={32} />
        <p className="text-[10px] font-bold uppercase tracking-widest mt-2 ml-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Admin Panel
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-1" aria-label="Admin navigation">
        {groups.main.map(item => (
          <NavItem key={item.to} {...item} onClick={() => setOpen(false)} />
        ))}
        <p className="text-[9px] font-bold uppercase tracking-widest mt-5 mb-1 px-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Content
        </p>
        {groups.content.map(item => (
          <NavItem key={item.to} {...item} onClick={() => setOpen(false)} />
        ))}
      </nav>

      <div className="mt-auto space-y-1 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/8 transition-all"
        >
          <FiExternalLink size={15} /> View Site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <FiLogOut size={15} /> Sign Out
        </button>
        <div className="px-4 pt-3">
          <p className="text-xs font-bold text-white/70 truncate">{admin.name}</p>
          <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{admin.email}</p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ background: D.bg }}>
      {/* Desktop sidebar */}
      <div
        className="hidden lg:flex flex-col w-60 shrink-0 fixed top-0 left-0 h-full z-30"
        style={{ background: D.sidebar }}
      >
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-60 h-full flex flex-col z-50" style={{ background: D.sidebar }}>
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center gap-4 px-5 py-4 sticky top-0 z-20"
          style={{ background: '#0a0f0a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl transition"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            aria-label="Open menu"
          >
            <FiMenu size={18} className="text-white" />
          </button>
          <Logo dark size={28} />
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
