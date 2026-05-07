import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portfolioApi, uploadsApi } from '../../lib/api';
import { FiArrowLeft, FiUpload, FiX, FiExternalLink } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const CATS    = ['WordPress', 'Shopify', 'React', 'Next.js', 'UI/UX', 'Custom Software'];
const STATUSES = [
  { value: 'completed',    label: 'Completed' },
  { value: 'in_progress',  label: 'In Progress' },
  { value: 'coming_soon',  label: 'Coming Soon' },
];

const D = {
  card:   '#111611',
  border: 'rgba(255,255,255,0.08)',
  input:  'rgba(255,255,255,0.06)',
  muted:  'rgba(255,255,255,0.45)',
  label:  'rgba(255,255,255,0.55)',
};

const inputBase = {
  background: D.input,
  border: `1px solid ${D.border}`,
  color: '#fff',
  borderRadius: '0.75rem',
  padding: '0.7rem 1rem',
  width: '100%',
  fontSize: '0.875rem',
  outline: 'none',
};

const EMPTY = {
  title: '', category: 'WordPress', image_url: '', description: '',
  live_url: '', tags: '', featured: false, sort_order: 0,
  meta_title: '', seo_description: '', status: 'completed',
};

export default function AdminPortfolioEditor() {
  const { id }  = useParams();
  const nav     = useNavigate();
  const isNew   = !id || id === 'new';

  const [form,       setForm]       = useState(EMPTY);
  const [saving,     setSaving]     = useState(false);
  const [loading,    setLoading]    = useState(!isNew);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgPreview,   setImgPreview]   = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (isNew) return;
    portfolioApi.get(parseInt(id, 10))
      .then(data => {
        setForm({
          title:           data.title           || '',
          category:        data.category        || 'WordPress',
          image_url:       data.image_url       || '',
          description:     data.description     || '',
          live_url:        data.live_url        || '',
          tags:            Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
          featured:        !!data.featured,
          sort_order:      data.sort_order      || 0,
          meta_title:      data.meta_title      || '',
          seo_description: data.seo_description || '',
          status:          data.status          || 'completed',
        });
        if (data.image_url) {
          setImgPreview(data.image_url.startsWith('http') ? data.image_url : `${API_BASE}${data.image_url}`);
        }
      })
      .catch(() => nav('/admin/portfolio'))
      .finally(() => setLoading(false));
  }, [id, isNew, nav]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const { url } = await uploadsApi.uploadImage(file);
      set('image_url', url);
      setImgPreview(url.startsWith('http') ? url : `${API_BASE}${url}`);
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setImgUploading(false);
    }
  };

  const clearImage = () => {
    set('image_url', '');
    setImgPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        sort_order: parseInt(form.sort_order, 10) || 0,
      };
      if (isNew) await portfolioApi.create(data);
      else        await portfolioApi.update(parseInt(id, 10), data);
      nav('/admin/portfolio');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const titleChars       = form.meta_title.length;
  const descChars        = form.seo_description.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-7 h-7 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => nav('/admin/portfolio')}
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition"
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-black text-white">
            {isNew ? 'New Project' : 'Edit Project'}
          </h1>
          {!isNew && <p className="text-xs mt-0.5" style={{ color: D.muted }}>ID #{id}</p>}
        </div>
      </div>

      <form onSubmit={save} className="space-y-6">

        {/* ── Feature Image ── */}
        <section className="rounded-2xl border p-6" style={{ background: D.card, borderColor: D.border }}>
          <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Feature Image</h2>

          {imgPreview ? (
            <div className="relative rounded-xl overflow-hidden mb-3 group" style={{ maxHeight: '260px' }}>
              <img src={imgPreview} alt="Preview" className="w-full object-cover" style={{ maxHeight: '260px' }} />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-500/80 transition"
              >
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <div
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-10 mb-3 cursor-pointer hover:border-accent/50 transition"
              style={{ borderColor: D.border }}
              onClick={() => fileRef.current?.click()}
            >
              <FiUpload size={28} style={{ color: D.muted }} />
              <p className="text-sm mt-2" style={{ color: D.muted }}>Click to upload feature image</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>JPG, PNG, WebP — max 5 MB</p>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={imgUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white border transition disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.06)', borderColor: D.border }}
            >
              <FiUpload size={13} /> {imgUploading ? 'Uploading…' : imgPreview ? 'Replace Image' : 'Upload Image'}
            </button>
            {imgPreview && form.live_url && (
              <a href={form.live_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-accent border transition"
                style={{ background: 'rgba(124,178,110,0.08)', borderColor: 'rgba(124,178,110,0.25)' }}
              >
                <FiExternalLink size={13} /> View Live
              </a>
            )}
          </div>

          {/* Or paste URL */}
          <div className="mt-3">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Or paste image URL</label>
            <input
              style={inputBase}
              value={form.image_url}
              onChange={e => { set('image_url', e.target.value); setImgPreview(e.target.value); }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </section>

        {/* ── Basic Info ── */}
        <section className="rounded-2xl border p-6 space-y-4" style={{ background: D.card, borderColor: D.border }}>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Project Details</h2>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Title *</label>
            <input style={inputBase} required value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Project name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Category</label>
              <select style={{ ...inputBase, cursor: 'pointer' }} value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Status</label>
              <select style={{ ...inputBase, cursor: 'pointer' }} value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Live URL</label>
            <input style={inputBase} value={form.live_url}
              onChange={e => set('live_url', e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Description</label>
            <textarea
              style={{ ...inputBase, resize: 'vertical' }}
              rows={4}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="What did you build and why? What problems did it solve?"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Tags (comma-separated)</label>
            <input style={inputBase} value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="WordPress, WooCommerce, Custom Theme"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: D.label }}>Sort Order</label>
              <input style={inputBase} type="number" value={form.sort_order}
                onChange={e => set('sort_order', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm font-semibold" style={{ color: D.label }}>Mark as Featured</span>
              </label>
            </div>
          </div>
        </section>

        {/* ── SEO ── */}
        <section className="rounded-2xl border p-6 space-y-4" style={{ background: D.card, borderColor: D.border }}>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">SEO & Meta</h2>
            <p className="text-xs mt-0.5" style={{ color: D.muted }}>Used for search engine listings and the project detail page.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold" style={{ color: D.label }}>Meta Title</label>
              <span className="text-xs" style={{ color: titleChars > 60 ? '#f87171' : D.muted }}>{titleChars}/60</span>
            </div>
            <input
              style={{ ...inputBase, borderColor: titleChars > 60 ? 'rgba(248,113,113,0.5)' : D.border }}
              value={form.meta_title}
              onChange={e => set('meta_title', e.target.value)}
              placeholder={`${form.title || 'Project Name'} — Portfolio | Aizaz Ali`}
              maxLength={80}
            />
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Shown in Google search results. Ideal: 50–60 chars.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold" style={{ color: D.label }}>SEO Description</label>
              <span className="text-xs" style={{ color: descChars > 160 ? '#f87171' : D.muted }}>{descChars}/160</span>
            </div>
            <textarea
              style={{ ...inputBase, resize: 'none', borderColor: descChars > 160 ? 'rgba(248,113,113,0.5)' : D.border }}
              rows={3}
              value={form.seo_description}
              onChange={e => set('seo_description', e.target.value)}
              placeholder="Brief description for search engines. Summarise what this project is and who it's for."
              maxLength={200}
            />
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Shown under the title in Google. Ideal: 120–160 chars.
            </p>
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 disabled:opacity-60 transition-all shadow-lg shadow-accent/25"
          >
            {saving ? 'Saving…' : isNew ? 'Create Project' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => nav('/admin/portfolio')}
            className="px-5 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: `1px solid ${D.border}` }}
          >
            Cancel
          </button>
          {!isNew && form.live_url && (
            <a
              href={form.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ color: '#7cb26e', background: 'rgba(124,178,110,0.08)', border: '1px solid rgba(124,178,110,0.25)' }}
            >
              <FiExternalLink size={13} /> View Live Site
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
