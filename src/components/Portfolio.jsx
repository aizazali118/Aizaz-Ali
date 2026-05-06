import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiArrowRight, FiShoppingCart, FiLayout, FiHome, FiBox, FiMonitor, FiCalendar, FiUser, FiStar, FiPackage, FiCode, FiWifi } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'WordPress', 'Shopify', 'React'];

const projects = [
  {
    id: 1,
    title: 'Vision Tact',
    cat: 'WordPress',
    tech: ['WordPress', 'Elementor', 'SEO'],
    desc: 'Corporate website for a digital marketing and web development agency.',
    color: '#7cb26e',
    icon: FiLayout,
    liveUrl: 'https://visiontact.com',
  },
  {
    id: 2,
    title: 'Hexa IT Solutions',
    cat: 'WordPress',
    tech: ['WordPress', 'Custom Theme', 'ACF'],
    desc: 'Full corporate website for an IT solutions and software development firm.',
    color: '#7cb26e',
    icon: FiMonitor,
    liveUrl: 'https://hexaitsolutions.com',
  },
  {
    id: 3,
    title: 'Puravibra UAE',
    cat: 'WordPress',
    tech: ['WordPress', 'Elementor', 'Booking'],
    desc: 'Dubai-based event management and entertainment website with booking integration.',
    color: '#7cb26e',
    icon: FiCalendar,
    liveUrl: 'https://puravibrauae.com',
  },
  {
    id: 4,
    title: 'Hassan Mehmood',
    cat: 'WordPress',
    tech: ['WordPress', 'Custom Theme', 'Portfolio'],
    desc: 'Elegant portfolio website for a professional UI/UX designer.',
    color: '#7cb26e',
    icon: FiUser,
    liveUrl: 'https://hassan-mehmood.com',
  },
  {
    id: 5,
    title: 'Abdul Malik Fareed',
    cat: 'WordPress',
    tech: ['WordPress', 'Elementor', 'Portfolio'],
    desc: 'Personal brand and portfolio site for a popular Pakistani YouTuber.',
    color: '#7cb26e',
    icon: FiStar,
    liveUrl: 'https://www.abdulmalikfareed.com',
  },
  {
    id: 6,
    title: 'Oryx Nest',
    cat: 'WordPress',
    tech: ['WordPress', 'Custom Theme', 'Real Estate'],
    desc: 'Professional company website with modern design and service showcase.',
    color: '#7cb26e',
    icon: FiHome,
    liveUrl: 'https://oryxnest.com',
  },
  {
    id: 7,
    title: 'The Velvet Kitchen',
    cat: 'WordPress',
    tech: ['WordPress', 'WooCommerce', 'Custom Theme'],
    desc: 'WooCommerce store for a premium food and catering brand.',
    color: '#7cb26e',
    icon: FiShoppingCart,
    liveUrl: 'https://thevelvetkitchen.com',
  },
  {
    id: 8,
    title: 'Dara Scents',
    cat: 'WordPress',
    tech: ['WordPress', 'WooCommerce', 'Custom Design'],
    desc: 'WooCommerce fragrance store with custom product pages and checkout flow.',
    color: '#7cb26e',
    icon: FiBox,
    liveUrl: 'https://darascents.com',
  },
  {
    id: 9,
    title: 'PopSearch Live Plugin',
    cat: 'WordPress',
    tech: ['PHP', 'WooCommerce', 'WordPress API'],
    desc: 'Custom live search plugin published on the official WordPress.org repository.',
    color: '#7cb26e',
    icon: FiCode,
    liveUrl: 'https://wordpress.org/plugins/popsearch-live-for-woocommerce/',
  },
  {
    id: 10,
    title: 'Montiero',
    cat: 'Shopify',
    tech: ['Shopify', 'Liquid', 'Custom Theme'],
    desc: 'Fashion e-commerce Shopify store with fully custom theme development.',
    color: '#7cb26e',
    icon: FiPackage,
    liveUrl: 'https://montiero.pk',
  },
  {
    id: 11,
    title: 'Nabqa',
    cat: 'Shopify',
    tech: ['Shopify', 'Liquid', 'App Integration'],
    desc: 'Full-featured Shopify store with custom design and conversion optimisation.',
    color: '#7cb26e',
    icon: FiShoppingCart,
    liveUrl: 'https://nabqa.com',
  },
  {
    id: 12,
    title: 'Aoraki Telecom',
    cat: 'React',
    tech: ['React', 'Tailwind CSS', 'Responsive'],
    desc: 'Modern ReactJS company website for a telecommunications provider.',
    color: '#7cb26e',
    icon: FiWifi,
    liveUrl: 'https://aorakitelecom.com',
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
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            My <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                  : 'hover:text-white'
              }`}
              style={filter !== cat ? { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
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
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
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
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Want to see more work or discuss a project?</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white font-bold shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Let's Work Together
          </button>

          {/* Portfolio profile links */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>View full portfolio on</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.fiverr.com/s/gD71ldb"
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
