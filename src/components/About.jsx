import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FiCode, FiLayers, FiMonitor, FiSmartphone } from 'react-icons/fi';
import { FaWordpress, FaShopify, FaReact, FaJs } from 'react-icons/fa';
import { SiFigma, SiTailwindcss } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: 'WordPress / WooCommerce', pct: 95 },
  { name: 'Shopify / Liquid',        pct: 90 },
  { name: 'React / Next.js',         pct: 85 },
  { name: 'HTML / CSS / Tailwind',   pct: 95 },
  { name: 'JavaScript / TypeScript', pct: 82 },
  { name: 'UI/UX Design (Figma)',    pct: 75 },
];

const highlights = [
  { icon: FiCode,       title: 'Clean Code',    desc: 'Maintainable, scalable, well-structured code.' },
  { icon: FiLayers,     title: 'Pixel Perfect', desc: 'Every detail crafted with precision and care.'  },
  { icon: FiMonitor,    title: 'Performance',   desc: 'Optimized for speed and Core Web Vitals.'       },
  { icon: FiSmartphone, title: 'Responsive',    desc: 'Flawless on every screen size and device.'      },
];

const techIcons = [
  { icon: FaWordpress,   color: '#7cb26e', label: 'WordPress',  top: '4%',  left: '-40%', dur: 3.2, delay: 0   },
  { icon: FaShopify,     color: '#7cb26e', label: 'Shopify',    top: '38%', left: '-44%', dur: 4.1, delay: 0.5 },
  { icon: SiFigma,       color: '#7cb26e', label: 'Figma',      top: '72%', left: '-38%', dur: 3.6, delay: 1.0 },
  { icon: FaReact,       color: '#7cb26e', label: 'React',      top: '4%',  right: '-40%',dur: 3.8, delay: 0.3 },
  { icon: SiTailwindcss, color: '#7cb26e', label: 'Tailwind',   top: '38%', right: '-44%',dur: 4.4, delay: 0.8 },
  { icon: FaJs,          color: '#7cb26e', label: 'JavaScript', top: '72%', right: '-42%',dur: 3.0, delay: 0.6 },
];

const D = {
  chip:   'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  track:  'rgba(255,255,255,0.08)',
  text:   'rgba(255,255,255,0.55)',
  muted:  'rgba(255,255,255,0.35)',
};

