import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminPostsApi, uploadsApi, postsApi } from '../../lib/api';
import {
  FiSave, FiArrowLeft, FiUpload, FiTrash2, FiDownload,
  FiEye, FiImage, FiBold, FiItalic, FiList, FiCode,
} from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/* ── Simple rich-text toolbar (works with execCommand on a contenteditable div) ── */
function Toolbar({ onInsertImage }) {
  const exec = (cmd, val = null) => { document.execCommand(cmd, false, val); };
  return (
    <div className="flex flex-wrap gap-1 px-3 py-2 rounded-t-xl" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {[
        { icon: FiBold,   cmd: 'bold',          title: 'Bold'       },
        { icon: FiItalic, cmd: 'italic',         title: 'Italic'     },
        { icon: FiList,   cmd: 'insertUnorderedList', title: 'List' },
        { icon: FiCode,   cmd: 'formatBlock',    val: 'pre', title: 'Code' },
      ].map(({ icon: Icon, cmd, val, title }) => (
        <button
          key={cmd}
          type="button"
          title={title}
          onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
          className="p-2 rounded-lg text-gray-400 hover:text-white transition" style={{ ':hover': { background: 'rgba(255,255,255,0.1)' } }}
        >
          <Icon size={14} />
        </button>
      ))}
      {[1, 2, 3].map(n => (
        <button
          key={`h${n}`}
          type="button"
          title={`Heading ${n}`}
          onMouseDown={e => { e.preventDefault(); exec('formatBlock', `h${n}`); }}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition"
        >
          H{n}
        </button>
      ))}
      <button
        type="button"
        title="Insert Image"
        onClick={onInsertImage}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-accent/10 hover:text-accent text-gray-600 transition"
      >
        <FiImage size={13} /> Image
      </button>
    </div>
  );
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminPostEditor() {
  const { id }   = useParams();          // undefined = new post
  const isNew    = !id;
  const navigate = useNavigate();

  const editorRef   = useRef(null);
  const imageInputRef = useRef(null);
  const dlInputRef    = useRef(null);

  const [form, setForm] = useState({
    title:       '',
    excerpt:     '',
    category_id: '',
    status:      'draft',
    cover_alt:   '',
    meta_title:  '',
    meta_desc:   '',
  });
  const [coverFile,    setCoverFile]    = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [existingCover, setExistingCover] = useState('');
  const [categories,   setCategories]   = useState([]);
  const [downloads,    setDownloads]    = useState([]);
  const [dlLabel,      setDlLabel]      = useState('');
  const [dlFile,       setDlFile]       = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [error,        setError]        = useState('');
  const [savedId,      setSavedId]      = useState(id || null);

  /* Load categories */
  useEffect(() => {
    postsApi.categories().then(setCategories).catch(console.error);
  }, []);

  /* Load existing post */
  useEffect(() => {
    if (!isNew) {
      adminPostsApi.get(id).then(post => {
        setForm({
          title:       post.title || '',
          excerpt:     post.excerpt || '',
          category_id: post.category_id || '',
          status:      post.status || 'draft',
          cover_alt:   post.cover_alt || '',
          meta_title:  post.meta_title || '',
          meta_desc:   post.meta_desc  || '',
        });
        if (editorRef.current) editorRef.current.innerHTML = post.content || '';
        if (post.cover_image) setExistingCover(`${API_BASE}${post.cover_image}`);
        if (post.downloads)   setDownloads(post.downloads);
        setSavedId(id);
      }).catch(err => setError('Could not load post: ' + err.message));
    }
  }, [id, isNew]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  /* Cover image preview */
  const onCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  /* Insert image inline into editor via upload */
  const handleInsertImage = () => imageInputRef.current?.click();
  const onInlineImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadsApi.uploadImage(file);
      const img = `<img src="${API_BASE}${url}" alt="" class="rounded-xl max-w-full my-4" />`;
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, img);
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  /* Save post */
  const save = async (e) => {
    e?.preventDefault();
    setError('');
    setSaving(true);
    try {
      const content = editorRef.current?.innerHTML || '';
      if (!form.title.trim()) throw new Error('Title is required');
      if (!content.trim())    throw new Error('Content is required');

      let cover_image = isNew ? null : undefined;

      // Upload cover image if changed
      if (coverFile) {
        const { url } = await uploadsApi.uploadImage(coverFile);
        cover_image = url;
      }

      const payload = { ...form, content, ...(cover_image !== undefined && { cover_image }) };

      let post;
      if (isNew) {
        post = await adminPostsApi.create(payload);
        setSavedId(post.id);
        navigate(`/admin/posts/${post.id}/edit`, { replace: true });
      } else {
        post = await adminPostsApi.update(id, payload);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* Attach downloadable file */
  const attachDownload = async () => {
    if (!dlFile || !savedId) {
      if (!savedId) alert('Save the post first, then attach files.');
      return;
    }
    setUploading(true);
    try {
      const dl = await uploadsApi.uploadDownload(savedId, dlFile, dlLabel || dlFile.name);
      setDownloads(d => [...d, dl]);
      setDlFile(null);
      setDlLabel('');
      if (dlInputRef.current) dlInputRef.current.value = '';
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeDownload = async (dlId) => {
    if (!window.confirm('Remove this download?')) return;
    try {
      await uploadsApi.deleteDownload(dlId);
      setDownloads(d => d.filter(x => x.id !== dlId));
    } catch (err) {
      alert('Remove failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={save} noValidate>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/posts" className="p-2 rounded-xl text-gray-400 hover:text-white transition" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <FiArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-display font-black text-white">
              {isNew ? 'New Post' : 'Edit Post'}
            </h1>
            {savedId && (
              <a href={`/blog/${form.title}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-accent transition flex items-center gap-1 mt-0.5">
                <FiEye size={10} /> Preview
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={form.status}
            onChange={set('status')}
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#e8e8e8' }}
            className="px-3 py-2.5 rounded-xl text-sm font-semibold focus:outline-none transition"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all disabled:opacity-60"
          >
            <FiSave size={14} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Title */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              type="text"
              placeholder="Post Title *"
              value={form.title}
              onChange={set('title')}
              required
              className="w-full text-xl font-display font-black placeholder-gray-600 border-none outline-none resize-none bg-transparent" style={{ color: '#e8e8e8' }}
            />
          </div>

          {/* Excerpt */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Excerpt <span className="text-gray-600 font-normal">(shown on blog listing)</span>
            </label>
            <textarea
              placeholder="Brief summary of the post…"
              value={form.excerpt}
              onChange={set('excerpt')}
              rows={2}
              className="w-full text-sm placeholder-gray-600 border-none outline-none resize-none leading-relaxed bg-transparent" style={{ color: '#e8e8e8' }}
            />
          </div>

          {/* Content editor */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Toolbar onInsertImage={handleInsertImage} />
            <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={onInlineImageChange} />
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[360px] p-5 text-sm leading-relaxed focus:outline-none
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-5
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-3
                [&_p]:mb-3 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:text-xs [&_pre]:mb-3 [&_pre]:overflow-x-auto
                [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4"
              style={{ color: '#d0d0d0' }}
              aria-label="Post content"
              data-placeholder="Start writing your post…"
            />
            {uploading && (
              <div className="px-5 py-2 text-xs text-accent font-semibold flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                Uploading image…
              </div>
            )}
          </div>

          {/* Downloadable files */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FiDownload size={14} className="text-accent" /> Downloadable Files
            </h3>

            {/* Existing downloads */}
            {downloads.length > 0 && (
              <div className="space-y-2 mb-4">
                {downloads.map(dl => (
                  <div key={dl.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <FiDownload size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{dl.label}</p>
                      <p className="text-xs text-gray-500">{dl.file_name} {dl.file_size ? `· ${formatSize(dl.file_size)}` : ''}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDownload(dl.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/30 transition shrink-0"
                      aria-label="Remove download"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new download */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Button label (e.g. Download Speed Checklist PDF)"
                value={dlLabel}
                onChange={e => setDlLabel(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition placeholder-gray-600"
              />
              <div className="flex gap-3">
                <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-sm text-gray-500 hover:text-accent transition" style={{ border: '2px dashed rgba(255,255,255,0.12)' }}>
                  <FiUpload size={14} />
                  {dlFile ? dlFile.name : 'Choose file (PDF, ZIP, DOCX…)'}
                  <input type="file" ref={dlInputRef} className="hidden" onChange={e => setDlFile(e.target.files?.[0] || null)} />
                </label>
                <button
                  type="button"
                  onClick={attachDownload}
                  disabled={!dlFile || uploading}
                  className="px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition disabled:opacity-50"
                >
                  {uploading ? '…' : 'Attach'}
                </button>
              </div>
              {!savedId && (
                <p className="text-xs text-gray-600">Save the post first, then attach downloadable files.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* Category + Status */}
          <div className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-bold text-white">Post Settings</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={form.category_id}
                onChange={set('category_id')}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
              >
                <option value="">— Select category —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Visibility</label>
              <select
                value={form.status}
                onChange={set('status')}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
              >
                <option value="draft">Draft (not visible)</option>
                <option value="published">Published (live)</option>
              </select>
            </div>
          </div>

          {/* Cover image */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-bold text-white mb-3">Cover Image</h3>

            {(coverPreview || existingCover) && (
              <div className="mb-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <img
                  src={coverPreview || existingCover}
                  alt="Cover preview"
                  className="w-full h-36 object-cover"
                />
              </div>
            )}

            <label className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-sm text-gray-500 hover:text-accent transition" style={{ border: '2px dashed rgba(255,255,255,0.12)' }}>
              <FiImage size={14} />
              {coverFile ? coverFile.name : (existingCover ? 'Replace cover image' : 'Upload cover image')}
              <input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
            </label>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Image Alt Text <span className="text-gray-600">(SEO)</span>
              </label>
              <input
                type="text"
                placeholder="Describe the image…"
                value={form.cover_alt}
                onChange={set('cover_alt')}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-bold text-white">SEO</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Meta Title</label>
              <input
                type="text"
                placeholder="Leave blank to use post title"
                value={form.meta_title}
                onChange={set('meta_title')}
                maxLength={70}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
              />
              <p className="text-[10px] text-gray-600 mt-1">{form.meta_title.length}/70 chars</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Meta Description</label>
              <textarea
                placeholder="Leave blank to use excerpt"
                value={form.meta_desc}
                onChange={set('meta_desc')}
                rows={3}
                maxLength={160}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition resize-none"
              />
              <p className="text-[10px] text-gray-600">{form.meta_desc.length}/160 chars</p>
            </div>
          </div>

          {/* Save button (sticky) */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <FiSave size={15} /> {saving ? 'Saving…' : (form.status === 'published' ? 'Publish Post' : 'Save Draft')}
          </button>
        </div>
      </div>
    </form>
  );
}
