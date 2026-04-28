import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FaWordpress, FaShopify, FaReact, FaWhatsapp } from 'react-icons/fa';
import { SiFiverr, SiUpwork } from 'react-icons/si';

const roles = [
  'WordPress Developer',
  'Shopify Expert',
  'Frontend Developer',
  'UI/UX Enthusiast',
  'Freelance Dev',
];
const badges = [
  { icon: FaWordpress, label: 'WordPress', color: '#21759b' },
  { icon: FaShopify,   label: 'Shopify',   color: '#96bf48' },
  { icon: FaReact,     label: 'React',     color: '#61dafb' },
];

function SplitWord({ word, delay = 0, className = '' }) {
  return (
    <span className="inline-flex overflow-hidden" aria-hidden="true">
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          className={`hero-letter ${className}`}
          initial={{ y: '120%', opacity: 0, rotateX: -90 }}
          animate={{ y: '0%',   opacity: 1, rotateX: 0   }}
          transition={{ duration: 0.65, delay: delay + i * 0.05, ease: [0.33, 1, 0.68, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef  = useRef(null);
  const glowRef     = useRef(null);
  const shapeRef    = useRef(null);
  const [roleIdx,      setRoleIdx]      = useState(0);
  const [displayText,  setDisplayText]  = useState('');
  const [typing,       setTyping]       = useState(true);

  useEffect(() => {
    let t;
    const cur = roles[roleIdx];
    if (typing) {
      if (displayText.length < cur.length)
        t = setTimeout(() => setDisplayText(cur.slice(0, displayText.length + 1)), 75);
      else
        t = setTimeout(() => setTyping(false), 1800);
    } else {
      if (displayText.length > 0)
        t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 35);
      else { setRoleIdx(i => (i + 1) % roles.length); setTyping(true); }
    }
    return () => clearTimeout(t);
  }, [displayText, typing, roleIdx]);

  useEffect(() => {
    const section = sectionRef.current;
    const glow    = glowRef.current;
    const onMove  = (e) => {
      const rect = section.getBoundingClientRect();
      gsap.to(glow, { x: e.clientX - rect.left, y: e.clientY - rect.top, duration: 0.6, ease: 'power2.out' });
    };
    const onScroll = () => {
      if (shapeRef.current) gsap.to(shapeRef.current, { y: window.scrollY * 0.3, duration: 0.1 });
    };
    section.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { section.removeEventListener('mousemove', onMove); window.removeEventListener('scroll', onScroll); };
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Mouse spotlight */}
      <div ref={glowRef} className="absolute pointer-events-none" style={{
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,178,110,0.15) 0%, rgba(163,200,154,0.07) 40%, transparent 70%)',
        transform: 'translate(-50%,-50%)', zIndex: 1,
      }} />

      {/* BG shapes */}
      <div ref={shapeRef} className="absolute inset-0 pointer-events-none z-0">
        <div className="float1 absolute top-16 right-10 w-72 h-72 rounded-full bg-accent/8 blur-3xl" />
        <div className="float2 absolute bottom-24 left-8  w-56 h-56 rounded-full bg-accent/5 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="g" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#7cb26e" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
        <div className="hero-bg-text select-none">DEV</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-14 items-center w-full">

        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,   scale: 1   }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.34,1.56,0.64,1] }}
            className="shimmer-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 text-accent text-sm font-semibold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Available for freelance work
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl font-medium mb-2 tracking-wide"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Hi, I'm 👋
          </motion.p>

          <h1 className="font-display font-black leading-none tracking-tight mb-1" style={{ fontSize: 'clamp(52px,9vw,96px)' }}>
            <SplitWord word="AIZAZ" delay={0.55} className="gradient-text glow-text" />
          </h1>

          <h1 className="font-display font-black leading-none tracking-tight mb-6" style={{ fontSize: 'clamp(28px,5vw,52px)' }}>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ delay: 0.95, duration: 0.7, ease: [0.33,1,0.68,1] }}
              style={{ color: 'rgba(255,255,255,0.55)' }}
              className="font-bold"
            >
              ALI AFRIDI
            </motion.span>
          </h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mb-4">
            <span className="text-2xl md:text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <span className="text-accent typing-cursor">{displayText}</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7 }}
            className="text-base md:text-lg max-w-md leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            I craft pixel-perfect websites &amp; custom digital experiences —
            from WordPress &amp; Shopify stores to modern React frontends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <button
              onClick={() => scrollTo('portfolio')}
              data-cursor="WORK"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/35 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              View My Work <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://www.fiverr.com/s/dDa9lqa"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="HIRE"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#1dbf73]/50 text-[#1dbf73] font-bold text-sm hover:bg-[#1dbf73] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <SiFiverr size={15} /> Hire on Fiverr
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Connect</span>
            <div className="flex gap-2.5">
              {[
                { Icon: SiFiverr,   href: 'https://www.fiverr.com/s/dDa9lqa',                      label: 'Fiverr',   bg: '#1dbf73' },
                { Icon: SiUpwork,   href: 'https://www.upwork.com/freelancers/~01db2b03b5a7f36be8', label: 'Upwork',   bg: '#14a800' },
                { Icon: FaWhatsapp, href: 'https://wa.me/923359574017',                              label: 'WhatsApp', bg: '#25d366' },
              ].map(({ Icon, href, label, bg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-cursor={label.toUpperCase()}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = bg; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = bg; e.currentTarget.style.boxShadow = `0 4px 20px ${bg}55`; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = ''; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Profile card */}
        <motion.div
          initial={{ opacity: 0, x: 70, rotateY: 15 }}
          animate={{ opacity: 1, x: 0,  rotateY: 0  }}
          transition={{ duration: 1.1, delay: 0.7, ease: [0.34,1.56,0.64,1] }}
          className="relative hidden lg:block"
          style={{ perspective: '600px' }}
        >
          <div className="relative rounded-3xl p-8 border"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(124,178,110,0.06) 100%)', borderColor: 'rgba(255,255,255,0.1)' }}>

            <div className="relative w-40 h-44 mx-auto mb-3 flex items-end justify-center">
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle at 50% 60%, rgba(124,178,110,0.25) 0%, transparent 70%)', filter: 'blur(12px)' }} />
              <img src="/profile.png" alt="Aizaz Ali Afridi"
                className="relative w-full h-full object-contain object-bottom drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(124,178,110,0.3))' }} />
            </div>

            <h3 className="text-center text-xl font-display font-bold text-white">Aizaz Ali Afridi</h3>
            <p className="text-center text-sm text-accent font-semibold mt-0.5">Freelance Developer</p>
            <p className="text-center text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>📍 Islamabad, Pakistan</p>

            <div className="mt-5 flex justify-center flex-wrap gap-2">
              {badges.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                  <Icon color={color} size={13} /> {label}
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[{ val:'50+',label:'Projects'},{val:'3+',label:'Years'},{val:'40+',label:'Clients'}].map(({ val, label }) => (
                <div key={label} className="text-center rounded-2xl py-3 border"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-2xl font-black gradient-text">{val}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="https://www.fiverr.com/s/dDa9lqa" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ background: 'rgba(29,191,115,0.12)', color: '#1dbf73' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1dbf73'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(29,191,115,0.12)'; e.currentTarget.style.color = '#1dbf73'; }}>
                <SiFiverr size={13} /> Fiverr
              </a>
              <a href="https://www.upwork.com/freelancers/~01db2b03b5a7f36be8" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ background: 'rgba(20,168,0,0.12)', color: '#14a800' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#14a800'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,168,0,0.12)'; e.currentTarget.style.color = '#14a800'; }}>
                <SiUpwork size={13} /> Upwork
              </a>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-5 -right-5 rounded-2xl px-4 py-2.5 shadow-xl text-sm font-bold flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', backdropFilter: 'blur(12px)' }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            Open to work
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-5 -left-5 rounded-2xl px-4 py-2.5 shadow-xl text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', backdropFilter: 'blur(12px)' }}
          >
            ⚡ Fast Delivery
          </motion.div>

          <div className="absolute -inset-4 rounded-[2.5rem] border border-accent/10 pointer-events-none" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs z-10"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        <span className="tracking-widest uppercase text-[10px]">Scroll</span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="w-5 h-9 rounded-full border-2 flex items-start justify-center pt-1.5"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="w-1 h-2.5 rounded-full bg-gradient-to-b from-accent to-accent-light" />
        </motion.div>
      </motion.div>
    </section>
  );
}
