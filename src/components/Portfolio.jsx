import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiArrowRight, FiShoppingCart, FiLayout, FiHome, FiBox, FiMonitor } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'WordPress', 'Shopify', 'React'];

const projects = [
  {
    id: 1,
    title: 'Luxury E-Commerce Store',
    cat: 'WordPress',
    tech: ['WordPress', 'WooCommerce', 'Elementor'],
    desc: 'A high-end fashion store with custom WooCommerce checkout and product animations.',
    color: '#7cb26e',
    icon: FiShoppingCart,
    liveUrl: '#',
  },
  {
    id: 2,
    title: 'Health & Wellness Shop',
    cat: 'Shopify',
    tech: ['Shopify', 'Liquid', 'Custom Theme'],
    desc: 'Fully custom Shopify theme with subscription products and loyalty programme.',
    color: '#7cb26e',
    icon: FiBox,
    liveUrl: '#',
  },
  {
    id: 3,
    title: 'SaaS Dashboard',
    cat: 'React',
    tech: ['React', 'Tailwind', 'GSAP'],
    desc: 'An animated analytics dashboard with real-time charts and dark mode support.',
    color: '#7cb26e',
    icon: FiMonitor,
    liveUrl: '#',
  },
  {
    id: 4,
    title: 'Real Estate Platform',
    cat: 'WordPress',
    tech: ['WordPress', 'Custom Plugin', 'ACF'],
    desc: 'Property listing portal with advanced search, map integration and agent portal.',
    color: '#7cb26e',
    icon: FiHome,
    liveUrl: '#',
  },
  {
    id: 5,
    title: 'Fashion Drop Store',
    cat: 'Shopify',
    tech: ['Shopify', 'Liquid', 'Klaviyo'],
    desc: 'Limited-drop streetwear brand with countdown timers and email capture flows.',
    color: '#7cb26e',
    icon: FiShoppingCart,
    liveUrl: '#',
  },
  {
    id: 6,
    title: 'Agency Portfolio',
    cat: 'React',
    tech: ['React', 'Framer Motion', 'Three.js'],
    desc: 'Creative agency website with 3D elements, scroll animations and WebGL backgrounds.',
    color: '#7cb26e',
    icon: FiLayout,
    liveUrl: '#',
  },
];

export default function Portfolio() {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? projects : projects.filter(p => p.cat === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
        y: 50, opacity: 0, duration: 0.9, ease: 'power4.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="py-24 overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="text-center mb-12">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Recent Work</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-primary">
            My <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            A selection of projects I've built for clients across industries.
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 ${
                filter === cat
                  ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={filter !== cat ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                className="port-card group relative rounded-3xl overflow-hidden transition-shadow duration-400 hover:shadow-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Card thumbnail */}
                <div
                  className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.color}18 0%, rgba(255,255,255,0.03) 100%)` }}
                >
                  {/* Category colour bar at top */}
                  <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: p.color }} />

                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: `${p.color}20`, border: `1px solid ${p.color}40` }}
                  >
                    <p.icon size={28} style={{ color: p.color }} />
                  </div>

                  {/* Hover overlay — view live */}
                  <div className="port-overlay absolute inset-0 flex items-center justify-center gap-3" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
                      style={{ background: p.color, color: '#fff' }}
                    >
                      <FiExternalLink size={13} /> View Live
                    </a>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display font-bold text-white text-base">{p.title}</h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                      style={{ color: p.color, borderColor: p.color + '40', backgroundColor: p.color + '10' }}
                    >
                      {p.cat}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className="text-xs text-gray-400 px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-500 mb-4">Want to see more work or discuss a project?</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white font-bold shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Let's Work Together
          </button>

          {/* Portfolio profile links */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">View full portfolio on</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.fiverr.com/s/dDa9lqa"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-250 hover:scale-105 active:scale-95"
                style={{ borderColor: '#7cb26e', color: '#7cb26e' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7cb26e'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#7cb26e'; }}
              >
                Fiverr
                <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01db2b03b5a7f36be8"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-250 hover:scale-105 active:scale-95"
                style={{ borderColor: '#7cb26e', color: '#7cb26e' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7cb26e'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#7cb26e'; }}
              >
                Upwork
                <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
