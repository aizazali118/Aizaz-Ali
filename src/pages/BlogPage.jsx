import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiClock, FiCalendar, FiTag, FiSearch } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import { postsApi } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function PostCard({ post, index }) {
  const catColor = post.category_color || '#7cb26e';
  const coverSrc = post.cover_image
    ? (post.cover_image.startsWith('http') ? post.cover_image : `${API_BASE}${post.cover_image}`)
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      itemScope itemType="https://schema.org/BlogPosting"
    >
      {/* Cover image */}
      {coverSrc ? (
        <Link to={`/blog/${post.slug}`} aria-label={`Read: ${post.title}`}>
          <div className="h-48 overflow-hidden">
            <img
              src={coverSrc}
              alt={post.cover_alt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              itemProp="image"
            />
          </div>
        </Link>
      ) : (
        <div className="h-2" style={{ background: catColor }} />
      )}

      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: `${catColor}18`, color: catColor }}
          >
            <FiTag size={10} /> {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiCalendar size={11} />
            <time dateTime={post.published_at} itemProp="datePublished">
              {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
          </span>
          {post.read_time && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiClock size={11} /> {post.read_time}
            </span>
          )}
        </div>

        <h2 className="text-lg font-display font-bold text-white mb-2 leading-snug group-hover:text-accent transition-colors" itemProp="headline">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {post.excerpt && (
          <p className="text-sm text-gray-400 leading-relaxed mb-4" itemProp="description">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:gap-3 transition-all"
          >
            Read More <FiArrowRight size={14} />
          </Link>
          {post.downloads?.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <FiDownload size={11} /> {post.downloads.length} download{post.downloads.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogPage() {
  const [posts,      setPosts]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter,     setFilter]     = useState('All');
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    Promise.all([
      postsApi.list({ limit: 50 }),
      postsApi.categories(),
    ])
      .then(([{ posts }, cats]) => {
        setPosts(posts);
        setCategories(cats);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts
    .filter(p => filter === 'All' || p.category === filter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageWrapper
      title="Blog"
      description="Free WordPress, Shopify & React guides, checklists and tutorials by Aizaz Ali Afridi. Download free resources included in many posts."
      canonical="/blog"
    >
      {/* Page hero */}
      <section className="pt-32 pb-12 text-center px-6" style={{ background: '#0a0a0a' }} aria-labelledby="blog-page-heading">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Resources & Insights</p>
        <h1 id="blog-page-heading" className="text-4xl md:text-6xl font-display font-black text-primary">
          Dev <span className="gradient-text">Blog</span>
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto leading-relaxed">
          Practical guides on WordPress, Shopify and React — with free downloadable resources in many articles.
        </p>
        <nav className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Blog</span>
        </nav>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24" style={{ background: '#0a0a0a' }}>
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none transition"
              aria-label="Search blog posts"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'All' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'text-gray-500 hover:text-accent'}`}
              style={filter !== 'All' ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
              aria-pressed={filter === 'All'}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === cat.name ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'text-gray-500 hover:text-accent'}`}
                style={filter !== cat.name ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
                aria-pressed={filter === cat.name}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-48" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="p-6 space-y-3">
                  <div className="h-3 rounded w-24" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-5 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-3 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">Could not load posts. Make sure the API server is running.</p>
            <p className="text-xs text-gray-600 mt-1 font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-20">No articles found.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
