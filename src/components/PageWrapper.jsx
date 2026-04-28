import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function PageWrapper({ title, description, canonical, children, className = '' }) {
  const fullTitle = title
    ? `${title} — Aizaz Ali Afridi`
    : 'Aizaz Ali Afridi | Freelance WordPress, Shopify & React Developer';

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        {description && <meta name="description" content={description} />}
        {canonical  && <link rel="canonical" href={`https://aizazaliafridi.com${canonical}`} />}
        <meta property="og:title" content={fullTitle} />
        {description && <meta property="og:description" content={description} />}
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </>
  );
}
