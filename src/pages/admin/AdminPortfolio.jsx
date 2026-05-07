import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiStar, FiCheckCircle, FiClock, FiDownload } from 'react-icons/fi';

const DEFAULT_PROJECTS = [
  { title: 'Shangrila',             category: 'WordPress', description: 'Premium resort and hospitality website with elegant design and booking features.',        live_url: 'https://shangrila.pk',               tags: ['WordPress', 'Elementor', 'Booking'],          status: 'completed', featured: true  },
  { title: 'The Velvet Kitchen',    category: 'WordPress', description: 'WooCommerce store for a premium food and catering brand.',                              live_url: 'https://thevelvetkitchen.com',        tags: ['WordPress', 'WooCommerce', 'Custom Theme'],   status: 'completed', featured: false },
  { title: 'Soulease Physiotherapy',category: 'WordPress', description: 'Professional physiotherapy clinic website with appointment booking system.',            live_url: 'https://souleasephysiotherapy.com',   tags: ['WordPress', 'Elementor', 'Booking'],          status: 'completed', featured: false },
  { title: 'Footsoul Clinic',       category: 'WordPress', description: 'UK-based podiatry clinic website with service showcase and online booking.',           live_url: 'https://footsoulclinic.co.uk',        tags: ['WordPress', 'Elementor', 'UK'],               status: 'completed', featured: false },
  { title: 'Dara Scents',           category: 'WordPress', description: 'WooCommerce fragrance store with custom product pages and checkout flow.',             live_url: 'https://darascents.com',              tags: ['WordPress', 'WooCommerce', 'Custom Design'],  status: 'completed', featured: false },
  { title: 'Hexa IT Solutions',     category: 'WordPress', description: 'Full corporate website for an IT solutions and software development firm.',            live_url: 'https://hexaitsolutions.com',         tags: ['WordPress', 'Custom Theme', 'ACF'],           status: 'completed', featured: false },
  { title: 'Oryx Nest',             category: 'WordPress', description: 'Professional company website with modern design and service showcase.',                live_url: 'https://oryxnest.com',                tags: ['WordPress', 'Custom Theme', 'Real Estate'],   status: 'completed', featured: false },
  { title: 'Vision Tact',           category: 'WordPress', description: 'Corporate website for a digital marketing and web development agency.',                live_url: 'https://visiontact.com',              tags: ['WordPress', 'Elementor', 'SEO'],              status: 'completed', featured: true  },
  { title: 'Galaxine Digital',      category: 'WordPress', description: 'Digital agency website with modern animations and service portfolio.',                 live_url: 'https://galaxinedigital.com',         tags: ['WordPress', 'Elementor', 'Agency'],           status: 'completed', featured: false },
  { title: 'TK Saudi Arabia',       category: 'WordPress', description: 'Saudi Arabian corporate website with bilingual Arabic/English support.',               live_url: 'https://tk.sa',                       tags: ['WordPress', 'RTL', 'Bilingual'],              status: 'completed', featured: false },
  { title: 'Hassan Mehmood',        category: 'WordPress', description: 'Elegant portfolio website for a professional UI/UX designer.',                        live_url: 'https://hassan-mehmood.com',          tags: ['WordPress', 'Custom Theme', 'Portfolio'],     status: 'completed', featured: false },
  { title: 'My Muslim Mentors',     category: 'WordPress', description: 'Islamic mentorship platform with course management and community features.',           live_url: 'https://mymuslimmentors.com',         tags: ['WordPress', 'LMS', 'Community'],              status: 'completed', featured: false },
  { title: 'Melaina KSA',           category: 'WordPress', description: 'Saudi Arabian beauty and lifestyle brand website with bilingual content.',             live_url: 'https://melaina-ksa.com',             tags: ['WordPress', 'Elementor', 'RTL'],              status: 'completed', featured: false },
  { title: 'Puravibra UAE',         category: 'WordPress', description: 'Dubai-based event management and entertainment website with booking integration.',     live_url: 'https://puravibrauae.com',            tags: ['WordPress', 'Elementor', 'Events'],           status: 'completed', featured: false },
  { title: 'OTO Fulfilment',        category: 'WordPress', description: 'E-commerce fulfilment company website with logistics service showcase.',              live_url: 'https://otofulfilment.com',           tags: ['WordPress', 'Custom Theme', 'Logistics'],     status: 'completed', featured: false },
  { title: 'Moallim AI',            category: 'React',     description: 'AI-powered Islamic education platform built with React and modern web technologies.',  live_url: 'https://moallim.ai',                  tags: ['React', 'AI', 'EdTech'],                      status: 'completed', featured: true  },
  { title: 'Aoraki Telecom',        category: 'React',     description: 'Modern ReactJS company website for a telecommunications provider.',                    live_url: 'https://aorakitelecom.com',           tags: ['React', 'Tailwind CSS', 'Responsive'],        status: 'completed', featured: false },
  { title: 'Nabqa',                 category: 'Shopify',   description: 'Full-featured Shopify store with custom design and conversion optimisation.',          live_url: 'https://nabqa.com',                   tags: ['Shopify', 'Liquid', 'App Integration'],       status: 'completed', featured: false },
  { title: 'Montiero',              category: 'Shopify',   description: 'Fashion e-commerce Shopify store with fully custom theme development.',                live_url: 'https://montiero.pk',                 tags: ['Shopify', 'Liquid', 'Custom Theme'],          status: 'completed', featured: false },
  { title: 'Al Jamilah Hair',       category: 'Shopify',   description: 'Premium hair care e-commerce store on Shopify with bespoke design.',                  live_url: 'https://aljamilahhair.com',            tags: ['Shopify', 'Liquid', 'Beauty'],                status: 'completed', featured: false },
];

