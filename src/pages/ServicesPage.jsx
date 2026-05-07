import PageWrapper from '../components/PageWrapper';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function ServicesPage() {
  return (
    <PageWrapper
      title="Services"
      description="WordPress development, Shopify development, React/Next.js apps, UI/UX design, SEO optimisation and custom software. Fixed-price packages with fast delivery."
      canonical="/services"
    >
      {/* Hero */}
      <section className="pt-32 pb-14 text-center px-6" style={{ background: '#0a0a0a' }}>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">What I Offer</p>
        <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight">
          My <span className="gradient-text">Services</span>
        </h1>
        <p className="mt-5 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Custom WordPress, Shopify, React and UI/UX solutions built to perform.
          Fast delivery, clear communication, and results that matter to your business.
        </p>
        <nav className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Services</span>
        </nav>
      </section>

      <Services showHeading={false} variant="grid" />
      <Pricing />

      {/* CTA */}
      <section className="py-16 bg-[#0a0a0a] text-center px-6">
        <h2 className="text-2xl md:text-3xl font-display font-black text-white mb-4">Need a custom quote?</h2>
        <p className="mb-6 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Every project is different. Get in touch and I'll give you a tailored estimate within 24 hours.
        </p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 transition-all">
          Get a Free Quote <FiArrowRight />
        </Link>
      </section>
    </PageWrapper>
  );
}
