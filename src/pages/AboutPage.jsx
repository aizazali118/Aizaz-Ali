import PageWrapper from '../components/PageWrapper';
import About from '../components/About';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <PageWrapper
      title="About Me"
      description="Aizaz Ali Afridi — Freelance WordPress, Shopify & React Developer with 3+ years experience. 50+ projects delivered to clients worldwide from Islamabad, Pakistan."
      canonical="/about"
    >
      {/* Page hero */}
      <section className="pt-32 pb-8 bg-white text-center px-6" aria-labelledby="about-page-heading">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Get to Know Me</p>
        <h1 id="about-page-heading" className="text-4xl md:text-6xl font-display font-black text-primary">
          About <span className="gradient-text">Aizaz Ali Afridi</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
          Freelance WordPress, Shopify &amp; React Developer — building fast, beautiful websites for clients worldwide.
        </p>
        {/* Breadcrumb */}
        <nav className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">About</span>
        </nav>
      </section>

      {/* Reuse the existing About section (already has all content + animations) */}
      <About />

      {/* CTA strip */}
      <section className="py-16 bg-white text-center px-6">
        <h2 className="text-2xl md:text-3xl font-display font-black text-primary mb-4">
          Ready to work together?
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          I'm available for freelance projects worldwide. Let's build something great.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 transition-all"
          >
            Hire Me <FiArrowRight />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-accent/40 text-accent font-bold text-sm hover:bg-accent hover:text-white transition-all"
          >
            View Services
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
