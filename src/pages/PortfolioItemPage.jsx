import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink, FiArrowLeft, FiTag, FiCalendar, FiLayers } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import { portfolioApi } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://aizazaliafridi.com';
const ACCENT   = '#7cb26e';

const STATIC_MAP = {
  1:  { title: 'Shangrila',               category: 'WordPress', description: 'Premium resort and hospitality website with elegant design and booking features.',                                              live_url: 'https://shangrila.pk',                                        tags: ['WordPress', 'Elementor', 'Booking'],         image_url: null },
  2:  { title: 'The Velvet Kitchen',       category: 'WordPress', description: 'WooCommerce store for a premium food and catering brand with a fully custom checkout flow.',                                  live_url: 'https://thevelvetkitchen.com',                                 tags: ['WordPress', 'WooCommerce', 'Custom Theme'],  image_url: null },
  3:  { title: 'Soulease Physiotherapy',   category: 'WordPress', description: 'Professional physiotherapy clinic website with appointment booking system and service pages.',                                live_url: 'https://souleasephysiotherapy.com',                           tags: ['WordPress', 'Elementor', 'Booking'],         image_url: null },
  4:  { title: 'Footsoul Clinic',          category: 'WordPress', description: 'UK-based podiatry clinic website with service showcase and online booking system.',                                          live_url: 'https://footsoulclinic.co.uk',                                tags: ['WordPress', 'Elementor', 'UK'],              image_url: null },
  5:  { title: 'Dara Scents',              category: 'WordPress', description: 'WooCommerce fragrance store with custom product pages, category filtering and optimised checkout flow.',                      live_url: 'https://darascents.com',                                      tags: ['WordPress', 'WooCommerce', 'Custom Design'], image_url: null },
  6:  { title: 'Hexa IT Solutions',        category: 'WordPress', description: 'Full corporate website for an IT solutions and software development firm with service showcase and team pages.',               live_url: 'https://hexaitsolutions.com',                                 tags: ['WordPress', 'Custom Theme', 'ACF'],          image_url: null },
  7:  { title: 'Oryx Nest',                category: 'WordPress', description: 'Professional real estate company website with modern design, property listings and service showcase.',                        live_url: 'https://oryxnest.com',                                        tags: ['WordPress', 'Custom Theme', 'Real Estate'],  image_url: null },
  8:  { title: 'Vision Tact',              category: 'WordPress', description: 'Corporate website for a digital marketing and web development agency with full SEO optimisation.',                             live_url: 'https://visiontact.com',                                      tags: ['WordPress', 'Elementor', 'SEO'],             image_url: null },
  9:  { title: 'Galaxine Digital',         category: 'WordPress', description: 'Digital agency website with modern animations, service portfolio and lead generation forms.',                                 live_url: 'https://galaxinedigital.com',                                 tags: ['WordPress', 'Elementor', 'Agency'],          image_url: null },
  10: { title: 'TK Saudi Arabia',          category: 'WordPress', description: 'Saudi Arabian corporate website with full bilingual Arabic/English support and RTL layout.',                                  live_url: 'https://tk.sa',                                               tags: ['WordPress', 'RTL', 'Bilingual'],             image_url: null },
  11: { title: 'Hassan Mehmood',           category: 'WordPress', description: 'Elegant portfolio website for a professional UI/UX designer, showcasing work with smooth animations.',                       live_url: 'https://hassan-mehmood.com',                                  tags: ['WordPress', 'Custom Theme', 'Portfolio'],    image_url: null },
  12: { title: 'My Muslim Mentors',        category: 'WordPress', description: 'Islamic mentorship platform with course management, community features and membership integration.',                          live_url: 'https://mymuslimmentors.com',                                 tags: ['WordPress', 'LMS', 'Community'],             image_url: null },
  13: { title: 'Melaina KSA',              category: 'WordPress', description: 'Saudi Arabian beauty and lifestyle brand website with bilingual content and modern product showcase.',                        live_url: 'https://melaina-ksa.com',                                     tags: ['WordPress', 'Elementor', 'RTL'],             image_url: null },
  14: { title: 'Puravibra UAE',            category: 'WordPress', description: 'Dubai-based event management and entertainment website with booking integration and gallery.',                                live_url: 'https://puravibrauae.com',                                    tags: ['WordPress', 'Elementor', 'Events'],          image_url: null },
  15: { title: 'OTO Fulfilment',           category: 'WordPress', description: 'E-commerce fulfilment company website with logistics service showcase and client portal info.',                               live_url: 'https://otofulfilment.com',                                   tags: ['WordPress', 'Custom Theme', 'Logistics'],    image_url: null },
  16: { title: 'Moallim AI',               category: 'React',     description: 'AI-powered Islamic education platform built with React. Features interactive lessons and personalised learning paths.',       live_url: 'https://moallim.ai',                                          tags: ['React', 'AI', 'EdTech'],                     image_url: null },
  17: { title: 'Aoraki Telecom',           category: 'React',     description: 'Modern ReactJS company website for a telecommunications provider with responsive design and fast performance.',               live_url: 'https://aorakitelecom.com',                                   tags: ['React', 'Tailwind CSS', 'Responsive'],       image_url: null },
  18: { title: 'Nabqa',                    category: 'Shopify',   description: 'Full-featured Shopify store with custom design, app integrations and conversion rate optimisation.',                          live_url: 'https://nabqa.com',                                           tags: ['Shopify', 'Liquid', 'App Integration'],      image_url: null },
  19: { title: 'Montiero',                 category: 'Shopify',   description: 'Fashion e-commerce Shopify store with a fully custom Liquid theme, product filtering and lookbook.',                         live_url: 'https://montiero.pk',                                         tags: ['Shopify', 'Liquid', 'Custom Theme'],         image_url: null },
  20: { title: 'Al Jamilah Hair',          category: 'Shopify',   description: 'Premium hair care e-commerce store on Shopify with bespoke design, upsell flows and loyalty features.',                     live_url: 'https://aljamilahhair.com',                                   tags: ['Shopify', 'Liquid', 'Beauty'],               image_url: null },
};

