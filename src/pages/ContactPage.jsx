import PageWrapper from '../components/PageWrapper';
import Contact from '../components/Contact';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  return (
    <PageWrapper
      title="Contact"
      description="Get in touch with Aizaz Ali Afridi — freelance WordPress, Shopify & React developer. Available for projects worldwide. Reply within 24 hours."
      canonical="/contact"
    >
      {/* Schema for ContactPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Aizaz Ali Afridi',
        url: 'https://aizazaliafridi.com/contact',
        description: 'Get in touch with Aizaz Ali Afridi for freelance web development projects.',
      })}} />

      {/* Breadcrumb only — Contact component has its own heading */}
      <div className="pt-28 pb-2 bg-[#0d0d0d] text-center px-6">
        <nav className="flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Contact</span>
        </nav>
      </div>

      <Contact />
    </PageWrapper>
  );
}
