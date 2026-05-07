import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiClock, FiCalendar, FiTag } from 'react-icons/fi';
import { postsApi } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BlogPostPage() {
  const { slug }    = useParams();
  const [post,      setPost]    = useState(null);
  const [loading,   setLoading] = useState(true);
  const [notFound,  setNotFound]= useState(false);

  useEffect(() => {
    setLoading(true);
    postsApi.getBySlug(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 animate-pulse space-y-4 pt-32" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <div className="h-4 rounded w-32" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-8 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-4 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
    );
  }

  if (notFound) return <Navigate to="/blog" replace />;
  if (!post) return null;

  const catColor = '#7cb26e';
  const coverSrc = post.cover_image
    ? (post.cover_image.startsWith('http') ? post.cover_image : `${API_BASE}${post.cover_image}`)
    : null;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_desc || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: coverSrc || undefined,
    author: {
      '@type': 'Person',
      name: 'Aizaz Ali Afridi',
      url: 'https://aizazaliafridi.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Aizaz Ali Afridi',
    },
  };

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} — Aizaz Ali Afridi</title>
        <meta name="description" content={post.meta_desc || post.excerpt || ''} />
        <link rel="canonical" href={`https://aizazaliafridi.com/blog/${post.slug}`} />
        {coverSrc && <meta property="og:image" content={coverSrc} />}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <motion.article
        className="max-w-3xl mx-auto px-6 pt-32 pb-24"
        style={{ minHeight: '100vh', background: '#0a0a0a' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        itemScope itemType="https://schema.org/BlogPosting"
      >
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent transition-colors mb-8"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <FiArrowLeft size={14} /> Back to Blog
        </Link>

        {/* Cover image */}
        {coverSrc && (
          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src={coverSrc}
              alt={post.cover_alt || post.title}
              className="w-full max-h-80 object-cover"
              itemProp="image"
            />
          </div>
        )}

        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.category && (
            <Link
              to={`/blog?category=${post.category_slug}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-opacity hover:opacity-80"
              style={{ background: `${catColor}18`, color: catColor }}
            >
              <FiTag size={10} /> {post.category}
            </Link>
          )}
          <span className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <FiCalendar size={12} />
            <time dateTime={post.published_at} itemProp="datePublished">
              {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          </span>
          {post.read_time && (
            <span className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <FiClock size={12} /> {post.read_time}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-display font-black text-white leading-tight mb-4"
          itemProp="headline"
        >
          {post.title}
        </h1>

        {/* Author */}
        <div
          className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10"
          itemProp="author" itemScope itemType="https://schema.org/Person"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <img src="/profile.png" alt="Aizaz Ali Afridi" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <p className="text-sm font-bold text-white" itemProp="name">Aizaz Ali Afridi</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>WordPress · Shopify · React Developer</p>
          </div>
        </div>

        {/* Download box (top) */}
        {post.downloads?.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl border-2 border-accent/20" style={{ background: 'rgba(124,178,110,0.07)' }}>
            <p className="text-sm font-bold text-white mb-3">Free Resources in This Post</p>
            <div className="space-y-2">
              {post.downloads.map(dl => (
                <a
                  key={dl.id}
                  href={`${API_BASE}${dl.file_path}`}
                  download={dl.file_name}
                  className="flex items-center gap-3 p-3 rounded-xl hover:border-accent/40 hover:shadow-sm transition-all group"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  aria-label={`Download: ${dl.label}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <FiDownload size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{dl.label}</p>
                    {dl.file_size && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{formatFileSize(dl.file_size)}</p>}
                  </div>
                  <span className="text-xs font-bold text-accent shrink-0">Download</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Article body (HTML from editor) */}
        <div
          className="prose prose-sm sm:prose max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-white
            prose-p:leading-relaxed
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-white/5 prose-pre:text-white/80
            prose-strong:text-white"
          style={{ '--tw-prose-body': 'rgba(255,255,255,0.6)', color: 'rgba(255,255,255,0.6)' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
          itemProp="articleBody"
        />

        {/* Download box (bottom) */}
        {post.downloads?.length > 0 && (
          <div className="mt-12 p-5 rounded-2xl border border-accent/20 text-center" style={{ background: 'rgba(124,178,110,0.07)' }}>
            <p className="text-sm font-bold text-white mb-1">Get the free resources</p>
            <div className="flex flex-wrap gap-3 justify-center mt-3">
              {post.downloads.map(dl => (
                <a
                  key={dl.id}
                  href={`${API_BASE}${dl.file_path}`}
                  download={dl.file_name}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-bold shadow-lg shadow-accent/30 hover:bg-accent/90 transition-all"
                >
                  <FiDownload size={14} /> {dl.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-4 transition-all">
            <FiArrowLeft size={14} /> More Articles
          </Link>
        </div>
      </motion.article>
    </>
  );
}