export default function PortfolioItemPage() {
  const { id }  = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const numId = parseInt(id, 10);
    portfolioApi.get(numId)
      .then(data => setProject(data))
      .catch(() => {
        const fallback = STATIC_MAP[numId];
        if (fallback) setProject({ id: numId, ...fallback });
        else setError('Project not found.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageWrapper title="Loading…" description="" canonical={`/portfolio/${id}`}>
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !project) {
    return (
      <PageWrapper title="Not Found" description="" canonical={`/portfolio/${id}`}>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0a0a' }}>
          <p className="text-white text-lg font-bold">Project not found.</p>
          <Link to="/portfolio" className="text-accent hover:underline flex items-center gap-1">
            <FiArrowLeft size={14} /> Back to Portfolio
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const imgSrc = project.image_url
    ? (project.image_url.startsWith('http') ? project.image_url : `${API_BASE}${project.image_url}`)
    : null;

  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <PageWrapper
      title={`${project.title} — Portfolio`}
      description={project.description || `${project.title} — a project by Aizaz Ali Afridi.`}
      canonical={`/portfolio/${id}`}
    >
      {/* Breadcrumb */}
      <section className="pt-28 pb-6 px-6" style={{ background: '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Breadcrumb">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link>
            <span>/</span>
            <span style={{ color: ACCENT }}>{project.title}</span>
          </nav>

          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors hover:text-accent"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <FiArrowLeft size={14} /> Back to Portfolio
          </Link>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-24 px-6" style={{ background: '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Cover image or placeholder */}
            <div
              className="w-full rounded-3xl overflow-hidden mb-10 flex items-center justify-center"
              style={{
                height: imgSrc ? 'auto' : '300px',
                background: imgSrc ? 'transparent' : `linear-gradient(135deg, ${ACCENT}15 0%, rgba(255,255,255,0.02) 100%)`,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {imgSrc ? (
                <img src={imgSrc} alt={project.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-display font-black"
                    style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
                  >
                    {project.title.charAt(0)}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No preview image</p>
                </div>
              )}
            </div>

            {/* Project header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ background: `${ACCENT}18`, color: ACCENT }}
                  >
                    <FiLayers size={11} /> {project.category}
                  </span>
                  {project.featured && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
                  {project.title}
                </h1>
              </div>

              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shrink-0 transition-all hover:scale-105 active:scale-95"
                  style={{ background: ACCENT, color: '#fff' }}
                >
                  <FiExternalLink size={14} /> View Live Site
                </a>
              )}
            </div>

            <div className="h-px mb-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {/* Description */}
            {project.description && (
              <div className="mb-8">
                <h2 className="text-lg font-display font-bold text-white mb-3">About This Project</h2>
                <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
                  {project.description}
                </p>
              </div>
            )}

            {/* Tech stack */}
            {tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-display font-bold text-white mb-3 flex items-center gap-2">
                  <FiTag size={16} style={{ color: ACCENT }} /> Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="text-sm px-3 py-1.5 rounded-lg font-semibold"
                      style={{ color: ACCENT, background: `${ACCENT}12`, border: `1px solid ${ACCENT}30` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            {project.created_at && (
              <div className="flex items-center gap-2 text-sm mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <FiCalendar size={13} />
                <span>Added {new Date(project.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}

            {/* CTA strip */}
            <div
              className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30` }}
            >
              <div>
                <p className="font-bold text-white mb-1">Interested in a similar project?</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Let's discuss your requirements and build something great together.</p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{ background: ACCENT, color: '#fff' }}
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
