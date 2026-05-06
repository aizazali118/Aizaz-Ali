import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminPostsApi } from '../../lib/api';
import { FiEdit2, FiTrash2, FiPlusCircle, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';

export default function AdminPosts() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    adminPostsApi.all()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeleting(post.id);
    try {
      await adminPostsApi.delete(post.id);
      setPosts(ps => ps.filter(p => p.id !== post.id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white">All Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} total · {posts.filter(p=>p.status==='published').length} published</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all"
        >
          <FiPlusCircle size={16} /> New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input
          type="search"
          placeholder="Search posts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
          className="w-full max-w-sm pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 text-sm">{search ? 'No posts match your search.' : 'No posts yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left px-6 py-3 font-semibold">Title</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                  <th className="text-right px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} className="transition group" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white leading-snug line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 font-mono truncate max-w-xs">/blog/{post.slug}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {post.category && (
                        <span
                          className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(124,178,110,0.12)', color: '#7cb26e' }}
                        >
                          {post.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-orange-900/40 text-orange-400'
                      }`}>
                        {post.status === 'published' ? <FiEye size={10} /> : <FiEyeOff size={10} />}
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {post.status === 'published' && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition"
                            aria-label="View post"
                          >
                            <FiEye size={14} />
                          </a>
                        )}
                        <Link
                          to={`/admin/posts/${post.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition"
                          aria-label="Edit post"
                        >
                          <FiEdit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post)}
                          disabled={deleting === post.id}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/30 transition disabled:opacity-50"
                          aria-label="Delete post"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
