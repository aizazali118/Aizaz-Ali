import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { SiFiverr, SiUpwork } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';
import Logo from './Logo';

const links = [
  { label: 'Home',      href: 'home',      num: '01', scroll: true  },
  { label: 'About',     href: 'about',     num: '02', scroll: true  },
  { label: 'Services',  href: 'services',  num: '03', scroll: true  },
  { label: 'Portfolio', href: 'portfolio', num: '04', scroll: true  },
  { label: 'Blog',      href: '/blog',     num: '05', scroll: false },
  { label: 'Contact',   href: 'contact',   num: '06', scroll: true  },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState('home');
  const navigate   = useNavigate();
  const location   = useLocation();

  const scrollTo = (id, cb) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        if (cb) cb();
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      if (cb) cb();
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      for (let i = links.length - 1; i >= 0; i--) {
        if (!links[i].scroll) continue;
        const el = document.getElementById(links[i].href);
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActive(links[i].href);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (l) => {
    if (!l.scroll) return location.pathname.startsWith('/blog');
    return active === l.href && location.pathname === '/';
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
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* ── Logo ── */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2 group" aria-label="Go to homepage">
            <Logo />
          </button>

          {/* ── Desktop Links ── */}
          <ul className="hidden md:flex items-center gap-7 list-none">
            {links.map((l) => (
              <li key={l.href}>
                {l.scroll ? (
                  <button
                    onClick={() => scrollTo(l.href)}
                    className={`relative text-sm font-semibold transition-colors duration-200 pb-1 ${
                      isActive(l) ? 'text-accent' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {l.label}
                    {isActive(l) && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    to={l.href}
                    className={`relative text-sm font-semibold transition-colors duration-200 pb-1 ${
                      isActive(l) ? 'text-accent' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {l.label}
                    {isActive(l) && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA + Mobile Hamburger ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo('contact')}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-bold shadow-lg shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Hire Me
            </button>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden flex flex-col gap-[5px] justify-center items-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Open menu"
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
            >
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,178,110,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(90,154,74,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

              {/* Header row */}
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

              {/* Nav links */}
              <nav className="relative flex-1 flex flex-col justify-center px-8 gap-1" aria-label="Mobile navigation">
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 60, opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.33, 1, 0.68, 1] }}
                  >
                    {l.scroll ? (
                      <button
                        onClick={() => { scrollTo(l.href); setOpen(false); }}
                        className="group w-full flex items-center gap-5 py-4 border-b border-white/8 hover:border-accent/40 transition-all duration-300"
                      >
                        <span className="text-xs font-mono text-accent/60 group-hover:text-accent transition-colors w-6">{l.num}</span>
                        <span className={`text-3xl font-display font-black tracking-tight transition-all duration-300 ${
                          isActive(l) ? 'text-transparent bg-clip-text' : 'text-white/80 group-hover:text-white'
                        }`}
                          style={isActive(l) ? {
                            background: 'linear-gradient(135deg, #7cb26e, #a3c89a)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          } : {}}
                        >
                          {l.label}
                        </span>
                        <span className="ml-auto text-accent/0 group-hover:text-accent/80 transition-colors text-xl">→</span>
                      </button>
                    ) : (
                      <Link
                        to={l.href}
                        onClick={() => setOpen(false)}
                        className="group w-full flex items-center gap-5 py-4 border-b border-white/8 hover:border-accent/40 transition-all duration-300"
                      >
                        <span className="text-xs font-mono text-accent/60 group-hover:text-accent transition-colors w-6">{l.num}</span>
                        <span className={`text-3xl font-display font-black tracking-tight transition-all duration-300 ${
                          isActive(l) ? 'text-transparent bg-clip-text' : 'text-white/80 group-hover:text-white'
                        }`}
                          style={isActive(l) ? {
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
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA + socials */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ delay: 0.38, duration: 0.4 }}
                className="relative px-8 py-8 border-t border-white/10"
              >
                <button
                  onClick={() => { scrollTo('contact'); setOpen(false); }}
                  className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-xl mb-6 transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #5a9a4a, #7cb26e)' }}
                >
                  Hire Me →
                </button>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/30 font-medium uppercase tracking-widest">Find me on</p>
                  <div className="flex gap-3">
                    {[
                      { Icon: SiFiverr,   href: 'https://www.fiverr.com/s/dDa9lqa',                       bg: '#1dbf73', label: 'Fiverr'   },
                      { Icon: SiUpwork,   href: 'https://www.upwork.com/freelancers/~01db2b03b5a7f36be8', bg: '#14a800', label: 'Upwork'   },
                      { Icon: FaWhatsapp, href: 'https://wa.me/923359574017',                              bg: '#25d366', label: 'WhatsApp' },
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
