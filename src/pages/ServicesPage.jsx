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
      {/* Page hero */}
      <section className="pt-32 pb-8 bg-[#0a0a0a] text-center px-6" aria-labelledby="services-page-heading">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">What I Offer</p>
        <h1 id="services-page-heading" className="text-4xl md:text-6xl font-display font-black text-primary">
          Web Development <span className="gradient-text">Services</span>
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto leading-relaxed">
          From WordPress blogs to full Shopify stores and custom React apps — everything built to perform.
        </p>
        <nav className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Services</span>
        </nav>
      </section>

      <Services />
      <Pricing />

      {/* CTA */}
      <section className="py-16 bg-[#0a0a0a] text-center px-6">
        <h2 className="text-2xl md:text-3xl font-display font-black text-primary mb-4">
          Need a custom quote?
        </h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Every project is different. Get in touch and I'll give you a tailored estimate within 24 hours.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 transition-all"
        >
          Get a Free Quote <FiArrowRight />
        </Link>
      </section>
    </PageWrapper>
  );
}
