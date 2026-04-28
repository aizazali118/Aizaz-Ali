import { useState, useEffect } from 'react';
import { portfolioApi } from '../../lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from 'react-icons/fi';

const D = { card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', input: 'rgba(255,255,255,0.06)', muted: 'rgba(255,255,255,0.4)', dim: 'rgba(255,255,255,0.25)' };

const CATS = ['WordPress', 'Shopify', 'React', 'Next.js', 'UI/UX', 'Custom Software'];

const EMPTY = { title: '', category: 'WordPress', image_url: '', description: '', live_url: '', tags: '', featured: false };

const inputCls = { background: D.input, border: `1px solid ${D.border}`, color: '#fff', borderRadius: '0.75rem', padding: '0.7rem 1rem', width: '100%', fontSize: '0.875rem', outline: 'none' };

export default function AdminPortfolio() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [delId,   setDelId]   = useState(null);

  const load = () => { setLoading(true); portfolioApi.list().then(setItems).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...item, tags: (item.tags || []).join(', ') }); setEditing(item.id); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editing) await portfolioApi.update(editing, data);
      else         await portfolioApi.create(data);
      setModal(false); load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    await portfolioApi.delete(id); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Portfolio</h1>
          <p className="text-sm mt-1" style={{ color: D.muted }}>Manage your portfolio projects</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all">
          <FiPlus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: D.card }} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: D.card, borderColor: D.border }}>
          <p style={{ color: D.muted }}>No portfolio items yet.</p>
          <button onClick={openNew} className="mt-4 text-accent text-sm font-semibold hover:underline">+ Add your first project</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl border overflow-hidden transition-all" style={{ background: D.card, borderColor: D.border }}>
              {item.image_url && (
                <div className="h-40 overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: D.muted }}>{item.category}</p>
                  </div>
                  {item.featured && <FiStar size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />}
                </div>
                {item.description && <p className="text-xs mt-2 line-clamp-2" style={{ color: D.dim }}>{item.description}</p>}
                <div className="flex items-center justify-between mt-4">
                  {item.live_url ? (
                    <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline font-semibold">View Live →</a>
                  ) : <span />}
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-white/40 hover:text-accent hover:bg-accent/10 transition">
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => del(item.id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-3xl border p-7 max-h-[90vh] overflow-y-auto" style={{ background: '#111611', borderColor: D.border }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-black text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition"><FiX size={18} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Title *</label>
                <input style={inputCls} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required placeholder="Project title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Category</label>
                  <select style={{ ...inputCls, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} className="accent-accent w-4 h-4" />
                    <span className="text-sm text-white/70">Featured</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Image URL</label>
                <input style={inputCls} value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Live URL</label>
                <input style={inputCls} value={form.live_url} onChange={e => setForm(f => ({...f, live_url: e.target.value}))} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Description</label>
                <textarea style={{ ...inputCls, resize: 'none' }} rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Short description..." />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Tags (comma-separated)</label>
                <input style={inputCls} value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="React, Tailwind, GSAP" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 disabled:opacity-60 transition-all">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add Project'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="px-5 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/8 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
