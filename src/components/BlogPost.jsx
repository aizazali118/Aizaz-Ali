import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiClock, FiCalendar, FiTag } from 'react-icons/fi';

/* ── In production replace this with a Supabase/API fetch by slug ── */
const posts = {
  'how-to-speed-up-wordpress-site': {
    slug: 'how-to-speed-up-wordpress-site',
    title: 'How to Speed Up Your WordPress Site in 2025',
    category: 'WordPress',
    date: '2025-04-10',
    readTime: '8 min read',
    excerpt: 'A step-by-step guide covering caching, image optimisation, CDN setup and Core Web Vitals improvements that cut load times by 70%.',
    download: {
      label: 'Download WordPress Speed Checklist (PDF)',
      url: '/downloads/wordpress-speed-checklist.pdf',
    },
    content: `
WordPress speed is one of the biggest factors affecting your SEO rankings and conversion rates.
In this guide, I'll walk you through the exact steps I use to get WordPress sites scoring 90+ on Google PageSpeed Insights.

## 1. Choose a Fast Hosting Provider
Shared hosting kills performance. Move to LiteSpeed or NVMe SSD-based hosts like Cloudways, Kinsta, or Hostinger Business.

## 2. Install a Caching Plugin
LiteSpeed Cache (free) or WP Rocket (paid) are the best options. Enable page cache, browser cache, and object cache.

## 3. Optimise Images
Use WebP format. Plugins like ShortPixel or Imagify auto-convert and compress on upload.

## 4. Use a CDN
Cloudflare's free tier is excellent. It serves static assets from edge nodes worldwide, reducing TTFB dramatically.

## 5. Minify CSS, JS and HTML
WP Rocket or LiteSpeed Cache can minify and combine files. Be careful with JS defer/async — test after each change.

## 6. Reduce Plugin Count
Audit your plugins. Every active plugin adds PHP execution overhead. Aim for fewer than 15.

## 7. Use a Lightweight Theme
GeneratePress, Astra, or Blocksy are all under 50 KB. Avoid page-builder-heavy themes.

Download the checklist below to track your optimisations systematically.
    `,
  },
  'shopify-conversion-rate-optimization': {
    slug: 'shopify-conversion-rate-optimization',
    title: 'Shopify CRO: 12 Tweaks That Boosted My Client\'s Sales by 40%',
    category: 'Shopify',
    date: '2025-03-22',
    readTime: '10 min read',
    excerpt: 'Real case study covering product page layout, trust signals, upsells and checkout flow optimisation for a UK health store.',
    download: {
      label: 'Download Shopify CRO Checklist (PDF)',
      url: '/downloads/shopify-cro-checklist.pdf',
    },
    content: `
This is a real case study from a UK health and wellness Shopify store I rebuilt in early 2025. Revenue increased 40% in 3 months.

## The Starting Point
The store had decent traffic (5k/month) but a 1.2% conversion rate. Industry average is 2.5–3%. There was money being left on the table.

## Key Changes Made

### 1. Product Page Above-the-Fold Redesign
We moved the Add-to-Cart button above the fold on mobile. Simple change, 15% lift.

### 2. Trust Signals
Added review stars, "Free UK delivery over £30" badge, and a 30-day guarantee seal.

### 3. Sticky Add-to-Cart Bar
On scroll, a sticky bar appears with the product name, rating and ATC button.

### 4. Upsell / Cross-sell
Using ReConvert for post-purchase upsells and a "You may also like" section.

### 5. Checkout Improvements
Removed account login requirement, added PayPal Express and Klarna.

### 6. Page Speed
Lazy loaded images, removed unused apps, compressed all product photos.

Download the full checklist to apply these to your own store.
    `,
  },
};

const categoryColors = {
  WordPress:   '#21759b',
  Shopify:     '#96bf48',
  React:       '#7cb26e',
  Freelancing: '#f97316',
};

function MarkdownContent({ content }) {
  const lines = content.trim().split('\n');
  const elements = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { elements.push(<br key={key++} />); continue; }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-2xl font-display font-bold text-primary mt-8 mb-3">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-lg font-display font-bold text-primary mt-6 mb-2">{trimmed.slice(4)}</h3>);
    } else {
      elements.push(<p key={key++} className="text-gray-600 leading-relaxed mb-3">{trimmed}</p>);
    }
  }
  return <>{elements}</>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts[slug];

  if (!post) return <Navigate to="/blog" replace />;

  const catColor = categoryColors[post.category] || '#7cb26e';
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
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
        <title>{post.title} — Aizaz Ali Afridi</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://aizazaliafridi.com/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <article
        className="max-w-3xl mx-auto px-6 py-12"
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-accent transition-colors mb-8"
          >
            <FiArrowLeft size={14} /> Back to Blog
          </Link>
        </motion.div>

        {/* Category + meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-4"
        >
          <span
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ background: `${catColor}18`, color: catColor }}
          >
            <FiTag size={10} /> {post.category}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <FiCalendar size={12} />
            <time dateTime={post.date} itemProp="datePublished">
              {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <FiClock size={12} /> {post.readTime}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-display font-black text-primary leading-tight mb-4"
          itemProp="headline"
        >
          {post.title}
        </motion.h1>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100"
          itemProp="author"
          itemScope
          itemType="https://schema.org/Person"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center">
            <img src="/profile.png" alt="Aizaz Ali Afridi" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary" itemProp="name">Aizaz Ali Afridi</p>
            <p className="text-xs text-gray-400">WordPress · Shopify · React Developer</p>
          </div>
        </motion.div>

        {/* Download CTA (top) */}
        {post.download && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-8 p-4 rounded-2xl border-2 border-accent/20 bg-accent/5 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">Free Resource</p>
              <p className="text-xs text-gray-500 mt-0.5">{post.download.label}</p>
            </div>
            <a
              href={post.download.url}
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-white text-xs font-bold shadow-lg shadow-accent/30 hover:bg-accent/90 transition-all shrink-0"
              aria-label={`Download: ${post.download.label}`}
            >
              <FiDownload size={13} /> Download Free
            </a>
          </motion.div>
        )}

        {/* Article body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          itemProp="articleBody"
        >
          <MarkdownContent content={post.content} />
        </motion.div>

        {/* Download CTA (bottom) */}
        {post.download && (
          <div className="mt-10 p-5 rounded-2xl border border-accent/20 bg-accent/5 text-center">
            <p className="text-sm font-bold text-primary mb-1">Get the free resource</p>
            <p className="text-xs text-gray-500 mb-3">{post.download.label}</p>
            <a
              href={post.download.url}
              download
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-white text-sm font-bold shadow-lg shadow-accent/30 hover:bg-accent/90 transition-all"
            >
              <FiDownload size={14} /> Download for Free
            </a>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-4 transition-all">
            <FiArrowLeft size={14} /> More Articles
          </Link>
        </div>
      </article>
    </>
  );
}
