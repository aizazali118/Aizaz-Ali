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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Aizaz Ali Afridi',
        url: 'https://aizazaliafridi.com/contact',
        description: 'Get in touch with Aizaz Ali Afridi for freelance web development projects.',
      })}} />

      {/* Hero */}
      <section className="pt-32 pb-14 text-center px-6" style={{ background: '#0d0d0d' }}>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">Let's Talk</p>
        <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight">
          Get In <span className="gradient-text">Touch</span>
        </h1>
        <p className="mt-5 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Have a project in mind? I'd love to hear about it.
          I reply within 24 hours and offer a free consultation on every new project.
        </p>
        <nav className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-accent font-semibold">Contact</span>
        </nav>
      </section>

      <Contact showHeading={false} />
    </PageWrapper>
  );
}
