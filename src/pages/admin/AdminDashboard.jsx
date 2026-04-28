import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminPostsApi } from '../../lib/api';
import { FiFileText, FiPlusCircle, FiEye, FiEdit2 } from 'react-icons/fi';

export default function AdminDashboard() {
  const { admin }  = useAuth();
  const [posts,    setPosts]   = useState([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    adminPostsApi.all()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter(p => p.status === 'published').length;
  const drafts    = posts.filter(p => p.status === 'draft').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-black text-gray-900">
          Welcome back, {admin?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's an overview of your blog.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Posts',  value: posts.length,  color: '#7cb26e', icon: FiFileText   },
          { label: 'Published',    value: published,     color: '#21759b', icon: FiEye        },
          { label: 'Drafts',       value: drafts,        color: '#f97316', icon: FiEdit2      },
          { label: 'Categories',   value: 4,             color: '#96bf48', icon: FiFileText   },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl font-black text-gray-900">{loading ? '—' : value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all"
        >
          <FiPlusCircle size={16} /> New Post
        </Link>
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:border-accent/50 hover:text-accent transition-all"
        >
          <FiFileText size={16} /> Manage Posts
        </Link>
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:border-accent/50 hover:text-accent transition-all"
        >
          <FiEye size={16} /> View Blog
        </a>
      </div>

      {/* Recent posts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-display font-bold text-gray-900">Recent Posts</h2>
          <Link to="/admin/posts" className="text-xs font-semibold text-accent hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-400 text-sm">No posts yet.</p>
            <Link to="/admin/posts/new" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
              <FiPlusCircle size={14} /> Create your first post
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {post.category} · {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {post.status}
                  </span>
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition"
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
