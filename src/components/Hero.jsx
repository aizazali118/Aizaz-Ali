import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SiFiverr, SiUpwork, SiLinkedin } from 'react-icons/si';

const roles = [
  'WordPress Developer',
  'Shopify Expert',
  'Front-End Developer',
  'UI/UX Enthusiast',
  'Freelance Dev',
];

export default function Hero() {
  const [roleIdx,     setRoleIdx]     = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [typing,      setTyping]      = useState(true);

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

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="hero-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#7cb26e" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

      {/* Right ambient glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,178,110,0.13) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 grid lg:grid-cols-2 gap-12 items-center w-full">

        {/* ── LEFT ── */}
        <div>
          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1,  y: 0,   scale: 1   }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 text-accent text-sm font-semibold mb-6"
            style={{ background: 'rgba(124,178,110,0.08)' }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Available for Freelance Work
          </motion.div>

          {/* Name heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1,  y: 0   }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            <p className="text-xl md:text-2xl font-medium mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Hi, I'm
            </p>
            <h1
              className="font-display font-black leading-none mb-1 gradient-text"
              style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}
            >
              Aizaz Ali
            </h1>
            <h2
              className="font-display font-black leading-none mb-5 text-white"
              style={{ fontSize: 'clamp(28px, 4.5vw, 52px)' }}
            >
              Web Developer
            </h2>
          </motion.div>

          {/* Typing role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-5 h-8 flex items-center"
          >
            <span className="text-xl font-bold text-accent">{displayText}</span>
            <span className="text-accent text-xl ml-0.5 animate-pulse font-bold">|</span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1,  y: 0   }}
            transition={{ delay: 0.72, duration: 0.6 }}
            className="text-base leading-relaxed mb-8 max-w-md"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            WordPress · Shopify · Front-End Developer crafting fast, beautiful,
            and conversion-optimised websites. 3+ years delivering top-tier
            results on Fiverr &amp; Upwork.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1,  y: 0   }}
            transition={{ delay: 0.88, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <button
              onClick={() => scrollTo('portfolio')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              View My Work <FiArrowRight size={14} />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm border hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
            >
              Get In Touch
            </button>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
            className="flex items-center gap-3"
          >
            {[
              { Icon: SiFiverr,   href: 'https://www.fiverr.com/s/gD71ldb',                       label: 'Fiverr'   },
              { Icon: SiUpwork,   href: 'https://www.upwork.com/freelancers/~01db2b03b5a7f36be8', label: 'Upwork'   },
              { Icon: SiLinkedin, href: 'https://www.linkedin.com/in/aizaz-ali-afridi/',          label: 'LinkedIn' },
              { Icon: FaWhatsapp, href: 'https://wa.me/923359574017',                             label: 'WhatsApp' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#7cb26e'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#7cb26e'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,178,110,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <Icon size={16} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT — Circular profile ── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1,  x: 0  }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative hidden lg:flex items-center justify-center"
        >
          <div className="relative">
            {/* Glow behind circle */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ transform: 'scale(1.25)', background: 'radial-gradient(circle, rgba(124,178,110,0.22) 0%, transparent 70%)', filter: 'blur(24px)' }}
            />

            {/* Photo */}
            <div
              className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border-4"
              style={{ borderColor: 'rgba(124,178,110,0.4)', boxShadow: '0 0 60px rgba(124,178,110,0.2), 0 0 120px rgba(124,178,110,0.1)' }}
            >
              <img
                src="/profile.png"
                alt="Aizaz Ali Afridi"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Badge: Years Exp */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-2 rounded-2xl px-4 py-2.5 text-center shadow-xl"
              style={{ background: '#7cb26e' }}
            >
              <p className="text-2xl font-black text-white leading-none">4+</p>
              <p className="text-[10px] font-semibold text-white/90 mt-0.5">Years Exp</p>
            </motion.div>

            {/* Badge: Projects */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 rounded-2xl px-4 py-2.5 text-center shadow-xl"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
            >
              <p className="text-2xl font-black text-white leading-none">50+</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Projects Done</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="w-5 h-9 rounded-full border-2 flex items-start justify-center pt-1.5"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="w-1 h-2.5 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
