import { useState, useEffect } from 'react';
import { siteServicesApi } from '../../lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const D = { card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', input: 'rgba(255,255,255,0.06)', muted: 'rgba(255,255,255,0.4)', dim: 'rgba(255,255,255,0.25)' };
const inputCls = { background: D.input, border: `1px solid ${D.border}`, color: '#fff', borderRadius: '0.75rem', padding: '0.7rem 1rem', width: '100%', fontSize: '0.875rem', outline: 'none' };
const EMPTY = { title: '', tagline: '', description: '', features: '', icon_name: 'FaWordpress', accent_color: '#7cb26e', badge: '', active: true };

export default function AdminServices() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  const load = () => { setLoading(true); siteServicesApi.list().then(setItems).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...item, features: (item.features || []).join('\n') }); setEditing(item.id); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) };
      if (editing) await siteServicesApi.update(editing, data);
      else         await siteServicesApi.create(data);
      setModal(false); load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await siteServicesApi.delete(id); load();
  };

  const toggle = async (item) => {
    await siteServicesApi.update(item.id, { ...item, active: !item.active });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Services</h1>
          <p className="text-sm mt-1" style={{ color: D.muted }}>Manage the services shown on your site</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all">
          <FiPlus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: D.card }} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ background: D.card, borderColor: D.border }}>
          <p style={{ color: D.muted }}>No services yet.</p>
          <button onClick={openNew} className="mt-4 text-accent text-sm font-semibold hover:underline">+ Add your first service</button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl border p-5 flex items-center gap-4 transition-all" style={{ background: D.card, borderColor: D.border }}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.accent_color || '#7cb26e' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: item.badge === 'New' ? 'linear-gradient(135deg,#ec4899,#f97316)' : 'linear-gradient(135deg,#5a9a4a,#7cb26e)' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: D.muted }}>{item.tagline}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => toggle(item)} className="transition-colors" title={item.active ? 'Active' : 'Inactive'}>
                  {item.active ? <FiToggleRight size={22} className="text-accent" /> : <FiToggleLeft size={22} style={{ color: D.dim }} />}
                </button>
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-white/40 hover:text-accent hover:bg-accent/10 transition">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => del(item.id)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-3xl border p-7 max-h-[90vh] overflow-y-auto" style={{ background: '#111611', borderColor: D.border }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-black text-white">{editing ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition"><FiX size={18} /></button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Title *</label>
                <input style={inputCls} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required placeholder="WordPress Development" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Tagline</label>
                <input style={inputCls} value={form.tagline} onChange={e => setForm(f => ({...f, tagline: e.target.value}))} placeholder="Custom themes & powerful plugins" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Description</label>
                <textarea style={{ ...inputCls, resize: 'none' }} rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Features (one per line)</label>
                <textarea style={{ ...inputCls, resize: 'none' }} rows={5} value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} placeholder={"Custom Theme Development\nWooCommerce Store Setup\nSpeed Optimisation"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Accent Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.accent_color} onChange={e => setForm(f => ({...f, accent_color: e.target.value}))} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <input style={{ ...inputCls, flex: 1 }} value={form.accent_color} onChange={e => setForm(f => ({...f, accent_color: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Badge</label>
                  <select style={{ ...inputCls, cursor: 'pointer' }} value={form.badge} onChange={e => setForm(f => ({...f, badge: e.target.value}))}>
                    <option value="">None</option>
                    <option value="Most Popular">Most Popular</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))} className="accent-accent w-4 h-4" />
                  <span className="text-sm text-white/70">Active (show on site)</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 disabled:opacity-60 transition-all">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add Service'}
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
