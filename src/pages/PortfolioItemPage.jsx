import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink, FiArrowLeft, FiTag, FiCalendar, FiLayers } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import { portfolioApi } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://aizazaliafridi.com';
const ACCENT   = '#7cb26e';

export default function PortfolioItemPage() {
  const { slug }  = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    portfolioApi.getBySlug(slug)
      .then(data => setProject(data))
      .catch(() => setError('Project not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PageWrapper title="Loading…" description="" canonical={`/portfolio/${slug}`}>
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !project) {
    return (
      <PageWrapper title="Not Found" description="" canonical={`/portfolio/${slug}`}>
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

  const tags      = Array.isArray(project.tags) ? project.tags : [];
  const seoTitle  = project.meta_title      || `${project.title} — Portfolio | Aizaz Ali Afridi`;
  const seoDesc   = project.seo_description || project.description || `${project.title} — a project by Aizaz Ali Afridi.`;

  return (
    <PageWrapper title={seoTitle} description={seoDesc} canonical={`/portfolio/${slug}`}>
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
          <Link to="/portfolio"
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* Cover */}
            <div className="w-full rounded-3xl overflow-hidden mb-10 flex items-center justify-center"
              style={{
                height: imgSrc ? 'auto' : '280px',
                background: imgSrc ? 'transparent' : `linear-gradient(135deg, ${ACCENT}15 0%, rgba(255,255,255,0.02) 100%)`,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {imgSrc ? (
                <img src={imgSrc} alt={project.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-display font-black"
                    style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`, color: ACCENT }}>
                    {project.title.charAt(0)}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No preview image</p>
                </div>
              )}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ background: `${ACCENT}18`, color: ACCENT }}>
                    <FiLayers size={11} /> {project.category}
                  </span>
                  {project.status && project.status !== 'completed' && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: 'rgba(255,165,0,0.12)', color: '#ffa500', border: '1px solid rgba(255,165,0,0.3)' }}>
                      {project.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">{project.title}</h1>
              </div>
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shrink-0 transition-all hover:scale-105"
                  style={{ background: ACCENT, color: '#fff' }}>
                  <FiExternalLink size={14} /> View Live Site
                </a>
              )}
            </div>

            <div className="h-px mb-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {project.description && (
              <div className="mb-8">
                <h2 className="text-lg font-display font-bold text-white mb-3">About This Project</h2>
                <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>{project.description}</p>
              </div>
            )}

            {tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-display font-bold text-white mb-3 flex items-center gap-2">
                  <FiTag size={16} style={{ color: ACCENT }} /> Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span key={t} className="text-sm px-3 py-1.5 rounded-lg font-semibold"
                      style={{ color: ACCENT, background: `${ACCENT}12`, border: `1px solid ${ACCENT}30` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.created_at && (
              <div className="flex items-center gap-2 text-sm mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <FiCalendar size={13} />
                <span>Added {new Date(project.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30` }}>
              <div>
                <p className="font-bold text-white mb-1">Interested in a similar project?</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Let's discuss your requirements and build something great together.</p>
              </div>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shrink-0 transition-all hover:scale-105"
                style={{ background: ACCENT, color: '#fff' }}>
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
