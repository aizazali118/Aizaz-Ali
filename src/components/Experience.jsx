import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const jobs = [
  {
    year:    'Apr 2026 – Present',
    role:    'WordPress Developer',
    company: 'Vision Tact',
    type:    'Full-time',
    loc:     'Islamabad, Pakistan · On-site',
    desc:    'WordPress site development, theme customisation and end-to-end client project management.',
    current: true,
  },
  {
    year:    'Sep 2025 – May 2026 · 9 mos',
    role:    'WordPress Developer',
    company: 'Advanced Datalytics',
    type:    'Part-time',
    loc:     'Islamabad, Pakistan · Remote',
    desc:    'Developed and maintained WordPress solutions for data analytics clients.',
    current: false,
  },
  {
    year:    'Jan 2024 – Apr 2026 · 2 yrs 4 mos',
    role:    'WordPress Developer',
    company: 'Hexa IT Solutions',
    type:    'Full-time',
    loc:     'Rawalpindi, Pakistan · On-site',
    desc:    'PSD to WordPress, front-end design, WooCommerce stores and plugin integrations for enterprise clients.',
    current: false,
  },
  {
    year:    'Mar 2025 – Jun 2025 · 4 mos',
    role:    'WordPress | Shopify Developer',
    company: 'Swiftwave Digital',
    type:    'Part-time',
    loc:     'Islamabad, Pakistan · Remote',
    desc:    'Managed WordPress and Shopify client projects, developed custom themes from scratch.',
    current: false,
  },
  {
    year:    'Dec 2024 – Jan 2025 · 2 mos',
    role:    'WordPress | Shopify Developer',
    company: 'Conzummate Tech Ltd',
    type:    'Part-time',
    loc:     'Lahore, Pakistan · Remote',
    desc:    'WordPress development and PSD to WordPress conversions for UK-based clients.',
    current: false,
  },
  {
    year:    'Jun 2023 – Jun 2024 · 1 yr 1 mo',
    role:    'Data Entry Operator',
    company: 'UNICEF',
    type:    'Contract',
    loc:     'On-site',
    desc:    'Data entry and management for UNICEF operations.',
    current: false,
  },
];

const skills = [
  { name: 'WordPress / WooCommerce', pct: 95 },
  { name: 'Shopify / Liquid',        pct: 90 },
  { name: 'React / Next.js',         pct: 85 },
  { name: 'HTML / CSS / Tailwind',   pct: 95 },
  { name: 'JavaScript / TypeScript', pct: 82 },
  { name: 'UI/UX Design (Figma)',    pct: 75 },
];

export default function Experience() {
  const barsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = 'scaleX(1)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    barsRef.current?.querySelectorAll('.skill-fill').forEach((bar) => observer.observe(bar));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="py-24" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">My Journey</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="mt-3 text-sm max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            4+ years of professional experience across agencies and freelance
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* ── LEFT: Timeline ── */}
          <div className="relative">
            <div
              className="absolute left-[7px] top-2 bottom-0 w-0.5"
              style={{ background: 'rgba(124,178,110,0.15)' }}
            />

            <div className="space-y-1">
              {jobs.map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-9 pb-8"
                >
                  {/* Dot */}
                  <div
                    className="absolute left-0 top-2 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: '#7cb26e',
                      background: job.current ? '#7cb26e' : '#0a0a0a',
                    }}
                  >
                    {job.current && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className="rounded-2xl p-5 border transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(124,178,110,0.15)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,178,110,0.35)'; e.currentTarget.style.background = 'rgba(124,178,110,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,178,110,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-display font-black text-white text-base leading-tight">{job.role}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FiBriefcase size={11} style={{ color: '#7cb26e' }} />
                          <span className="text-xs font-bold" style={{ color: '#7cb26e' }}>{job.company}</span>
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>· {job.type}</span>
                        </div>
                      </div>
                      {job.current && (
                        <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: '#7cb26e' }}>
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 mb-2.5">
                      <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <FiCalendar size={10} />
                        <span className="text-[11px]">{job.year}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <FiMapPin size={10} />
                        <span className="text-[11px]">{job.loc}</span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{job.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Skills + CV card ── */}
          <div className="space-y-8" ref={barsRef}>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <h3 className="text-lg font-display font-black text-white mb-6">
                Technical <span className="gradient-text">Proficiency</span>
              </h3>
              <div className="space-y-5">
                {skills.map(({ name, pct }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-white/80">{name}</span>
                      <span className="font-black" style={{ color: '#7cb26e' }}>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="skill-fill"
                        style={{ '--target': `${pct / 100}`, transition: `transform 1.2s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CV Download Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl p-8 text-center"
              style={{ background: 'linear-gradient(135deg, #5a9a4a 0%, #7cb26e 100%)', boxShadow: '0 20px 60px rgba(124,178,110,0.25)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <FiDownload size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-display font-black text-white mb-2">Download My CV</h3>
              <p className="text-white/80 text-sm mb-6">
                Get a full overview of my experience, skills, and completed projects in a clean A4 PDF.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-accent font-bold text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
                >
                  <FiDownload size={14} /> View & Download CV
                </Link>
                <a
                  href="https://wa.me/923359574017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/20 text-white font-bold text-sm hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/30"
                >
                  Hire Me Now
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