const D = {
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  muted: 'rgba(255,255,255,0.4)',
  dim: 'rgba(255,255,255,0.25)',
};

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

export default function AdminPortfolio() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [seeding,  setSeeding]  = useState(false);
  const [seedDone, setSeedDone] = useState('');

  const load = () => {
    setLoading(true);
    portfolioApi.list()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const del = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await portfolioApi.delete(id);
    load();
  };

  const seedDefaults = async () => {
    if (!window.confirm(`This will import ${DEFAULT_PROJECTS.length} default projects into your database. Continue?`)) return;
    setSeeding(true);
    setSeedDone('');
    let created = 0;
    for (const p of DEFAULT_PROJECTS) {
      try { await portfolioApi.create(p); created++; } catch {}
    }
    setSeedDone(`✓ Imported ${created} projects`);
    setSeeding(false);
    load();
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
  const cats = ['all', ...Array.from(new Set(items.map(i => i.category)))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Portfolio</h1>
          <p className="text-sm mt-0.5" style={{ color: D.muted }}>{items.length} projects</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {items.length === 0 && (
            <button
              onClick={seedDefaults}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all disabled:opacity-60"
              style={{ color: '#7cb26e', background: 'rgba(124,178,110,0.08)', borderColor: 'rgba(124,178,110,0.3)' }}
            >
              <FiDownload size={15} /> {seeding ? 'Importing…' : 'Import Default Projects'}
            </button>
          )}
          {seedDone && <span className="text-xs font-semibold" style={{ color: '#7cb26e' }}>{seedDone}</span>}
          <Link
            to="/admin/portfolio/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all"
          >
            <FiPlus size={16} /> Add Project
          </Link>
        </div>
      </div>

      {/* Category filter */}
      {cats.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filter === c ? 'bg-accent text-white' : 'text-white/50 hover:text-white'}`}
              style={filter !== c ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' } : {}}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: D.card, border: `1px solid ${D.border}` }}>
              <div className="h-40" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="p-4 space-y-2">
                <div className="h-4 rounded w-2/3" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="h-3 rounded w-1/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: D.card, borderColor: D.border }}>
          <p style={{ color: D.muted }}>No portfolio items yet.</p>
          <Link to="/admin/portfolio/new" className="mt-4 inline-block text-accent text-sm font-semibold hover:underline">
            + Add your first project
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const imgSrc = item.image_url
              ? (item.image_url.startsWith('http') ? item.image_url : `${API_BASE}${item.image_url}`)
              : null;

            return (
              <div
                key={item.id}
                className="rounded-2xl border overflow-hidden flex flex-col"
                style={{ background: D.card, borderColor: D.border }}
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  {imgSrc ? (
                    <img src={imgSrc} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-display font-black" style={{ color: 'rgba(255,255,255,0.1)' }}>
                      {item.title.charAt(0)}
                    </span>
                  )}
                  {/* Badges overlay */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {item.featured && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        <FiStar size={10} /> Featured
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border"
                      style={item.status === 'completed'
                        ? { background: 'rgba(124,178,110,0.15)', color: '#7cb26e', borderColor: 'rgba(124,178,110,0.3)' }
                        : { background: 'rgba(255,165,0,0.15)', color: '#ffa500', borderColor: 'rgba(255,165,0,0.3)' }
                      }
                    >
                      {item.status === 'completed' ? <FiCheckCircle size={10} /> : <FiClock size={10} />}
                      {item.status || 'completed'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm leading-snug">{item.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(124,178,110,0.12)', color: '#7cb26e', border: '1px solid rgba(124,178,110,0.25)' }}
                    >
                      {item.category}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs line-clamp-2 mb-3 flex-1" style={{ color: D.dim }}>{item.description}</p>
                  )}
                  {item.meta_title && (
                    <p className="text-xs mb-2 truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      SEO: {item.meta_title}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {item.live_url ? (
                      <a
                        href={item.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-semibold"
                      >
                        <FiExternalLink size={11} /> View Live
                      </a>
                    ) : <span />}
                    <div className="flex gap-1.5">
                      <Link
                        to={`/admin/portfolio/${item.id}/edit`}
                        className="p-1.5 rounded-lg transition text-white/40 hover:text-accent hover:bg-accent/10"
                      >
                        <FiEdit2 size={13} />
                      </Link>
                      <button
                        onClick={() => del(item.id, item.title)}
                        className="p-1.5 rounded-lg transition text-white/40 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
