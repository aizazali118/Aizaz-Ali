import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWordpress, FaShopify, FaReact } from 'react-icons/fa';
import { FiCheck, FiArrowRight, FiZap } from 'react-icons/fi';

const categories = [
  { key: 'wordpress', label: 'WordPress',  Icon: FaWordpress,  color: '#7cb26e' },
  { key: 'shopify',   label: 'Shopify',    Icon: FaShopify,    color: '#7cb26e' },
  { key: 'frontend',  label: 'Frontend',   Icon: FaReact,      color: '#7cb26e' },
];

const plans = {
  wordpress: [
    {
      name: 'Starter',
      price: '$199',
      desc: 'Perfect for personal blogs, portfolios, and small informational websites.',
      features: [
        '3–5 Page Website',
        'Responsive Mobile Design',
        'Contact Form Setup',
        'Basic SEO Configuration',
        'Speed Optimisation',
        '1 Revision Round',
      ],
      cta: 'Get Started',
      highlight: false,
      badge: null,
    },
    {
      name: 'Professional',
      price: '$699',
      desc: 'Ideal for businesses needing a full site with e-commerce and advanced features.',
      features: [
        'Up to 10 Pages',
        'WooCommerce Store Setup',
        'Custom Design & Branding',
        'Plugin Integration',
        'On-Page SEO Setup',
        '1 Month Free Support',
        '3 Revision Rounds',
      ],
      cta: 'Most Popular',
      highlight: true,
      badge: 'Best Value',
    },
    {
      name: 'Enterprise',
      price: '$2,999',
      desc: 'Custom theme development and full e-commerce solution built from scratch.',
      features: [
        'Custom Theme Development',
        'Advanced WooCommerce',
        'Performance & Speed Audit',
        'Advanced Plugin Development',
        'Full SEO & Schema Markup',
        '3 Months Free Support',
        'Unlimited Revisions',
      ],
      cta: 'Contact Me',
      highlight: false,
      badge: null,
    },
  ],
  shopify: [
    {
      name: 'Starter',
      price: '$200',
      desc: 'Quick store setup with a professional theme and essential configuration.',
      features: [
        'Shopify Store Setup',
        'Up to 20 Products Upload',
        'Payment Gateway Integration',
        'Basic Theme Customisation',
        'Domain & Email Setup',
        '1 Revision Round',
      ],
      cta: 'Get Started',
      highlight: false,
      badge: null,
    },
    {
      name: 'Professional',
      price: '$499',
      desc: 'A fully customised Shopify store optimised to convert visitors into customers.',
      features: [
        'Custom Theme Design',
        'Unlimited Products',
        'Shopify App Integration',
        'Conversion Rate Optimisation',
        'SEO & Meta Setup',
        '1 Month Free Support',
        '3 Revision Rounds',
      ],
      cta: 'Most Popular',
      highlight: true,
      badge: 'Best Value',
    },
    {
      name: 'Enterprise',
      price: '$2,599',
      desc: 'Fully custom Liquid theme with advanced integrations and ongoing support.',
      features: [
        'Full Custom Liquid Theme',
        'Advanced App Integrations',
        'Store Migration',
        'Performance Tuning',
        'Analytics & Reporting Setup',
        '3 Months Free Support',
        'Unlimited Revisions',
      ],
      cta: 'Contact Me',
      highlight: false,
      badge: null,
    },
  ],
  frontend: [
    {
      name: 'Starter',
      price: '$500',
      desc: 'A beautiful, fast landing page built with React and Tailwind CSS.',
      features: [
        'Single Page React App',
        'Tailwind CSS Styling',
        'Responsive Design',
        'Basic Animations',
        'Contact Form',
        '1 Revision Round',
      ],
      cta: 'Get Started',
      highlight: false,
      badge: null,
    },
    {
      name: 'Professional',
      price: '$3,999',
      desc: 'Multi-page React application with advanced animations and API integration.',
      features: [
        'Multi-Page React App',
        'React Router Navigation',
        'GSAP & Framer Motion',
        'REST API Integration',
        'Tailwind + Custom CSS',
        '1 Month Free Support',
        '3 Revision Rounds',
      ],
      cta: 'Most Popular',
      highlight: true,
      badge: 'Best Value',
    },
    {
      name: 'Enterprise',
      price: '$5,699',
      desc: 'Full Next.js application with SSR, authentication, and database integration.',
      features: [
        'Next.js with SSR / SSG',
        'Authentication System',
        'Database Integration',
        'Admin Dashboard',
        'CI/CD Deployment Setup',
        '3 Months Free Support',
        'Unlimited Revisions',
      ],
      cta: 'Contact Me',
      highlight: false,
      badge: null,
    },
  ],
};

function PlanCard({ plan, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.33, 1, 0.68, 1] }}
      className="relative flex flex-col rounded-3xl p-7 border transition-all duration-300"
      style={plan.highlight
        ? { background: 'rgba(255,255,255,0.07)', border: `1px solid ${accent}50`, boxShadow: `0 20px 60px ${accent}28, 0 4px 20px ${accent}14`, transform: 'scale(1.03)' }
        : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Highlight top bar */}
      {plan.highlight && (
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
        />
      )}

      {/* Badge */}
      {plan.badge && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
        >
          {plan.badge}
        </span>
      )}

      {/* Plan name */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-white">{plan.name}</h3>
        {plan.highlight && (
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: accent + '15', color: accent }}
          >
            <FiZap size={10} /> Popular
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className="text-4xl font-black text-white">{plan.price}</span>
        <span className="text-sm ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>/ project</span>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>{plan.desc}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: accent + '18' }}
            >
              <FiCheck size={10} style={{ color: accent }} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full py-3 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
        style={
          plan.highlight
            ? { background: accent, color: '#fff', boxShadow: `0 8px 24px ${accent}40` }
            : { background: accent + '12', color: accent }
        }
      >
        {plan.highlight ? plan.cta : plan.cta}
        <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}

export default function Pricing() {
  const [active, setActive] = useState('wordpress');
  const cat = categories.find((c) => c.key === active);

  return (
    <section id="pricing" style={{ background: '#0d0d0d', padding: '100px 0' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="text-center mb-12"
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Transparent Pricing</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            Simple <span className="gradient-text">Pricing Plans</span>
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Clear, honest pricing for every budget. Choose the plan that fits your needs.
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </motion.div>

        {/* ── Category Tabs ── */}
        <div className="flex justify-center mb-10 px-5">
          <div className="grid grid-cols-3 w-full max-w-sm rounded-2xl p-1.5 gap-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {categories.map(({ key, label, Icon, color }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  active === key ? 'text-white shadow-lg' : 'hover:text-white'
                }`}
                style={active === key ? { background: color } : { color: 'rgba(255,255,255,0.45)' }}
              >
                <Icon size={16} />
                <span className="text-[11px] sm:text-sm leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Plan Cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-3 gap-6 items-center"
          >
            {plans[active].map((plan, i) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                accent={cat.color}
                delay={i * 0.1}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Custom quote note ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-block rounded-2xl px-8 py-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Need something custom?{' '}
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-bold text-accent hover:underline inline-flex items-center gap-1"
              >
                Let's talk <FiArrowRight size={13} />
              </button>
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>All prices are starting rates — final quote depends on project scope.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
