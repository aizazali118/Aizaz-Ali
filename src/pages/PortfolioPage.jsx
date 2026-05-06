import PageWrapper from '../components/PageWrapper';
import Portfolio from '../components/Portfolio';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { SiFiverr, SiUpwork } from 'react-icons/si';

export default function PortfolioPage() {
  return (
    <PageWrapper
      title="Portfolio"
      description="Browse Aizaz Ali Afridi's portfolio — 50+ WordPress, Shopify and React projects delivered for clients worldwide. View case studies and live sites."
      canonical="/portfolio"
    >
      {/* Page hero */}
      <section className="pt-32 pb-8 bg-[#0a0a0a] text-center px-6" aria-labelledby="portfolio-page-heading">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">My Work</p>
        <h1 id="portfolio-page-heading" className="text-4xl md:text-6xl font-display font-black text-primary">
          Project <span className="gradient-text">Portfolio</span>
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto leading-relaxed">
          50+ projects completed. WordPress stores, Shopify e-commerce sites and React applications.
        </p>
        <nav className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Portfolio</span>
        </nav>
      </section>

      <Portfolio />

      {/* CTA strip */}
      <section className="py-16 bg-[#0a0a0a] text-center px-6">
        <h2 className="text-2xl md:text-3xl font-display font-black text-primary mb-4">
          Like what you see?
        </h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Hire me on Fiverr or Upwork, or contact me directly to discuss your project.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://www.fiverr.com/s/dDa9lqa"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/30 hover:bg-accent/90 hover:scale-105 transition-all"
          >
            <SiFiverr size={14} /> Hire on Fiverr
          </a>
          <a
            href="https://www.upwork.com/freelancers/~01db2b03b5a7f36be8"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-accent/40 text-accent font-bold text-sm hover:bg-accent hover:text-white hover:scale-105 transition-all"
          >
            <SiUpwork size={14} /> Hire on Upwork
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-accent/40 text-accent font-bold text-sm hover:bg-accent hover:text-white transition-all"
          >
            Direct Contact <FiArrowRight />
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
