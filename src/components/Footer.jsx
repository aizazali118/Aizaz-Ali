import { FaWordpress, FaShopify, FaReact, FaWhatsapp } from 'react-icons/fa';
import { SiFiverr, SiUpwork } from 'react-icons/si';
import { FiArrowUp, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const scrollTo  = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Footer() {
  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="float1 absolute top-10 right-20 w-40 h-40 rounded-full bg-accent/5 blur-2xl" />
        <div className="float2 absolute bottom-10 left-10 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <button onClick={scrollTop} className="text-3xl font-display font-black mb-4 block text-left">
              <span className="gradient-text">Aizaz</span>
              <span className="text-white">.</span>
            </button>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs mb-2">
              Freelance WordPress, Shopify &amp; React developer based in Islamabad. Building beautiful, performant websites for clients worldwide.
            </p>
            <a
              href="mailto:aaizaz519@gmail.com"
              className="text-xs text-accent/80 hover:text-accent transition-colors"
            >
              aaizaz519@gmail.com
            </a>
            <div className="flex gap-3 mt-5">
              {[
                { icon: SiFiverr,   href: 'https://www.fiverr.com/s/dDa9lqa', bg: '#1dbf73' },
                { icon: SiUpwork,   href: 'https://www.upwork.com/freelancers/~01db2b03b5a7f36be8', bg: '#14a800' },
                { icon: FaWhatsapp, href: 'https://wa.me/923359574017', bg: '#25d366' },
                { icon: FiMail,     href: 'mailto:aaizaz519@gmail.com', bg: '#7cb26e' },
              ].map(({ icon: Icon, href, bg }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = bg; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2">
              {['home', 'about', 'services', 'portfolio', 'contact'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-sm text-white/70 hover:text-accent transition-colors capitalize"
                  >
                    {id}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/blog" className="text-sm text-white/70 hover:text-accent transition-colors capitalize">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services + Hire */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Services</h4>
            <ul className="space-y-2 mb-6">
              {[
                { icon: FaWordpress, label: 'WordPress Dev' },
                { icon: FaShopify,   label: 'Shopify Dev' },
                { icon: FaReact,     label: 'React / Next.js' },
              ].map(({ icon: Icon, label }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo('services')}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    <Icon size={12} /> {label}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Hire Me</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.fiverr.com/s/dDa9lqa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#1dbf73] hover:text-[#1dbf73]/80 transition-colors"
              >
                <SiFiverr size={12} /> Fiverr Profile
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01db2b03b5a7f36be8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#14a800] hover:text-[#14a800]/80 transition-colors"
              >
                <SiUpwork size={12} /> Upwork Profile
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} All Rights Reserved — Aizaz Ali Afridi
          </p>
          <p className="text-xs text-white/40">Islamabad, Pakistan</p>
        </div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        onClick={scrollTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/40 z-50 hover:bg-accent/90 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <FiArrowUp size={18} />
      </motion.button>
    </footer>
  );
}
