import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  {
    name:    'Sarah K.',
    role:    'E-commerce Store Owner',
    country: '🇬🇧 United Kingdom',
    rating:  5,
    text:    'Aizaz built our WooCommerce store from scratch. The site is lightning fast, looks stunning, and our conversion rate has doubled since launch. Absolutely top-tier work!',
    avatar:  'SK',
  },
  {
    name:    'Mohammed A.',
    role:    'Shopify Merchant',
    country: '🇦🇪 UAE',
    rating:  5,
    text:    'He delivered our Shopify store ahead of schedule and nailed every design detail. The custom Liquid theme is exactly what we envisioned. Will definitely hire again.',
    avatar:  'MA',
  },
  {
    name:    'James P.',
    role:    'Marketing Director',
    country: '🇺🇸 United States',
    rating:  5,
    text:    'We needed a React landing page that converted. Aizaz delivered with amazing animations, perfect responsiveness, and Lighthouse scores in the high 90s. Exceptional!',
    avatar:  'JP',
  },
  {
    name:    'Lisa M.',
    role:    'Startup Founder',
    country: '🇨🇦 Canada',
    rating:  5,
    text:    'Our WordPress site was a mess before Aizaz. He redesigned everything, fixed the speed issues, and added features we didn\'t even know we needed. A total game changer.',
    avatar:  'LM',
  },
  {
    name:    'Robert T.',
    role:    'Agency Partner',
    country: '🇦🇺 Australia',
    rating:  5,
    text:    'I\'ve outsourced work to many developers. Aizaz stands out — clear communication, no revisions needed, and always delivers on time. My go-to WordPress developer!',
    avatar:  'RT',
  },
  {
    name:    'Ahmad F.',
    role:    'Business Owner',
    country: '🇸🇦 Saudi Arabia',
    rating:  5,
    text:    'The custom plugin he built for our Fiverr gig management saved us 10+ hours a week. Clean code, well-documented, and works flawlessly. Highly recommended!',
    avatar:  'AF',
  },
];

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <FiStar key={i} size={13} fill="#7cb26e" stroke="#7cb26e" />
      ))}
    </div>
  );
}

function Card({ t, active }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: active ? 1 : 0.5, scale: active ? 1 : 0.92 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl p-7 border flex flex-col gap-5 h-full"
      style={{
        background: active ? 'rgba(124,178,110,0.06)' : 'rgba(255,255,255,0.02)',
        borderColor: active ? 'rgba(124,178,110,0.3)' : 'rgba(255,255,255,0.07)',
        boxShadow: active ? '0 20px 60px rgba(124,178,110,0.12)' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <Stars n={t.rating} />
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.country}</span>
      </div>

      <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
        "{t.text}"
      </p>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#5a9a4a,#7cb26e)' }}
        >
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{t.name}</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = testimonials.length;
  const intervalRef = useRef(null);

  const next = () => setActive((a) => (a + 1) % total);
  const prev = () => setActive((a) => (a - 1 + total) % total);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 5000);
  };

  const handleNext = () => { next(); resetTimer(); };
  const handlePrev = () => { prev(); resetTimer(); };

  const visible = [
    (active - 1 + total) % total,
    active,
    (active + 1) % total,
  ];

  return (
    <section id="testimonials" className="py-24" style={{ background: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Client Reviews</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="mt-3 text-sm max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Real feedback from real projects
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </motion.div>

        {/* ── Desktop: 3-up ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {visible.map((idx, pos) => (
            <Card key={idx} t={testimonials[idx]} active={pos === 1} />
          ))}
        </div>

        {/* ── Mobile: single card ── */}
        <div className="md:hidden">
          <Card t={testimonials[active]} active />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(124,178,110,0.3)', color: '#7cb26e' }}
            aria-label="Previous"
          >
            <FiChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); resetTimer(); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  background: i === active ? '#7cb26e' : 'rgba(255,255,255,0.2)',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(124,178,110,0.3)', color: '#7cb26e' }}
            aria-label="Next"
          >
            <FiChevronRight size={18} />
          </button>
        </div>

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { val: '5.0★', label: 'Fiverr Rating' },
            { val: '100%', label: 'Job Success'   },
            { val: '40+',  label: 'Happy Clients' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black gradient-text">{val}</p>
              <p className="text-xs font-medium mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
