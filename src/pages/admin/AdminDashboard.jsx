import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminPostsApi } from '../../lib/api';
import { FiFileText, FiPlusCircle, FiEye, FiEdit2, FiGrid, FiStar, FiLayers } from 'react-icons/fi';

const D = {
  card:   'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  text:   '#ffffff',
  muted:  'rgba(255,255,255,0.45)',
  dim:    'rgba(255,255,255,0.25)',
};

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminPostsApi.all()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter(p => p.status === 'published').length;
  const drafts    = posts.filter(p => p.status === 'draft').length;

  const stats = [
    { label: 'Total Posts',   value: posts.length, color: '#7cb26e', icon: FiFileText },
    { label: 'Published',     value: published,     color: '#7cb26e', icon: FiEye     },
    { label: 'Drafts',        value: drafts,        color: '#7cb26e', icon: FiEdit2   },
    { label: 'Categories',    value: 4,             color: '#7cb26e', icon: FiFileText},
  ];

  const quickLinks = [
    { to: '/admin/posts/new',    icon: FiPlusCircle, label: 'New Post',      primary: true  },
    { to: '/admin/posts',        icon: FiFileText,   label: 'All Posts',     primary: false },
    { to: '/admin/portfolio',    icon: FiGrid,       label: 'Portfolio',     primary: false },
    { to: '/admin/services',     icon: FiLayers,     label: 'Services',      primary: false },
    { to: '/admin/testimonials', icon: FiStar,       label: 'Testimonials',  primary: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-black text-white">
          Welcome back, {admin?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: D.muted }}>Here's an overview of your site.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-5 border" style={{ background: D.card, borderColor: D.border }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl font-black text-white">{loading ? '—' : value}</p>
            <p className="text-xs mt-0.5" style={{ color: D.muted }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {quickLinks.map(({ to, icon: Icon, label, primary }) => (
          <Link
            key={to}
            to={to}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              primary
                ? 'bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent/90'
                : 'border hover:border-accent/40 hover:text-accent'
            }`}
            style={primary ? {} : { background: D.card, borderColor: D.border, color: D.muted }}
          >
            <Icon size={15} /> {label}
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: D.card, borderColor: D.border }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${D.border}` }}>
          <h2 className="font-display font-bold text-white">Recent Posts</h2>
          <Link to="/admin/posts" className="text-xs font-semibold text-accent hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm" style={{ color: D.muted }}>No posts yet.</p>
            <Link to="/admin/posts/new" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
              <FiPlusCircle size={14} /> Create your first post
            </Link>
          </div>
        ) : (
          <div>
            {posts.slice(0, 6).map((post, i) => (
              <div
                key={post.id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.03]"
                style={i < posts.slice(0,6).length - 1 ? { borderBottom: `1px solid ${D.border}` } : {}}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{post.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: D.dim }}>
                    {post.category} · {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    post.status === 'published'
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-orange-500/15 text-orange-400'
                  }`}>
                    {post.status}
                  </span>
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="p-1.5 rounded-lg text-white/30 hover:text-accent hover:bg-accent/10 transition"
                    aria-label="Edit post"
                  >
                    <FiEdit2 size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
