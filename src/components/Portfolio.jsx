import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { portfolioApi } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://aizazaliafridi.com';

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');
}

const STATIC_PROJECTS = [
  { id: 1,  slug: 'shangrila',               title: 'Shangrila',               category: 'WordPress', image_url: null, description: 'Premium resort and hospitality website with elegant design and booking features.',        live_url: 'https://shangrila.pk',            tags: ['WordPress', 'Elementor', 'Booking'],         featured: true  },
  { id: 2,  slug: 'the-velvet-kitchen',       title: 'The Velvet Kitchen',       category: 'WordPress', image_url: null, description: 'WooCommerce store for a premium food and catering brand.',                              live_url: 'https://thevelvetkitchen.com',    tags: ['WordPress', 'WooCommerce', 'Custom Theme'],  featured: false },
  { id: 3,  slug: 'soulease-physiotherapy',   title: 'Soulease Physiotherapy',   category: 'WordPress', image_url: null, description: 'Professional physiotherapy clinic website with appointment booking system.',            live_url: 'https://souleasephysiotherapy.com', tags: ['WordPress', 'Elementor', 'Booking'],      featured: false },
  { id: 4,  slug: 'footsoul-clinic',          title: 'Footsoul Clinic',          category: 'WordPress', image_url: null, description: 'UK-based podiatry clinic website with service showcase and online booking.',           live_url: 'https://footsoulclinic.co.uk',    tags: ['WordPress', 'Elementor', 'UK'],              featured: false },
  { id: 5,  slug: 'dara-scents',              title: 'Dara Scents',              category: 'WordPress', image_url: null, description: 'WooCommerce fragrance store with custom product pages and checkout flow.',             live_url: 'https://darascents.com',          tags: ['WordPress', 'WooCommerce', 'Custom Design'], featured: false },
  { id: 6,  slug: 'hexa-it-solutions',        title: 'Hexa IT Solutions',        category: 'WordPress', image_url: null, description: 'Full corporate website for an IT solutions and software development firm.',            live_url: 'https://hexaitsolutions.com',     tags: ['WordPress', 'Custom Theme', 'ACF'],          featured: false },
  { id: 7,  slug: 'oryx-nest',                title: 'Oryx Nest',                category: 'WordPress', image_url: null, description: 'Professional company website with modern design and service showcase.',                live_url: 'https://oryxnest.com',            tags: ['WordPress', 'Custom Theme', 'Real Estate'],  featured: false },
  { id: 8,  slug: 'vision-tact',              title: 'Vision Tact',              category: 'WordPress', image_url: null, description: 'Corporate website for a digital marketing and web development agency.',                live_url: 'https://visiontact.com',          tags: ['WordPress', 'Elementor', 'SEO'],             featured: true  },
  { id: 9,  slug: 'galaxine-digital',         title: 'Galaxine Digital',         category: 'WordPress', image_url: null, description: 'Digital agency website with modern animations and service portfolio.',                 live_url: 'https://galaxinedigital.com',     tags: ['WordPress', 'Elementor', 'Agency'],          featured: false },
  { id: 10, slug: 'tk-saudi-arabia',          title: 'TK Saudi Arabia',          category: 'WordPress', image_url: null, description: 'Saudi Arabian corporate website with bilingual (Arabic/English) support.',            live_url: 'https://tk.sa',                   tags: ['WordPress', 'RTL', 'Bilingual'],             featured: false },
  { id: 11, slug: 'hassan-mehmood',           title: 'Hassan Mehmood',           category: 'WordPress', image_url: null, description: 'Elegant portfolio website for a professional UI/UX designer.',                        live_url: 'https://hassan-mehmood.com',      tags: ['WordPress', 'Custom Theme', 'Portfolio'],    featured: false },
  { id: 12, slug: 'my-muslim-mentors',        title: 'My Muslim Mentors',        category: 'WordPress', image_url: null, description: 'Islamic mentorship platform with course management and community features.',           live_url: 'https://mymuslimmentors.com',     tags: ['WordPress', 'LMS', 'Community'],             featured: false },
  { id: 13, slug: 'melaina-ksa',              title: 'Melaina KSA',              category: 'WordPress', image_url: null, description: 'Saudi Arabian beauty and lifestyle brand website with bilingual content.',             live_url: 'https://melaina-ksa.com',         tags: ['WordPress', 'Elementor', 'RTL'],             featured: false },
  { id: 14, slug: 'puravibra-uae',            title: 'Puravibra UAE',            category: 'WordPress', image_url: null, description: 'Dubai-based event management and entertainment website with booking integration.',    live_url: 'https://puravibrauae.com',        tags: ['WordPress', 'Elementor', 'Events'],          featured: false },
  { id: 15, slug: 'oto-fulfilment',           title: 'OTO Fulfilment',           category: 'WordPress', image_url: null, description: 'E-commerce fulfilment company website with logistics service showcase.',              live_url: 'https://otofulfilment.com',       tags: ['WordPress', 'Custom Theme', 'Logistics'],    featured: false },
  { id: 16, slug: 'moallim-ai',               title: 'Moallim AI',               category: 'React',     image_url: null, description: 'AI-powered Islamic education platform built with React and modern web technologies.',  live_url: 'https://moallim.ai',              tags: ['React', 'AI', 'EdTech'],                     featured: true  },
  { id: 17, slug: 'aoraki-telecom',           title: 'Aoraki Telecom',           category: 'React',     image_url: null, description: 'Modern ReactJS company website for a telecommunications provider.',                    live_url: 'https://aorakitelecom.com',       tags: ['React', 'Tailwind CSS', 'Responsive'],       featured: false },
  { id: 18, slug: 'nabqa',                    title: 'Nabqa',                    category: 'Shopify',   image_url: null, description: 'Full-featured Shopify store with custom design and conversion optimisation.',          live_url: 'https://nabqa.com',               tags: ['Shopify', 'Liquid', 'App Integration'],      featured: false },
  { id: 19, slug: 'montiero',                 title: 'Montiero',                 category: 'Shopify',   image_url: null, description: 'Fashion e-commerce Shopify store with fully custom theme development.',                live_url: 'https://montiero.pk',             tags: ['Shopify', 'Liquid', 'Custom Theme'],         featured: false },
  { id: 20, slug: 'al-jamilah-hair',          title: 'Al Jamilah Hair',          category: 'Shopify',   image_url: null, description: 'Premium hair care e-commerce store on Shopify with bespoke design.',                  live_url: 'https://aljamilahhair.com',       tags: ['Shopify', 'Liquid', 'Beauty'],               featured: false },
];

