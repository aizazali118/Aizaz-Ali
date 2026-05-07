import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiDownload, FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';
import { SiFiverr, SiUpwork } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa';

const skills = [
  { name: 'WordPress / WooCommerce', pct: 95 },
  { name: 'Shopify / Liquid',        pct: 90 },
  { name: 'React / Next.js',         pct: 85 },
  { name: 'HTML / CSS / Tailwind',   pct: 95 },
  { name: 'JavaScript / TypeScript', pct: 82 },
  { name: 'UI/UX Design (Figma)',    pct: 75 },
  { name: 'PHP / MySQL',             pct: 78 },
  { name: 'SEO & Performance',       pct: 88 },
];

const experience = [
  { year: 'Apr 2026 – Present',            role: 'WordPress Developer',          company: 'Vision Tact',          type: 'Full-time',   loc: 'Islamabad · On-site'  },
  { year: 'Sep 2025 – May 2026 (9 mos)',   role: 'WordPress Developer',          company: 'Advanced Datalytics',  type: 'Part-time',   loc: 'Islamabad · Remote'   },
  { year: 'Jan 2024 – Apr 2026 (2y 4m)',   role: 'WordPress Developer',          company: 'Hexa IT Solutions',    type: 'Full-time',   loc: 'Rawalpindi · On-site' },
  { year: 'Mar 2025 – Jun 2025 (4 mos)',   role: 'WordPress | Shopify Developer',company: 'Swiftwave Digital',    type: 'Part-time',   loc: 'Islamabad · Remote'   },
  { year: 'Dec 2024 – Jan 2025 (2 mos)',   role: 'WordPress | Shopify Developer',company: 'Conzummate Tech Ltd',  type: 'Part-time',   loc: 'Lahore · Remote'      },
  { year: 'Jun 2023 – Jun 2024 (1y 1m)',   role: 'Data Entry Operator',          company: 'UNICEF',               type: 'Contract',    loc: 'On-site'              },
];

const projects = [
  { name: 'Vision Tact',             tech: 'WordPress', url: 'visiontact.com'          },
  { name: 'Hexa IT Solutions',       tech: 'WordPress', url: 'hexaitsolutions.com'      },
  { name: 'Puravibra UAE',           tech: 'WordPress', url: 'puravibrauae.com'         },
  { name: 'Abdul Malik Fareed',      tech: 'WordPress', url: 'abdulmalikfareed.com'     },
  { name: 'Montiero',                tech: 'Shopify',   url: 'montiero.pk'              },
  { name: 'Nabqa',                   tech: 'Shopify',   url: 'nabqa.com'                },
  { name: 'Aoraki Telecom',          tech: 'React',     url: 'aorakitelecom.com'        },
  { name: 'PopSearch Live Plugin',   tech: 'WordPress Plugin', url: 'wordpress.org'     },
];

export default function CvPage() {
  useEffect(() => {
    document.body.style.background = '#fff';
    return () => { document.body.style.background = ''; };
  }, []);

  return (
    <>
      <Helmet>
        <title>CV – Aizaz Ali Afridi | Web Developer</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Print button — hidden in print */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform"
          style={{ background: '#7cb26e' }}
        >
          <FiDownload size={14} /> Download PDF
        </button>
      </div>

      {/* A4 Page */}
      <div
        id="cv-page"
        className="mx-auto bg-white"
        style={{ maxWidth: '794px', minHeight: '1123px', fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Header */}
        <div className="px-12 pt-10 pb-6" style={{ background: '#0a0a0a' }}>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-white leading-none mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Aizaz Ali <span style={{ color: '#7cb26e' }}>Afridi</span>
              </h1>
              <p className="text-lg font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                WordPress · Shopify · Frontend Developer
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span className="flex items-center gap-1.5"><FiMail size={11} /> aaizaz519@gmail.com</span>
                <span className="flex items-center gap-1.5"><FiPhone size={11} /> +92 335 9574017</span>
                <span className="flex items-center gap-1.5"><FiMapPin size={11} /> Islamabad, Pakistan</span>
                <span className="flex items-center gap-1.5"><FiGlobe size={11} /> aizazaliafridi.com</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-xs text-right flex-shrink-0" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <span>fiverr.com/s/gD71ldb</span>
              <span>upwork.com/freelancers/~01db2b03b5a7f36be8</span>
              <span>linkedin.com/in/aizaz-ali-afridi</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-12 pt-8 pb-10 grid grid-cols-[1fr_200px] gap-10">

          {/* ── LEFT column ── */}
          <div>
            {/* Summary */}
            <section className="mb-7">
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1.5" style={{ color: '#7cb26e', borderBottom: '2px solid #7cb26e' }}>
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
                Experienced full-stack web developer specialising in WordPress, Shopify, and React. 4+ years delivering
                high-performance, conversion-optimised websites and web applications for 40+ clients worldwide via Fiverr
                and Upwork. Proven track record across e-commerce, corporate, and SaaS projects with consistently 5-star
                client feedback.
              </p>
            </section>

            {/* Experience */}
            <section className="mb-7">
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 pb-1.5" style={{ color: '#7cb26e', borderBottom: '2px solid #7cb26e' }}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((job, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center mt-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#7cb26e' }} />
                      {i < experience.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: '#e5e5e5', minHeight: 28 }} />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-black" style={{ color: '#111' }}>{job.role}</p>
                      <p className="text-xs font-bold mb-0.5" style={{ color: '#7cb26e' }}>{job.company}</p>
                      <p className="text-[11px]" style={{ color: '#888' }}>{job.year} · {job.type} · {job.loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 pb-1.5" style={{ color: '#7cb26e', borderBottom: '2px solid #7cb26e' }}>
                Selected Projects
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {projects.map(({ name, tech, url }) => (
                  <div key={name} className="rounded-lg px-3 py-2 border" style={{ borderColor: '#e8e8e8', background: '#fafafa' }}>
                    <p className="text-xs font-bold" style={{ color: '#111' }}>{name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: '#7cb26e' }}>{tech}</span>
                      <span className="text-[10px]" style={{ color: '#aaa' }}>{url}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT column ── */}
          <div>
            {/* Skills */}
            <section className="mb-7">
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 pb-1.5" style={{ color: '#7cb26e', borderBottom: '2px solid #7cb26e' }}>
                Skills
              </h2>
              <div className="space-y-3">
                {skills.map(({ name, pct }) => (
                  <div key={name}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: '#333', fontWeight: 600 }}>{name}</span>
                      <span style={{ color: '#7cb26e', fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#eee' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#5a9a4a,#7cb26e)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section className="mb-7">
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1.5" style={{ color: '#7cb26e', borderBottom: '2px solid #7cb26e' }}>
                Services
              </h2>
              {['WordPress Development','Shopify Development','Frontend (React/Next.js)','Custom Plugins','UI/UX Design (Figma)','SEO & Performance'].map(s => (
                <div key={s} className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#7cb26e' }} />
                  <span className="text-[11px]" style={{ color: '#444' }}>{s}</span>
                </div>
              ))}
            </section>

            {/* Stats */}
            <section className="rounded-xl p-4 text-center" style={{ background: '#0a0a0a' }}>
              {[['50+', 'Projects'], ['40+', 'Clients'], ['4+', 'Years'], ['5★', 'Fiverr']].map(([n, l]) => (
                <div key={l} className="mb-3">
                  <p className="text-xl font-black" style={{ color: '#7cb26e' }}>{n}</p>
                  <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: #fff !important; }
          #cv-page { max-width: none !important; box-shadow: none !important; }
          @page { margin: 0; size: A4; }
        }
      `}</style>
    </>
  );
}
