import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { SiFiverr, SiUpwork } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';
import Logo from './Logo';

const links = [
  { label: 'Home',      to: '/',          num: '01' },
  { label: 'About',     to: '/about',     num: '02' },
  { label: 'Services',  to: '/services',  num: '03' },
  { label: 'Portfolio', to: '/portfolio', num: '04' },
  { label: 'Blog',      to: '/blog',      num: '05' },
  { label: 'Contact',   to: '/contact',   num: '06' },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* ═══════════════ MAIN NAV BAR ═══════════════ */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0,    opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/6 py-3'
            : 'bg-transparent py-5'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" aria-label="Go to homepage">
            <Logo />
          </Link>

          {/* ── Desktop Links ── */}
          <ul className="hidden md:flex items-center gap-7 list-none">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`relative text-sm font-semibold transition-colors duration-200 pb-1 ${
                    isActive(l.to) ? 'text-accent' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  aria-current={isActive(l.to) ? 'page' : undefined}
                >
                  {l.label}
                  {isActive(l.to) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA + Mobile Hamburger ── */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-bold shadow-lg shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Hire Me
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden flex flex-col gap-[5px] justify-center items-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <span className="block w-5 h-[2px] bg-gray-700 rounded-full" />
              <span className="block w-5 h-[2px] bg-gray-700 rounded-full" />
              <span className="block w-3 h-[2px] bg-accent rounded-full self-start ml-1" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════ MOBILE MENU ═══════════════ */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="menu-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm z-[120] flex flex-col overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #0a0a0a 0%, #0a120a 60%, #040d04 100%)' }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,178,110,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(90,154,74,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

              <div className="relative flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
                <Logo dark />
                <motion.button
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close menu"
                >
                  <FiX size={18} />
                </motion.button>
              </div>

              <nav className="relative flex-1 flex flex-col justify-center px-8 gap-1" aria-label="Mobile navigation">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 60, opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="group w-full flex items-center gap-5 py-4 border-b border-white/8 hover:border-accent/40 transition-all duration-300"
                      aria-current={isActive(l.to) ? 'page' : undefined}
                    >
                      <span className="text-xs font-mono text-accent/60 group-hover:text-accent transition-colors w-6">{l.num}</span>
                      <span
                        className={`text-3xl font-display font-black tracking-tight transition-all duration-300 ${
                          isActive(l.to) ? 'text-transparent bg-clip-text' : 'text-white/80 group-hover:text-white'
                        }`}
                        style={isActive(l.to) ? {
                          background: 'linear-gradient(135deg, #7cb26e, #a3c89a)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        } : {}}
                      >
                        {l.label}
                      </span>
                      <span className="ml-auto text-accent/0 group-hover:text-accent/80 transition-colors text-xl">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ delay: 0.38, duration: 0.4 }}
                className="relative px-8 py-8 border-t border-white/10"
              >
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block w-full py-4 rounded-2xl text-white font-bold text-base text-center shadow-xl mb-6 transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #5a9a4a, #7cb26e)' }}
                >
                  Hire Me →
                </Link>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/30 font-medium uppercase tracking-widest">Find me on</p>
                  <div className="flex gap-3">
                    {[
                      { Icon: SiFiverr,   href: 'https://www.fiverr.com/s/dDa9lqa',                       bg: '#7cb26e', label: 'Fiverr'   },
                      { Icon: SiUpwork,   href: 'https://www.upwork.com/freelancers/~01db2b03b5a7f36be8', bg: '#7cb26e', label: 'Upwork'   },
                      { Icon: FaWhatsapp, href: 'https://wa.me/923359574017',                              bg: '#7cb26e', label: 'WhatsApp' },
                    ].map(({ Icon, href, bg, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = bg; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; }}
                      >
                        <Icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
