import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWordpress, FaShopify, FaReact } from 'react-icons/fa';
import { FiCheck, FiArrowRight, FiCode, FiLayers } from 'react-icons/fi';
import { MdOutlineDesignServices, MdSpeed, MdSupportAgent } from 'react-icons/md';

const services = [
  {
    icon: FaWordpress,
    iconColor: '#21759b',
    title: 'WordPress Development',
    tagline: 'Custom themes & powerful plugins',
    desc: 'From blog sites to full WooCommerce stores, I build fast, secure WordPress websites tailored to your brand and business goals.',
    features: ['Custom Theme Development', 'WooCommerce Store Setup', 'Plugin Development & Integration', 'Speed Optimisation', 'SEO-Ready Architecture', 'Maintenance & Support'],
    gradient: 'from-[#eaf6ff] to-[#d6efff]',
    accent: '#21759b',
    badge: 'Most Popular',
  },
  {
    icon: FaShopify,
    iconColor: '#96bf48',
    title: 'Shopify Development',
    tagline: 'E-commerce that converts',
    desc: 'Custom Shopify stores, Liquid theme development, app integrations and conversion-optimised product pages that drive sales.',
    features: ['Custom Liquid Theme Development', 'Shopify App Integration', 'Payment Gateway Setup', 'Conversion Rate Optimisation', 'Store Migration & Setup', 'Performance Tuning'],
    gradient: 'from-[#edfff0] to-[#d4f9da]',
    accent: '#96bf48',
    badge: null,
  },
  {
    icon: FaReact,
    iconColor: '#61dafb',
    title: 'Frontend Development',
    tagline: 'React & modern web apps',
    desc: 'Blazing-fast React/Next.js web applications with stunning animations, full responsiveness, and clean, maintainable code.',
    features: ['React / Next.js Applications', 'Custom UI Components', 'GSAP & Framer Motion Animations', 'Tailwind CSS Styling', 'REST API & GraphQL Integration', 'Performance & SEO Optimisation'],
    gradient: 'from-[#f0eeff] to-[#e2d9ff]',
    accent: '#6c63ff',
    badge: null,
  },
  {
    icon: FiCode,
    iconColor: '#f97316',
    title: 'Custom Software',
    tagline: 'Tailored solutions, built to scale',
    desc: 'End-to-end custom web applications engineered for your exact requirements — from complex dashboards to SaaS platforms.',
    features: ['Full-Stack Web Applications', 'REST API & Backend Development', 'Database Design & Integration', 'Admin Dashboards & Portals', 'Third-Party API Integration', 'Scalable Architecture'],
    gradient: 'from-[#fff6ed] to-[#ffe8d1]',
    accent: '#f97316',
    badge: null,
  },
  {
    icon: MdOutlineDesignServices,
    iconColor: '#ec4899',
    title: 'UI/UX Designing',
    tagline: 'Designs that delight & convert',
    desc: 'User-centred Figma designs — wireframes, prototypes, and polished UI systems crafted before a single line of code is written.',
    features: ['Figma Wireframes & Prototypes', 'Design System & Component Library', 'Mobile-First Responsive Design', 'Brand Identity & Style Guide', 'User Flow & Interaction Design', 'Landing Page Design'],
    gradient: 'from-[#fff0f6] to-[#ffd6eb]',
    accent: '#ec4899',
    badge: 'New',
  },
];

const extras = [
  { icon: FiLayers,       title: 'Performance Audit', desc: 'Full site audit with actionable speed & SEO improvements.'   },
  { icon: MdSpeed,        title: 'SEO Optimisation',  desc: 'On-page SEO, meta tags, schema markup, and Core Web Vitals.' },
  { icon: MdSupportAgent, title: 'Ongoing Support',   desc: 'Post-launch maintenance, updates, and dedicated support.'    },
];

/* ── Mouse-tracking 3-D tilt ── */
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const rx =  ((e.clientX - left) / width  - 0.5) * 16;
      const ry = -((e.clientY - top)  / height - 0.5) * 16;
      gsap.to(el, { rotateX: ry, rotateY: rx, duration: 0.2, ease: 'power2.out', transformPerspective: 900 });
    };
    const leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [ref]);
}

