import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiCalendar, FiTag, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import { postsApi } from '../lib/api';

const API_BASE  = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://aizazaliafridi.com';
const ACCENT    = '#7cb26e';
const PER_PAGE  = 20;

function PostCard({ post, index }) {
  const coverSrc = post.cover_image
    ? (post.cover_image.startsWith('http') ? post.cover_image : `${API_BASE}${post.cover_image}`)
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      itemScope itemType="https://schema.org/BlogPosting"
    >
      {coverSrc ? (
        <Link to={`/blog/${post.slug}`} className="block h-40 overflow-hidden shrink-0">
          <img
            src={coverSrc}
            alt={post.cover_alt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            itemProp="image"
          />
        </Link>
      ) : (
        <div className="h-1.5 shrink-0" style={{ background: ACCENT }} />
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {post.category && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: `${ACCENT}18`, color: ACCENT }}
            >
              <FiTag size={9} /> {post.category}
            </span>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <FiCalendar size={10} />
              <time dateTime={post.published_at} itemProp="datePublished">
                {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </time>
            </span>
          )}
          {post.read_time && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <FiClock size={10} /> {post.read_time}
            </span>
          )}
        </div>

        <h2 className="text-sm font-display font-bold text-white mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2" itemProp="headline">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {post.excerpt && (
          <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }} itemProp="description">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:gap-2 transition-all"
            aria-label={`Read: ${post.title}`}
          >
            Read More <FiArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogPage() {
  const [allPosts,   setAllPosts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter,     setFilter]     = useState('All');
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    Promise.all([
      postsApi.list({ limit: 200 }),
      postsApi.categories(),
    ])
      .then(([res, cats]) => {
        const list = Array.isArray(res) ? res : res.posts || [];
        setAllPosts(list);
        setCategories(cats);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* Reset page when filter/search changes */
  useEffect(() => { setPage(1); }, [filter, search]);

  const filtered = allPosts
    .filter(p => filter === 'All' || p.category === filter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <PageWrapper
      title="Blog"
      description="Free WordPress, Shopify & React guides, checklists and tutorials by Aizaz Ali Afridi. Download free resources included in many posts."
      canonical="/blog"
    >
      {/* Hero */}
      <section className="pt-32 pb-12 text-center px-6" style={{ background: '#0a0a0a' }}>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">Resources & Insights</p>
        <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight">
          My <span className="gradient-text">Blog</span>
        </h1>
        <p className="mt-5 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Practical guides on WordPress, Shopify and React — with free downloadable resources in many articles.
        </p>
        <nav className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Blog</span>
        </nav>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24" style={{ background: '#0a0a0a' }}>
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
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
            {['All', ...categories.map(c => c.name)].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === cat ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'hover:text-accent'}`}
                style={filter !== cat ? { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-40" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="p-4 space-y-3">
                  <div className="h-3 rounded w-24" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-4 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-3 rounded w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Could not load posts. Make sure the API is running.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center py-20" style={{ color: 'rgba(255,255,255,0.4)' }}>No articles found.</p>
        )}

        {/* 4-col grid */}
        {!loading && !error && paginated.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:border-accent hover:text-accent disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className="w-9 h-9 rounded-full text-sm font-bold transition-all"
                      style={{
                        background: n === page ? ACCENT : 'rgba(255,255,255,0.05)',
                        color: n === page ? '#fff' : 'rgba(255,255,255,0.5)',
                        border: n === page ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}
                      aria-current={n === page ? 'page' : undefined}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:border-accent hover:text-accent disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
                  aria-label="Next page"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Results count */}
            <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} articles
            </p>
          </>
        )}
      </div>
    </PageWrapper>
  );
}