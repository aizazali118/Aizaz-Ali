import { motion } from 'framer-motion';
import { FiCode, FiLayers, FiMonitor, FiSmartphone } from 'react-icons/fi';

const highlights = [
  { icon: FiCode,       title: 'Clean Code',    desc: 'Maintainable, scalable, well-structured code.' },
  { icon: FiLayers,     title: 'Pixel Perfect', desc: 'Every detail crafted with precision and care.'  },
  { icon: FiMonitor,    title: 'Performance',   desc: 'Optimized for speed and Core Web Vitals.'       },
  { icon: FiSmartphone, title: 'Responsive',    desc: 'Flawless on every screen size and device.'      },
];

const D = {
  chip:   'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  text:   'rgba(255,255,255,0.55)',
  muted:  'rgba(255,255,255,0.35)',
};

export default function About({ showHeading = true, showImage = false }) {
  return (
    <section id="about" className="py-24 overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-6">

        {showHeading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Who I Am</p>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="mt-4 mx-auto section-line animate" />
          </motion.div>
        )}

        {/* Mobile image — only on About page */}
        {showImage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex lg:hidden justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,178,110,0.22) 0%, transparent 70%)', filter: 'blur(32px)' }} />
              <div className="relative z-10 w-44 h-56 overflow-hidden rounded-2xl">
                <img
                  src="/about-us.png"
                  alt="Aizaz Ali Afridi"
                  className="w-full h-auto select-none"
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className={`grid gap-10 lg:items-center ${showImage ? 'lg:grid-cols-[1fr_1fr_260px]' : 'lg:grid-cols-2'}`}>

          {/* Col 1: Bio + stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-xl font-bold text-white">Aizaz Ali Afridi</h3>
            <p className="text-accent text-sm font-medium mb-3">Freelance Developer &amp; Designer</p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: D.text }}>
              With over 3 years of experience, I specialise in building high-performance websites and web
              applications. I've helped 40+ clients launch successful WordPress stores, Shopify e-commerce
              sites, and custom React frontends — always focusing on speed, UX, and business results.
            </p>
            <div className="grid grid-cols-2 gap-3">
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
          </motion.div>

          {/* Col 2: Highlight cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group rounded-2xl p-5 border transition-all duration-300 cursor-default"
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
          </motion.div>

          {/* Col 3: Profile image — desktop, About page only */}
          {showImage && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="hidden lg:flex justify-center items-end"
            >
              <div className="relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(124,178,110,0.22) 0%, transparent 70%)', filter: 'blur(32px)' }} />
                <div className="relative z-10 w-[240px] h-[320px] overflow-hidden rounded-3xl">
                  <motion.img
                    src="/about-us.png"
                    alt="Aizaz Ali Afridi"
                    className="w-full h-auto select-none"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      filter: 'drop-shadow(0 16px 40px rgba(124,178,110,0.28))',
                    }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}