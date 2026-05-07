import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiStar, FiCheckCircle, FiClock } from 'react-icons/fi';

const D = {
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  muted: 'rgba(255,255,255,0.4)',
  dim: 'rgba(255,255,255,0.25)',
};

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

export default function AdminPortfolio() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

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

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
  const cats = ['all', ...Array.from(new Set(items.map(i => i.category)))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Portfolio</h1>
          <p className="text-sm mt-0.5" style={{ color: D.muted }}>{items.length} projects</p>
        </div>
        <Link
          to="/admin/portfolio/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all"
        >
          <FiPlus size={16} /> Add Project
        </Link>
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
