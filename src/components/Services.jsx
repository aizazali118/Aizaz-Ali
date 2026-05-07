import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWordpress, FaShopify, FaReact } from 'react-icons/fa';
import { FiCheck, FiArrowRight, FiCode, FiChevronDown } from 'react-icons/fi';
import { MdOutlineDesignServices, MdSpeed, MdSupportAgent } from 'react-icons/md';
import { FiLayers } from 'react-icons/fi';

const services = [
  {
    icon: FaWordpress,
    iconColor: '#7cb26e',
    title: 'WordPress Development',
    tagline: 'Custom themes & powerful plugins',
    desc: 'From blog sites to full WooCommerce stores — fast, secure WordPress websites tailored to your brand and business goals.',
    features: ['Custom Theme Development', 'WooCommerce Store Setup', 'Plugin Development & Integration', 'Speed Optimisation', 'SEO-Ready Architecture', 'Maintenance & Support'],
    accent: '#7cb26e',
    badge: 'Most Popular',
  },
  {
    icon: FaShopify,
    iconColor: '#7cb26e',
    title: 'Shopify Development',
    tagline: 'E-commerce that converts',
    desc: 'Custom Shopify stores, Liquid theme development, app integrations and conversion-optimised product pages that drive sales.',
    features: ['Custom Liquid Theme Development', 'Shopify App Integration', 'Payment Gateway Setup', 'Conversion Rate Optimisation', 'Store Migration & Setup', 'Performance Tuning'],
    accent: '#7cb26e',
    badge: null,
  },
  {
    icon: FaReact,
    iconColor: '#7cb26e',
    title: 'Frontend Development',
    tagline: 'React & modern web apps',
    desc: 'Blazing-fast React/Next.js web applications with stunning animations, full responsiveness, and clean, maintainable code.',
    features: ['React / Next.js Applications', 'Custom UI Components', 'GSAP & Framer Motion Animations', 'Tailwind CSS Styling', 'REST API & GraphQL Integration', 'Performance & SEO Optimisation'],
    accent: '#7cb26e',
    badge: null,
  },
  {
    icon: FiCode,
    iconColor: '#7cb26e',
    title: 'Custom Software',
    tagline: 'Tailored solutions, built to scale',
    desc: 'End-to-end custom web applications engineered for your exact requirements — from complex dashboards to SaaS platforms.',
    features: ['Full-Stack Web Applications', 'REST API & Backend Development', 'Database Design & Integration', 'Admin Dashboards & Portals', 'Third-Party API Integration', 'Scalable Architecture'],
    accent: '#7cb26e',
    badge: null,
  },
  {
    icon: MdOutlineDesignServices,
    iconColor: '#7cb26e',
    title: 'UI/UX Designing',
    tagline: 'Designs that delight & convert',
    desc: 'User-centred Figma designs — wireframes, prototypes, and polished UI systems crafted before a single line of code is written.',
    features: ['Figma Wireframes & Prototypes', 'Design System & Component Library', 'Mobile-First Responsive Design', 'Brand Identity & Style Guide', 'User Flow & Interaction Design', 'Landing Page Design'],
    accent: '#7cb26e',
    badge: 'New',
  },
];

const extras = [
  { icon: FiLayers,       title: 'Performance Audit', desc: 'Full site audit with actionable speed & SEO improvements.'   },
  { icon: MdSpeed,        title: 'SEO Optimisation',  desc: 'On-page SEO, meta tags, schema markup, and Core Web Vitals.' },
  { icon: MdSupportAgent, title: 'Ongoing Support',   desc: 'Post-launch maintenance, updates, and dedicated support.'    },
];

/* ── Desktop grid card ── */
function ServiceCard({ s, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="relative flex flex-col rounded-3xl p-7 border h-full transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: s.accent + '35',
        boxShadow: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 50px ${s.accent}22, 0 0 0 1px ${s.accent}50`; e.currentTarget.style.borderColor = s.accent + '60'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = s.accent + '35'; }}
    >
      {s.badge && (
        <span
          className="absolute -top-3 left-6 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg"
          style={{ background: 'linear-gradient(135deg,#5a9a4a,#7cb26e)' }}
        >
          {s.badge}
        </span>
      )}

      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
        style={{ background: s.iconColor + '18' }}>
        <s.icon size={26} color={s.iconColor} />
      </div>

      <h3 className="text-lg font-display font-black text-white mb-1">{s.title}</h3>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: s.accent }}>{s.tagline}</p>
      <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>

      <ul className="space-y-2 mb-6">
        {s.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <FiCheck size={11} style={{ color: s.accent }} className="flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className="inline-flex items-center gap-1.5 text-xs font-bold mt-auto group hover:gap-3 transition-all duration-200"
        style={{ color: s.accent }}
      >
        Get a Quote <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
      </Link>
    </motion.div>
  );
}

/* ── Mobile accordion card ── */
function MobileServiceCard({ s }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: s.accent + '30' }}>
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: s.iconColor + '20' }}>
          <s.icon size={22} color={s.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-white text-sm leading-tight">{s.title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: s.accent }}>{s.tagline}</p>
        </div>
        <FiChevronDown
          size={18}
          className="flex-shrink-0 transition-transform duration-300"
          style={{ color: s.accent, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1" style={{ borderTop: `1px solid ${s.accent}20` }}>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
              <ul className="space-y-1.5 mb-4">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <FiCheck size={11} style={{ color: s.accent }} className="flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-full text-white"
                style={{ background: s.accent }}
              >
                Get a Quote <FiArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Services({ showHeading = true }) {
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <section id="services" className="py-24" style={{ background: '#0d0d0d' }}>

      {showHeading && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="text-center mb-14 px-6"
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">What I Offer</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            My <span className="gradient-text">Services</span>
          </h2>
          <p className="mt-3 text-sm max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Full-stack digital solutions built to perform
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </motion.div>
      )}

      {/* ══ MOBILE: accordion ══ */}
      {isTouch ? (
        <div className="px-5 space-y-3 max-w-lg mx-auto">
          {services.map((s) => (
            <MobileServiceCard key={s.title} s={s} />
          ))}
        </div>
      ) : (
        /* ══ DESKTOP: grid ══ */
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.title} s={s} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Extras strip ── */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {extras.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 items-start rounded-2xl p-5 border transition-all duration-300 group"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,178,110,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
