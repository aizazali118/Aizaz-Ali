import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWordpress, FaShopify, FaReact } from 'react-icons/fa';
import { FiCheck, FiArrowRight, FiCode, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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

const ACCENT = '#7cb26e';

function ServiceCarousel() {
  const [current, setCurrent] = useState(0);
  const total = services.length;

  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  const s = services[current];

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
            className="relative rounded-3xl p-8 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: ACCENT + '40' }}
          >
            {s.badge && (
              <span className="absolute -top-3 left-8 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg"
                style={{ background: 'linear-gradient(135deg,#5a9a4a,#7cb26e)' }}>
                {s.badge}
              </span>
            )}

            <div className="flex flex-col sm:flex-row gap-8">
              {/* Left */}
              <div className="flex-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: ACCENT + '18' }}>
                  <s.icon size={26} color={ACCENT} />
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-1">{s.title}</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>{s.tagline}</p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-bold group hover:gap-3 transition-all duration-200"
                  style={{ color: ACCENT }}
                >
                  Get a Quote <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
              </div>

              {/* Right — features */}
              <div className="sm:w-56 shrink-0">
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Includes</p>
                <ul className="space-y-2.5">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <FiCheck size={12} style={{ color: ACCENT }} className="flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:border-accent hover:text-accent"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
          aria-label="Previous service"
        >
          <FiChevronLeft size={18} />
        </button>

        <span className="text-sm font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <span className="text-white">{current + 1}</span>
          <span className="mx-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          {total}
        </span>

        <button
          onClick={next}
          className="w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:border-accent hover:text-accent"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
          aria-label="Next service"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ServiceGrid() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {services.slice(0, 4).map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="relative flex flex-col rounded-3xl p-6 border h-full transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: s.accent + '35' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 50px ${s.accent}22, 0 0 0 1px ${s.accent}50`; e.currentTarget.style.borderColor = s.accent + '60'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = s.accent + '35'; }}
          >
            {s.badge && (
              <span className="absolute -top-3 left-5 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg"
                style={{ background: 'linear-gradient(135deg,#5a9a4a,#7cb26e)' }}>{s.badge}</span>
            )}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shrink-0"
              style={{ background: s.iconColor + '18' }}>
              <s.icon size={22} color={s.iconColor} />
            </div>
            <h3 className="text-base font-display font-black text-white mb-1">{s.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: s.accent }}>{s.tagline}</p>
            <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
            <ul className="space-y-1.5 mb-5">
              {s.features.map(f => (
                <li key={f} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <FiCheck size={10} style={{ color: s.accent }} className="flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="inline-flex items-center gap-1 text-xs font-bold mt-auto group hover:gap-2 transition-all" style={{ color: s.accent }}>
              Get a Quote <FiArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
      {/* 5th service — full width row centered */}
      <div className="flex justify-center">
        {services.slice(4).map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="relative flex flex-col rounded-3xl p-6 border transition-all duration-300 w-full sm:max-w-sm"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: s.accent + '35' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 50px ${s.accent}22, 0 0 0 1px ${s.accent}50`; e.currentTarget.style.borderColor = s.accent + '60'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = s.accent + '35'; }}
          >
            {s.badge && (
              <span className="absolute -top-3 left-5 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg"
                style={{ background: 'linear-gradient(135deg,#5a9a4a,#7cb26e)' }}>{s.badge}</span>
            )}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: s.iconColor + '18' }}>
              <s.icon size={22} color={s.iconColor} />
            </div>
            <h3 className="text-base font-display font-black text-white mb-1">{s.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: s.accent }}>{s.tagline}</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
            <ul className="space-y-1.5 mb-5">
              {s.features.map(f => (
                <li key={f} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <FiCheck size={10} style={{ color: s.accent }} className="flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="inline-flex items-center gap-1 text-xs font-bold group hover:gap-2 transition-all" style={{ color: s.accent }}>
              Get a Quote <FiArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Services({ showHeading = true, variant = 'carousel' }) {
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

      {variant === 'grid' ? <ServiceGrid /> : <ServiceCarousel />}

      {/* Extras strip */}
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
