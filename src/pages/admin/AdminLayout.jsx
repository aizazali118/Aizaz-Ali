import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import {
  FiHome, FiFileText, FiPlusCircle, FiLogOut, FiMenu, FiX, FiExternalLink,
} from 'react-icons/fi';
import { useState } from 'react';

const nav = [
  { to: '/admin/dashboard', Icon: FiHome,       label: 'Dashboard'    },
  { to: '/admin/posts',     Icon: FiFileText,    label: 'All Posts'    },
  { to: '/admin/posts/new', Icon: FiPlusCircle,  label: 'New Post'     },
];

function NavItem({ to, Icon, label, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/admin/dashboard' && pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
        active
          ? 'bg-accent text-white shadow-lg shadow-accent/30'
          : 'text-white/60 hover:text-white hover:bg-white/8'
      }`}
    >
      <Icon size={16} /> {label}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const { admin, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );

  if (!admin) return <Navigate to="/admin" replace />;

  const sidebar = (
    <aside className="flex flex-col h-full p-5">
      <div className="mb-8">
        <Logo dark size={32} />
        <p className="text-white/30 text-xs mt-2 ml-1">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1" aria-label="Admin navigation">
        {nav.map(item => (
          <NavItem key={item.to} {...item} onClick={() => setOpen(false)} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto space-y-3 pt-5 border-t border-white/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/8 transition-all"
        >
          <FiExternalLink size={16} /> View Site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <FiLogOut size={16} /> Sign Out
        </button>
        <div className="px-4 py-3">
          <p className="text-xs text-white/30 truncate">{admin.email}</p>
          <p className="text-xs text-white/50 font-semibold">{admin.name}</p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <div
        className="hidden lg:flex flex-col w-60 shrink-0 fixed top-0 left-0 h-full z-30"
        style={{ background: 'linear-gradient(160deg, #040a04 0%, #0a120a 100%)' }}
      >
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div
            className="relative w-60 h-full flex flex-col z-50"
            style={{ background: 'linear-gradient(160deg, #040a04 0%, #0a120a 100%)' }}
          >
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            aria-label="Open menu"
          >
            <FiMenu size={18} />
          </button>
          <Logo size={28} />
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