export default function About() {
  const sectionRef   = useRef(null);
  const headRef      = useRef(null);
  const textRef      = useRef(null);
  const skillsRef    = useRef(null);
  const cardsRef     = useRef(null);
  const imageWrapRef = useRef(null);
  const glowRef      = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageWrapRef.current,
        { y: '-65vh', x: '8vw', scale: 0.32, opacity: 0, rotateZ: 8 },
        { y: 0, x: 0, scale: 1, opacity: 1, rotateZ: 0, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', end: 'top 15%', scrub: 2 } }
      );
      gsap.fromTo(glowRef.current, { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'top 20%', scrub: 1 } }
      );
      gsap.from(headRef.current, { scrollTrigger: { trigger: headRef.current, start: 'top 85%' }, y: 60, opacity: 0, duration: 0.9, ease: 'power4.out' });
      gsap.from(textRef.current, { scrollTrigger: { trigger: textRef.current, start: 'top 85%' }, x: -50, opacity: 0, duration: 0.9, ease: 'power3.out' });
      skillsRef.current?.querySelectorAll('.skill-fill').forEach((bar, i) => {
        gsap.to(bar, { scrollTrigger: { trigger: bar, start: 'top 90%' }, scaleX: 1, duration: 1.2, delay: i * 0.12, ease: 'power3.out' });
      });
      gsap.from(cardsRef.current?.querySelectorAll('.h-card'), {
        scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' }, y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-6">

        <div ref={headRef} className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Who I Am</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="mt-4 mx-auto section-line animate" />
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr_300px] gap-6 lg:gap-10 lg:items-end">

          {/* Col 1: Bio + skills */}
          <div ref={textRef}>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white">Aizaz Ali Afridi</h3>
              <p className="text-accent text-sm font-medium">Freelance Developer &amp; Designer</p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: D.text }}>
                With over 3 years of experience, I specialise in building high-performance websites and web applications. I've helped 40+ clients launch successful WordPress stores, Shopify e-commerce sites, and custom React frontends — always focusing on speed, UX, and business results.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'Location',      val: 'Islamabad, PK' },
                { label: 'Experience',    val: '3+ Years'      },
                { label: 'Projects Done', val: '50+'           },
                { label: 'Happy Clients', val: '40+'           },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-xl px-4 py-3 border" style={{ background: D.chip, borderColor: D.border }}>
                  <p className="text-xs font-medium" style={{ color: D.muted }}>{label}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{val}</p>
                </div>
              ))}
            </div>

            <div ref={skillsRef} className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: D.muted }}>Skill Proficiency</h4>
              {skills.map(({ name, pct }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-white/80">{name}</span>
                    <span className="text-accent font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: D.track }}>
                    <div className="skill-fill h-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile image */}
            <div className="lg:hidden flex justify-center mt-4">
              <div className="relative w-48 overflow-hidden" style={{ maxHeight: '260px' }}>
                <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center bottom, rgba(124,178,110,0.18) 0%, transparent 70%)', filter: 'blur(16px)' }} />
                <img src="/about-us.png" alt="Aizaz Ali Afridi"
                  className="relative w-full h-auto select-none object-top"
                  style={{ filter: 'drop-shadow(0 12px 32px rgba(124,178,110,0.26))' }} />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-xl px-3 py-1.5 shadow-lg text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Open to work
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Highlight cards + experience */}
          <div>
            <div ref={cardsRef} className="grid grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, title, desc }) => (
                <div key={title}
                  className="h-card group rounded-2xl p-5 border transition-all duration-300 cursor-default"
                  style={{ background: D.chip, borderColor: D.border }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,178,110,0.35)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,178,110,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <h4 className="font-bold text-white mb-1">{title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: D.muted }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: D.muted }}>Experience</h4>
              {[
                { year: 'Apr 2026 – Present', role: 'WordPress Developer',        company: 'Vision Tact · Full-time · Islamabad'        },
                { year: 'Sep 2025 – Present', role: 'WordPress Developer',        company: 'Advanced Datalytics · Part-time · Remote'   },
                { year: 'Jan 2024 – Apr 2026', role: 'WordPress Developer',       company: 'Hexa IT Solutions · Full-time · 2 yrs 4 mos'},
                { year: 'Mar – Jun 2025',      role: 'WordPress & Shopify Dev',   company: 'Swiftwave Digital · Part-time · Remote'     },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-accent mt-1.5" />
                    {i < 3 && <div className="w-0.5 h-10 mt-1" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                  </div>
                  <div>
                    <p className="text-xs text-accent font-semibold">{item.year}</p>
                    <p className="text-sm font-bold text-white">{item.role}</p>
                    <p className="text-xs" style={{ color: D.muted }}>{item.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Col 3: Image + floating icons */}
          <div ref={imageWrapRef} className="relative hidden lg:block">
            <div ref={glowRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full" style={{
              width: 340, height: 340,
              background: 'radial-gradient(circle, rgba(124,178,110,0.25) 0%, rgba(163,200,154,0.10) 45%, transparent 70%)',
              filter: 'blur(36px)', zIndex: 0,
            }} />
            <motion.img src="/about-us.png" alt="Aizaz Ali Afridi"
              className="relative z-10 w-full select-none"
              style={{ display: 'block', height: 'auto', filter: 'drop-shadow(0 20px 50px rgba(124,178,110,0.30))' }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            />
            {techIcons.map(({ icon: Icon, color, label, top, left, right, dur, delay: d }) => (
              <motion.div
                key={label}
                className="absolute z-20 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 select-none"
                style={{ top, left, right, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: dur, repeat: Infinity, delay: d, ease: 'easeInOut' }}
                whileHover={{ scale: 1.12, boxShadow: `0 8px 24px ${color}40` }}
              >
                <Icon size={15} color={color} />
                <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</span>
              </motion.div>
            ))}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 left-1/2 -translate-x-1/2 rounded-2xl px-3 py-2 shadow-xl text-xs font-bold text-white flex items-center gap-1.5 z-30 whitespace-nowrap"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Open to work
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-12 right-0 rounded-2xl px-3 py-2 shadow-xl z-30 text-center"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            >
              <p className="gradient-text text-xl font-black leading-none">50+</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Projects Done</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
