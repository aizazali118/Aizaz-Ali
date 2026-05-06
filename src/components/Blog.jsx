import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiClock, FiCalendar, FiTag } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

/* ── Sample blog posts (replace with Supabase API calls in production) ── */
const posts = [
  {
    slug: 'how-to-speed-up-wordpress-site',
    title: 'How to Speed Up Your WordPress Site in 2025',
    excerpt: 'A step-by-step guide covering caching, image optimisation, CDN setup and Core Web Vitals improvements that cut load times by 70%.',
    category: 'WordPress',
    date: '2025-04-10',
    readTime: '8 min read',
    cover: null,
    download: {
      label: 'Download WordPress Speed Checklist (PDF)',
      url: '/downloads/wordpress-speed-checklist.pdf',
    },
  },
  {
    slug: 'shopify-conversion-rate-optimization',
    title: 'Shopify CRO: 12 Tweaks That Boosted My Client\'s Sales by 40%',
    excerpt: 'Real case study covering product page layout, trust signals, upsells and checkout flow optimisation for a UK health store.',
    category: 'Shopify',
    date: '2025-03-22',
    readTime: '10 min read',
    cover: null,
    download: {
      label: 'Download Shopify CRO Checklist (PDF)',
      url: '/downloads/shopify-cro-checklist.pdf',
    },
  },
  {
    slug: 'react-performance-tips',
    title: 'React Performance Tips Every Freelancer Should Know',
    excerpt: 'Memoisation, code splitting, lazy loading, and virtual scrolling techniques that keep your React apps lightning fast.',
    category: 'React',
    date: '2025-02-14',
    readTime: '7 min read',
    cover: null,
    download: null,
  },
  {
    slug: 'freelance-web-dev-toolkit',
    title: 'My 2025 Freelance Web Dev Toolkit — Tools I Use Every Day',
    excerpt: 'From project management to design handoffs, here are the exact tools and workflows I use to deliver projects on time and on budget.',
    category: 'Freelancing',
    date: '2025-01-30',
    readTime: '6 min read',
    cover: null,
    download: {
      label: 'Download My Full Toolkit List (PDF)',
      url: '/downloads/freelance-toolkit-2025.pdf',
    },
  },
];

const categoryColors = {
  WordPress:   '#7cb26e',
  Shopify:     '#7cb26e',
  React:       '#7cb26e',
  Freelancing: '#7cb26e',
};

function PostCard({ post, index }) {
  const catColor = categoryColors[post.category] || '#7cb26e';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      {/* Category colour bar */}
      <div className="h-1.5" style={{ background: catColor }} />

      <div className="p-6">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: `${catColor}18`, color: catColor }}
          >
            <FiTag size={10} /> {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <FiCalendar size={11} />
            <time dateTime={post.date} itemProp="datePublished">
              {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <FiClock size={11} /> {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-display font-bold text-white mb-2 leading-snug group-hover:text-accent transition-colors"
          itemProp="headline"
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }} itemProp="description">
          {post.excerpt}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:gap-3 transition-all duration-200"
            aria-label={`Read: ${post.title}`}
          >
            Read More <FiArrowRight size={14} />
          </Link>

          {post.download && (
            <a
              href={post.download.url}
              download
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-200"
              aria-label={post.download.label}
            >
              <FiDownload size={12} /> Free Download
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog({ standalone = false }) {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const [filter,   setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const filtered   = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
        y: 60, opacity: 0, duration: 0.9, ease: 'power4.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className={`py-24 ${standalone ? '' : ''}`}
      style={{ background: '#0d0d0d' }}
      aria-labelledby="blog-heading"
    >
      {standalone && (
        <Helmet>
          <title>Blog — Aizaz Ali Afridi | WordPress, Shopify & React Tips</title>
          <meta name="description" content="Free guides, checklists and tutorials on WordPress, Shopify and React development by Aizaz Ali Afridi." />
          <link rel="canonical" href="https://aizazaliafridi.com/blog" />
        </Helmet>
      )}

      <div className="max-w-6xl mx-auto px-6">

        {/* Section heading */}
        <div ref={headRef} className="text-center mb-12">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Resources & Insights</p>
          <h2 id="blog-heading" className="text-4xl md:text-5xl font-display font-black text-white">
            Latest <span className="gradient-text">Articles</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Free tutorials, checklists and case studies on WordPress, Shopify, and React development.
            Some posts include downloadable resources.
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10" role="group" aria-label="Filter blog by category">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'hover:text-accent'
              }`}
              style={filter !== cat ? { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
              aria-pressed={filter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
          {filtered.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {/* View all CTA (only on homepage section) */}
        {!standalone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              View All Articles <FiArrowRight />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
