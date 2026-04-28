import { useState, useEffect } from 'react';
import { testimonialsApi } from '../../lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from 'react-icons/fi';

const D = { card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', input: 'rgba(255,255,255,0.06)', muted: 'rgba(255,255,255,0.4)', dim: 'rgba(255,255,255,0.25)' };
const inputCls = { background: D.input, border: `1px solid ${D.border}`, color: '#fff', borderRadius: '0.75rem', padding: '0.7rem 1rem', width: '100%', fontSize: '0.875rem', outline: 'none' };
const EMPTY = { client_name: '', client_title: '', company: '', avatar_url: '', content: '', rating: 5, featured: false };

function Stars({ rating, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <FiStar size={20} fill={n <= rating ? '#f59e0b' : 'none'} stroke={n <= rating ? '#f59e0b' : 'rgba(255,255,255,0.3)'} />
        </button>
      ))}
    </div>
  );
}

export default function AdminTestimonials() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = () => { setLoading(true); testimonialsApi.list().then(setItems).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm(item); setEditing(item.id); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await testimonialsApi.update(editing, form);
      else         await testimonialsApi.create(form);
      setModal(false); load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await testimonialsApi.delete(id); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Testimonials</h1>
          <p className="text-sm mt-1" style={{ color: D.muted }}>Client reviews and testimonials</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all">
          <FiPlus size={16} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: D.card }} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: D.card, borderColor: D.border }}>
          <p style={{ color: D.muted }}>No testimonials yet.</p>
          <button onClick={openNew} className="mt-4 text-accent text-sm font-semibold hover:underline">+ Add first testimonial</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl border p-5 transition-all" style={{ background: D.card, borderColor: D.border }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.client_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-sm">
                      {item.client_name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm">{item.client_name}</p>
                    <p className="text-xs" style={{ color: D.muted }}>{item.client_title}{item.company && ` · ${item.company}`}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {item.featured && <FiStar size={13} fill="#f59e0b" stroke="#f59e0b" />}
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-white/40 hover:text-accent hover:bg-accent/10 transition">
                    <FiEdit2 size={13} />
                  </button>
                  <button onClick={() => del(item.id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({length: 5}).map((_, i) => (
                  <FiStar key={i} size={12} fill={i < item.rating ? '#f59e0b' : 'none'} stroke={i < item.rating ? '#f59e0b' : 'rgba(255,255,255,0.2)'} />
                ))}
              </div>
              <p className="text-xs leading-relaxed line-clamp-3" style={{ color: D.dim }}>"{item.content}"</p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-3xl border p-7 max-h-[90vh] overflow-y-auto" style={{ background: '#111611', borderColor: D.border }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-black text-white">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition"><FiX size={18} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Client Name *</label>
                  <input style={inputCls} value={form.client_name} onChange={e => setForm(f => ({...f, client_name: e.target.value}))} required placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Title / Role</label>
                  <input style={inputCls} value={form.client_title} onChange={e => setForm(f => ({...f, client_title: e.target.value}))} placeholder="CEO" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Company</label>
                  <input style={inputCls} value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} placeholder="Acme Inc." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Avatar URL</label>
                  <input style={inputCls} value={form.avatar_url} onChange={e => setForm(f => ({...f, avatar_url: e.target.value}))} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Review *</label>
                <textarea style={{ ...inputCls, resize: 'none' }} rows={4} value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} required placeholder="What did they say about your work?" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: D.muted }}>Rating</label>
                  <Stars rating={form.rating} onChange={r => setForm(f => ({...f, rating: r}))} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} className="accent-accent w-4 h-4" />
                  <span className="text-sm text-white/70">Featured</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 disabled:opacity-60 transition-all">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add Testimonial'}
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