const CATEGORIES = ['All', 'WordPress', 'Shopify', 'React'];
const ACCENT = '#7cb26e';
const PER_PAGE = 3;

function ProjectCard({ project }) {
  const imgSrc = project.image_url
    ? (project.image_url.startsWith('http') ? project.image_url : `${API_BASE}${project.image_url}`)
    : null;
  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <div
      className="port-card group relative rounded-3xl overflow-hidden flex flex-col"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden flex items-center justify-center shrink-0"
        style={{ background: `linear-gradient(135deg, ${ACCENT}12 0%, rgba(255,255,255,0.02) 100%)` }}
      >
        <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: ACCENT }} />
        {imgSrc ? (
          <img src={imgSrc} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-display font-black"
            style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
          >
            {project.title.charAt(0)}
          </div>
        )}

        {/* Hover overlay */}
        <div className="port-overlay absolute inset-0 flex items-center justify-center gap-3"
          style={{ background: 'rgba(0,0,0,0.75)' }}
        >
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: ACCENT, color: '#fff' }}
            onClick={e => e.stopPropagation()}
          >
            <FiExternalLink size={13} /> View Live
          </a>
          <Link
            to={`/portfolio/${project.slug || toSlug(project.title)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Details <FiArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-bold text-white text-base leading-snug">{project.title}</h3>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full border ml-2 shrink-0"
            style={{ color: ACCENT, borderColor: ACCENT + '40', backgroundColor: ACCENT + '10' }}
          >
            {project.category}
          </span>
        </div>
        {project.description && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {project.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-md"
              style={{ color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioGrid({ projects, filter, setFilter }) {
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);
  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${filter === cat ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105' : 'hover:text-white'}`}
            style={filter !== cat ? { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </>
  );
}

export default function Portfolio({ showHeading = true, variant = 'carousel' }) {
  const [filter,   setFilter]   = useState('All');
  const [projects, setProjects] = useState(STATIC_PROJECTS);
  const [page,     setPage]     = useState(0);

  useEffect(() => {
    portfolioApi.list()
      .then(data => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
      .catch(() => {});
  }, []);

  const filtered   = filter === 'All' ? projects : projects.filter(p => p.category === filter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems  = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

  // Reset page when filter changes
  const handleFilter = (cat) => { setFilter(cat); setPage(0); };

  return (
    <section id="portfolio" className="py-24 overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-6">

        {showHeading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Recent Work</p>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white">
              My <span className="gradient-text">Portfolio</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
              A selection of projects I've built for clients across industries.
            </p>
            <div className="mt-4 mx-auto section-line animate" />
          </motion.div>
        )}

        {variant === 'grid' ? (
          <PortfolioGrid projects={projects} filter={filter} setFilter={setFilter} />
        ) : (
          <>
            {/* Filter tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => handleFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${filter === cat ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105' : 'hover:text-white'}`}
                  style={filter !== cat ? { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Carousel grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${page}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {pageItems.map(p => <ProjectCard key={p.id} project={p} />)}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mb-12">
                <button onClick={prev} disabled={page === 0}
                  className="w-11 h-11 rounded-full flex items-center justify-center border transition-all disabled:opacity-30 hover:border-accent hover:text-accent"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                  aria-label="Previous">
                  <FiChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span className="text-white">{page + 1}</span>
                  <span className="mx-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
                  {totalPages}
                </span>
                <button onClick={next} disabled={page === totalPages - 1}
                  className="w-11 h-11 rounded-full flex items-center justify-center border transition-all disabled:opacity-30 hover:border-accent hover:text-accent"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                  aria-label="Next">
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-2">
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Want to see more work or discuss a project?</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white font-bold shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Let's Work Together
          </button>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>View full portfolio on</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.fiverr.com/s/gD71ldb" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-200 hover:scale-105"
                style={{ borderColor: ACCENT, color: ACCENT }}
                onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ACCENT; }}
              >
                Fiverr <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01db2b03b5a7f36be8" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-200 hover:scale-105"
                style={{ borderColor: ACCENT, color: ACCENT }}
                onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ACCENT; }}
              >
                Upwork <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
