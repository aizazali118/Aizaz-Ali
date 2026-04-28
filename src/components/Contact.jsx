import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SiFiverr, SiUpwork } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: FiMail,
    label: 'Email',
    value: 'aaizaz519@gmail.com',
    href: 'mailto:aaizaz519@gmail.com',
    color: '#7cb26e',
  },
  {
    icon: FiPhone,
    label: 'Phone / WhatsApp',
    value: '+92 335 9574017',
    href: 'https://wa.me/923359574017',
    color: '#25d366',
  },
  {
    icon: FiMapPin,
    label: 'Location',
    value: 'Islamabad, Pakistan (Remote Worldwide)',
    href: null,
    color: '#f97316',
  },
];

const socials = [
  { icon: SiFiverr,   href: 'https://www.fiverr.com/s/dDa9lqa', label: 'Fiverr', bg: '#1dbf73' },
  { icon: SiUpwork,   href: 'https://www.upwork.com/freelancers/~01db2b03b5a7f36be8', label: 'Upwork', bg: '#14a800' },
  { icon: FaWhatsapp, href: 'https://wa.me/923359574017', label: 'WhatsApp', bg: '#25d366' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const formRef    = useRef(null);
  const infoRef    = useRef(null);

  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
        y: 50, opacity: 0, duration: 0.9, ease: 'power4.out',
      });
      gsap.from(formRef.current, {
        scrollTrigger: { trigger: formRef.current, start: 'top 80%' },
        x: -50, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
      gsap.from(infoRef.current, {
        scrollTrigger: { trigger: infoRef.current, start: 'top 80%' },
        x: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setSending(true);
    // Simulate send (replace with real API call / EmailJS / Formspree)
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 overflow-hidden" style={{ background: 'rgba(249,250,251,0.88)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-primary">
            Let's <span className="gradient-text">Talk</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Have a project in mind? I'd love to hear about it. Send me a message and I'll get back to you within 24 hours.
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* ── Contact form (3 cols) ── */}
          <div ref={formRef} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-display font-bold text-primary mb-6">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell me about your project, budget, timeline..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending || sent}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/30 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sent ? (
                    <><FiCheck size={16} /> Message Sent!</>
                  ) : sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <><FiSend size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Info panel (2 cols) ── */}
          <div ref={infoRef} className="lg:col-span-2 flex flex-col gap-6">
            {/* Contact info cards */}
            {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '18' }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:text-accent transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-primary">{value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Follow Me</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label, bg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200 hover:scale-110"
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = bg; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = bg; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div className="bg-gradient-to-br from-accent/5 to-green-50 rounded-2xl p-5 border border-accent/10">
              <h4 className="font-bold text-primary text-sm mb-3">Why Work With Me?</h4>
              <ul className="space-y-2">
                {[
                  '⚡ Fast turnaround & delivery',
                  '💬 Clear, transparent communication',
                  '🔄 Unlimited revisions until satisfied',
                  '🔒 NDA & privacy respected',
                ].map((item) => (
                  <li key={item} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
