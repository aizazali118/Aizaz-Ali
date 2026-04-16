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

/* ── Floating tech icons around image ── */
const techIcons = [
  { icon: FaWordpress,   color: '#21759b', label: 'WordPress',  top: '4%',  left: '-40%', dur: 3.2, delay: 0   },
  { icon: FaShopify,     color: '#96bf48', label: 'Shopify',    top: '38%', left: '-44%', dur: 4.1, delay: 0.5 },
  { icon: SiFigma,       color: '#f24e1e', label: 'Figma',      top: '72%', left: '-38%', dur: 3.6, delay: 1.0 },
  { icon: FaReact,       color: '#61dafb', label: 'React',      top: '4%',  right: '-40%',dur: 3.8, delay: 0.3 },
  { icon: SiTailwindcss, color: '#06b6d4', label: 'Tailwind',   top: '38%', right: '-44%',dur: 4.4, delay: 0.8 },
  { icon: FaJs,          color: '#f0c000', label: 'JavaScript', top: '72%', right: '-42%',dur: 3.0, delay: 0.6 },
];

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

      // ── Full image descends from hero section above ──
      gsap.fromTo(imageWrapRef.current,
        { y: '-65vh', x: '8vw', scale: 0.32, opacity: 0, rotateZ: 8 },
        {
          y: 0, x: 0, scale: 1, opacity: 1, rotateZ: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            end: 'top 15%',
            scrub: 2,
          },
        }
      );

      // ── Glow blooms behind image ──
      gsap.fromTo(glowRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'top 20%', scrub: 1 },
        }
      );

      // Heading
      gsap.from(headRef.current, {
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
        y: 60, opacity: 0, duration: 0.9, ease: 'power4.out',
      });

      // Text block
      gsap.from(textRef.current, {
        scrollTrigger: { trigger: textRef.current, start: 'top 85%' },
        x: -50, opacity: 0, duration: 0.9, ease: 'power3.out',
      });

      // Skill bars
      skillsRef.current?.querySelectorAll('.skill-fill').forEach((bar, i) => {
        gsap.to(bar, {
          scrollTrigger: { trigger: bar, start: 'top 90%' },
          scaleX: 1, duration: 1.2, delay: i * 0.12, ease: 'power3.out',
        });
      });

      // Highlight cards
      gsap.from(cardsRef.current?.querySelectorAll('.h-card'), {
        scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' },
        y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.90)' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section heading ── */}
        <div ref={headRef} className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Who I Am</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-primary">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="mt-4 mx-auto section-line animate" />
        </div>

        {/* ── Grid: [bio+skills] | [highlights+exp] | [image RIGHT] ── */}
        <div className="grid lg:grid-cols-[1fr_1fr_300px] gap-10 items-end">

          {/* ── Col 1: Bio + skills ── */}
          <div ref={textRef}>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary">Aizaz Ali Afridi</h3>
              <p className="text-accent text-sm font-medium">Freelance Developer &amp; Designer</p>
              <p className="mt-3 text-gray-500 leading-relaxed text-sm">
                With over 3 years of experience, I specialise in building high-performance
                websites and web applications. I've helped 40+ clients launch successful
                WordPress stores, Shopify e-commerce sites, and custom React frontends —
                always focusing on speed, UX, and business results.
              </p>
            </div>

            {/* Info chips */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'Location',      val: 'Islamabad, PK' },
                { label: 'Experience',    val: '3+ Years'      },
                { label: 'Projects Done', val: '50+'           },
                { label: 'Happy Clients', val: '40+'           },
              ].map(({ label, val }) => (
                <div key={label} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-primary mt-0.5">{val}</p>
                </div>
              ))}
            </div>

            {/* Skill bars */}
            <div ref={skillsRef} className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Skill Proficiency
              </h4>
              {skills.map(({ name, pct }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-primary">{name}</span>
                    <span className="text-accent font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="skill-fill h-full rounded-full"
                      style={{ '--target': `${pct / 100}` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Mobile-only image — inside Col 1 so grid gap doesn't double-space ── */}
            <div className="lg:hidden flex justify-center mt-8">
              <div className="relative w-52">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(108,99,255,0.20) 0%, transparent 70%)',
                    filter: 'blur(28px)',
                  }}
                />
                <img
                  src="/about-us.png"
                  alt="Aizaz Ali Afridi"
                  className="relative w-full h-auto select-none"
                  style={{ filter: 'drop-shadow(0 16px 40px rgba(108,99,255,0.28)) drop-shadow(0 4px 16px rgba(0,0,0,0.08))' }}
                />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 py-1.5
                  shadow-lg border border-gray-100 text-xs font-bold text-primary
                  flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Open to work
                </div>
              </div>
            </div>
          </div>

          {/* ── Col 2: Highlight cards + Experience ── */}
          <div>
            <div ref={cardsRef} className="grid grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, title, desc }) => (
                <div key={title}
                  className="h-card group bg-white border border-gray-100 rounded-2xl p-5
                    hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10
                    transition-all duration-300 cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center
                    mb-4 group-hover:bg-accent group-hover:text-white text-accent transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <h4 className="font-bold text-primary mb-1">{title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Experience timeline */}
            <div className="mt-8 space-y-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Experience</h4>
              {[
                { year: '2025 – 2026',  role: 'WP & Shopify Freelance Developer', company: 'Self-Employed / Agency / Remote'   },
                { year: '2024 – 2025', role: 'WordPress & Shopify Developer',        company: 'Agency / Remote' },
                { year: '2023 – 2025', role: 'WordPress Developer',         company: 'Startup'         },
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
                    {i < 2 && <div className="w-0.5 h-10 bg-gray-100 mt-1" />}
                  </div>
                  <div>
                    <p className="text-xs text-accent font-semibold">{item.year}</p>
                    <p className="text-sm font-bold text-primary">{item.role}</p>
                    <p className="text-xs text-gray-400">{item.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Col 3 (RIGHT): Full-body image + floating tech icons ── */}
          <div
            ref={imageWrapRef}
            className="relative hidden lg:block"
          >
            {/* Soft glow behind figure */}
            <div
              ref={glowRef}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
              style={{
                width: 340, height: 340,
                background: 'radial-gradient(circle, rgba(108,99,255,0.22) 0%, rgba(167,139,250,0.10) 45%, transparent 70%)',
                filter: 'blur(36px)',
                zIndex: 0,
              }}
            />

            {/* Full-body profile image — full PNG, no cropping, natural height */}
            <motion.img
              src="/about-us.png"
              alt="Aizaz Ali Afridi"
              className="relative z-10 w-full select-none"
              style={{
                display: 'block',
                height: 'auto',
                filter: 'drop-shadow(0 20px 50px rgba(108,99,255,0.30)) drop-shadow(0 4px 20px rgba(0,0,0,0.10))',
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            />

            {/* ── Floating tech icon pills ── */}
            {techIcons.map(({ icon: Icon, color, label, top, left, right, dur, delay: d }) => (
              <motion.div
                key={label}
                className="absolute z-20 bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100
                  flex items-center gap-2 select-none"
                style={{ top, left, right }}
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: dur, repeat: Infinity, delay: d, ease: 'easeInOut' }}
                whileHover={{ scale: 1.12, boxShadow: `0 8px 24px ${color}40` }}
              >
                <Icon size={15} color={color} />
                <span className="text-xs font-bold text-gray-700">{label}</span>
              </motion.div>
            ))}

            {/* "Open to work" floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-3 py-2
                shadow-xl border border-gray-100 text-xs font-bold text-primary
                flex items-center gap-1.5 z-30 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open to work
            </motion.div>

            {/* Projects count badge — bottom right */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-12 right-0 bg-white rounded-2xl px-3 py-2
                shadow-xl border border-gray-100 z-30 text-center"
            >
              <p className="gradient-text text-xl font-black leading-none">50+</p>
              <p className="text-gray-400 text-[10px] mt-0.5">Projects Done</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
