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

      {/* Page hero */}
      <section className="pt-32 pb-8 bg-[#0a0a0a] text-center px-6" aria-labelledby="contact-page-heading">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Let's Talk</p>
        <h1 id="contact-page-heading" className="text-4xl md:text-6xl font-display font-black text-primary">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto leading-relaxed">
          Have a project in mind? I reply to all enquiries within 24 hours.
        </p>
        <nav className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Contact</span>
        </nav>
      </section>

      <Contact />
    </PageWrapper>
  );
}