function ServiceCard({ s, onHover, onLeave }) {
  const cardRef = useRef(null);
  useTilt(cardRef);
  return (
    <motion.div
      ref={cardRef}
      className={`relative flex-shrink-0 w-72 bg-gradient-to-br ${s.gradient}
        border border-white/80 rounded-3xl p-6 shadow-md cursor-default`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      whileHover={{ scale: 1.04, y: -8, boxShadow: `0 24px 50px ${s.accent}28` }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      onHoverStart={() => onHover(s)}
      onHoverEnd={onLeave}
    >
      {/* Badge */}
      {s.badge && (
        <motion.span
          animate={{ scale: [1, 1.09, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-3 left-5 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow"
          style={{ background: s.badge === 'New' ? 'linear-gradient(135deg,#ec4899,#a78bfa)' : 'linear-gradient(135deg,#6c63ff,#06b6d4)' }}
        >
          {s.badge}
        </motion.span>
      )}

      {/* Number watermark */}
      <div className="absolute top-3 right-4 font-black select-none pointer-events-none"
        style={{ fontSize: 56, lineHeight: 1, color: s.iconColor, opacity: 0.07 }}>
        {String(services.indexOf(s) + 1).padStart(2, '0')}
      </div>

      {/* Icon */}
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow"
        style={{ background: s.iconColor + '20' }}
        whileHover={{ rotate: [-5, 5, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
      >
        <s.icon size={26} color={s.iconColor} />
      </motion.div>

      <h3 className="text-lg font-display font-black text-primary mb-1">{s.title}</h3>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: s.accent }}>{s.tagline}</p>

      <ul className="space-y-1.5">
        {s.features.slice(0, 4).map((f) => (
          <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
            <FiCheck size={11} style={{ color: s.accent }} className="flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        className="group inline-flex items-center gap-1.5 text-xs font-bold mt-4 hover:gap-2.5 transition-all duration-200"
        style={{ color: s.accent }}
      >
        Get a Quote <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
      </button>
    </motion.div>
  );
}

export default function Services() {
  const trackRef   = useRef(null);
  const tweenRef   = useRef(null);
  const extrasRef  = useRef(null);
  const [hovered, setHovered] = useState(null);

  /* ── Infinite marquee ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Half width = one complete set of cards
    const getHalf = () => track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: () => -getHalf(),
      ease: 'none',
      duration: 22,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % getHalf()),
      },
    });

    // Pause on hover
    const pause = () => tweenRef.current?.pause();
    const play  = () => tweenRef.current?.play();
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', play);

    // Extras entrance
    gsap.from(extrasRef.current?.querySelectorAll('.e-card'), {
      scrollTrigger: { trigger: extrasRef.current, start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
    });

    return () => {
      tweenRef.current?.kill();
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', play);
    };
  }, []);

  return (
    <section id="services" style={{ background: 'rgba(249,250,251,0.92)', padding: '100px 0' }}>

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="text-center mb-12 px-6"
      >
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">What I Offer</p>
        <h2 className="text-4xl md:text-5xl font-display font-black text-primary">
          My <span className="gradient-text">Services</span>
        </h2>
        <p className="mt-3 text-gray-400 text-sm max-w-sm mx-auto">
          Full-stack digital solutions — hover a card to see details
        </p>
        <div className="mt-4 mx-auto section-line animate" />
      </motion.div>

      {/* ── Infinite marquee loop ── */}
      <div className="overflow-hidden">
        {/* Doubled cards for seamless loop */}
        <div
          ref={trackRef}
          className="flex gap-5 will-change-transform"
          style={{ width: 'max-content', paddingLeft: '1.5rem' }}
        >
          {[...services, ...services].map((s, i) => (
            <ServiceCard
              key={`${s.title}-${i}`}
              s={s}
              onHover={(svc) => setHovered(svc)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>

      {/* ── Hovered service detail panel ── */}
      <div className="max-w-6xl mx-auto px-6 mt-10" style={{ minHeight: 120 }}>
        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key={hovered.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 border shadow-lg flex flex-col md:flex-row gap-8 items-start"
              style={{ borderColor: hovered.accent + '30', boxShadow: `0 12px 40px ${hovered.accent}18` }}
            >
              {/* Left: icon + name */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: hovered.iconColor + '20' }}>
                  <hovered.icon size={28} color={hovered.iconColor} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-primary">{hovered.title}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: hovered.accent }}>{hovered.tagline}</p>
                </div>
              </div>

              {/* Middle: description */}
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mt-1">{hovered.desc}</p>

              {/* Right: all features */}
              <ul className="space-y-1.5 flex-shrink-0">
                {hovered.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <FiCheck size={12} style={{ color: hovered.accent }} className="flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-xs text-gray-300 tracking-widest uppercase mt-2"
            >
              ↑ Hover any card for full details
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Extras strip ── */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div ref={extrasRef} className="grid sm:grid-cols-3 gap-4">
          {extras.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="e-card flex gap-4 items-start bg-white rounded-2xl p-5 border border-gray-100
                shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0
                group-hover:bg-accent group-hover:text-white text-accent transition-all duration-300">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-primary text-sm mb-1">{title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
