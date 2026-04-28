import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SiFiverr, SiUpwork } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  { icon: FiMail,    label: 'Email',              value: 'aaizaz519@gmail.com',          href: 'mailto:aaizaz519@gmail.com', color: '#7cb26e' },
  { icon: FiPhone,   label: 'Phone / WhatsApp',   value: '+92 335 9574017',              href: 'https://wa.me/923359574017', color: '#25d366' },
  { icon: FiMapPin,  label: 'Location',           value: 'Islamabad, Pakistan (Remote)', href: null,                         color: '#f97316' },
];
const socials = [
  { icon: SiFiverr,   href: 'https://www.fiverr.com/s/dDa9lqa',                       label: 'Fiverr',   bg: '#1dbf73' },
  { icon: SiUpwork,   href: 'https://www.upwork.com/freelancers/~01db2b03b5a7f36be8', label: 'Upwork',   bg: '#14a800' },
  { icon: FaWhatsapp, href: 'https://wa.me/923359574017',                              label: 'WhatsApp', bg: '#25d366' },
];

const D = {
  card:   'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  input:  'rgba(255,255,255,0.06)',
  text:   'rgba(255,255,255,0.55)',
  muted:  'rgba(255,255,255,0.35)',
};

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
  background: D.input, border: `1px solid ${D.border}`,
  color: '#ffffff', fontSize: '0.875rem', outline: 'none',
};

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
      gsap.from(headRef.current, { scrollTrigger: { trigger: headRef.current, start: 'top 85%' }, y: 50, opacity: 0, duration: 0.9, ease: 'power4.out' });
      gsap.from(formRef.current, { scrollTrigger: { trigger: formRef.current, start: 'top 80%' }, x: -50, opacity: 0, duration: 0.9, ease: 'power3.out' });
      gsap.from(infoRef.current, { scrollTrigger: { trigger: infoRef.current, start: 'top 80%' }, x: 50, opacity: 0, duration: 0.9, ease: 'power3.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false); setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const focusStyle = (e) => { e.target.style.borderColor = 'rgba(124,178,110,0.5)'; };
  const blurStyle  = (e) => { e.target.style.borderColor = D.border; };

  return (
    <section id="contact" ref={sectionRef} className="py-24 overflow-hidden" style={{ background: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto px-6">

        <div ref={headRef} className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white">
            Let's <span className="gradient-text">Talk</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: D.text }}>
            Have a project in mind? I'd love to hear about it. Send me a message and I'll get back to you within 24 hours.
          </p>
          <div className="mt-4 mx-auto section-line animate" />
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div ref={formRef} className="lg:col-span-3">
            <div className="rounded-3xl p-8 border" style={{ background: D.card, borderColor: D.border }}>
              <h3 className="text-xl font-display font-bold text-white mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ name:'name', label:'Name', type:'text', placeholder:'Your full name', required: true },
                    { name:'email', label:'Email', type:'email', placeholder:'your@email.com', required: true }
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>
                        {f.label} {f.required && <span className="text-red-400">*</span>}
                      </label>
                      <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                        placeholder={f.placeholder} style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>Subject</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange}
                    placeholder="What's this about?" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: D.muted }}>
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                    placeholder="Tell me about your project, budget, timeline..."
                    style={{ ...inputStyle, resize: 'none' }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                <button type="submit" disabled={sending || sent}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/30 hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                  {sent ? <><FiCheck size={16} /> Message Sent!</>
                    : sending ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Sending...</>
                    : <><FiSend size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>

          {/* Info panel */}
          <div ref={infoRef} className="lg:col-span-2 flex flex-col gap-4">
            {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
              <div key={label} className="rounded-2xl p-5 border transition-all duration-300" style={{ background: D.card, borderColor: D.border }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,178,110,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = D.border}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18' }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: D.muted }}>{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/80 hover:text-accent transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm font-semibold text-white/80">{value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-5 border" style={{ background: D.card, borderColor: D.border }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: D.muted }}>Follow Me</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label, bg }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = bg; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = bg; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(124,178,110,0.06)', borderColor: 'rgba(124,178,110,0.2)' }}>
              <h4 className="font-bold text-white text-sm mb-3">Why Work With Me?</h4>
              <ul className="space-y-2">
                {['⚡ Fast turnaround & delivery','💬 Clear, transparent communication','🔄 Unlimited revisions until satisfied','🔒 NDA & privacy respected'].map(item => (
                  <li key={item} className="text-sm" style={{ color: D.text }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
