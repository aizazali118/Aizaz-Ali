import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiClock, FiCalendar, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { postsApi } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://aizazaliafridi.com';
const ACCENT   = '#7cb26e';
const PER_PAGE = 3;

function BlogCard({ post }) {
  const coverSrc = post.cover_image
    ? (post.cover_image.startsWith('http') ? post.cover_image : `${API_BASE}${post.cover_image}`)
    : null;

  return (
    <article
      className="group rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {coverSrc ? (
        <Link to={`/blog/${post.slug}`} className="block h-44 overflow-hidden shrink-0">
          <img src={coverSrc} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </Link>
      ) : (
        <div className="h-1.5 shrink-0" style={{ background: ACCENT }} />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.category && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: `${ACCENT}18`, color: ACCENT }}>
              <FiTag size={9} /> {post.category}
            </span>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <FiCalendar size={10} />
              {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
          {post.read_time && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <FiClock size={10} /> {post.read_time}
            </span>
          )}
        </div>

        <h3 className="text-base font-display font-bold text-white mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <Link to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:gap-3 transition-all duration-200">
            Read More <FiArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Blog() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(0);

  useEffect(() => {
    postsApi.list({ limit: 9, status: 'published' })
      .then(res => setPosts(Array.isArray(res) ? res : res.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(posts.length / PER_PAGE);
  const visible    = posts.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

  return (
    <section id="blog" className="py-24" style={{ background: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Resources & Insights</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            Latest <span className="gradient-text">Articles</span>
          </h2>
          <p className="mt-3 text-sm max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Practical guides on WordPress, Shopify and React development
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl animate-pulse overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-44" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div className="p-5 space-y-3">
                  <div className="h-3 rounded w-24" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-5 rounded w-4/5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-3 rounded w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>No articles published yet.</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && posts.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                className="grid md:grid-cols-3 gap-6"
              >
                {visible.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={prev}
                  disabled={page === 0}
                  className="w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:border-accent hover:text-accent disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
                  aria-label="Previous"
                >
                  <FiChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span className="text-white">{page + 1}</span>
                  <span className="mx-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
                  {totalPages}
                </span>
                <button
                  onClick={next}
                  disabled={page === totalPages - 1}
                  className="w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:border-accent hover:text-accent disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
                  aria-label="Next"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}

            {/* View all CTA */}
            <div className="mt-10 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 transition-all"
              >
                View All Articles <FiArrowRight />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}