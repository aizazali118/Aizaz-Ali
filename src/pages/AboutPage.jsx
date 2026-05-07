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
      {/* Breadcrumb only — About component has its own heading */}
      <div className="pt-28 pb-2 bg-[#0a0a0a] text-center px-6">
        <nav className="flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">About</span>
        </nav>
      </div>

      {/* Reuse the existing About section (already has all content + animations) */}
      <About />

      {/* CTA strip */}
      <section className="py-16 bg-[#0a0a0a] text-center px-6">
        <h2 className="text-2xl md:text-3xl font-display font-black text-white mb-4">
          Ready to work together?
        </h2>
        <p className="mb-6 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
