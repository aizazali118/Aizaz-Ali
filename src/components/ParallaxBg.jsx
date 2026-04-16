import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
  Full-page fixed background layer.
  Multiple gradient orbs move at different parallax speeds as you scroll,
  creating a living, breathing depth effect throughout the entire page.
*/
const orbs = [
  // [x%, y%, width, height, colorFrom, colorTo, speed multiplier]
  { x: '80%',  y: '5%',   w: 500, h: 500, c1: 'rgba(108,99,255,0.10)',  c2: 'rgba(167,139,250,0.05)', speed: -0.18 },
  { x: '5%',   y: '15%',  w: 380, h: 380, c1: 'rgba(6,182,212,0.08)',   c2: 'rgba(108,99,255,0.04)',  speed: 0.12  },
  { x: '60%',  y: '38%',  w: 440, h: 440, c1: 'rgba(167,139,250,0.08)', c2: 'rgba(6,182,212,0.04)',   speed: -0.22 },
  { x: '15%',  y: '55%',  w: 320, h: 320, c1: 'rgba(249,115,22,0.06)',  c2: 'rgba(236,72,153,0.04)',  speed: 0.16  },
  { x: '75%',  y: '68%',  w: 460, h: 460, c1: 'rgba(108,99,255,0.09)',  c2: 'rgba(6,182,212,0.05)',   speed: -0.14 },
  { x: '35%',  y: '82%',  w: 360, h: 360, c1: 'rgba(167,139,250,0.07)', c2: 'rgba(108,99,255,0.03)',  speed: 0.20  },
  { x: '88%',  y: '90%',  w: 300, h: 300, c1: 'rgba(6,182,212,0.07)',   c2: 'rgba(167,139,250,0.04)', speed: -0.10 },
];

export default function ParallaxBg() {
  const containerRef = useRef(null);
  const orbRefs      = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create one ScrollTrigger for the whole page
    const ctx = gsap.context(() => {
      orbs.forEach((orb, i) => {
        const el = orbRefs.current[i];
        if (!el) return;

        gsap.to(el, {
          y: () => window.innerHeight * orb.speed * 4,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="parallax-bg"
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          ref={(el) => (orbRefs.current[i] = el)}
          className="parallax-orb"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.w,
            height: orb.h,
            background: `radial-gradient(circle, ${orb.c1} 0%, ${orb.c2} 50%, transparent 75%)`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(60px)',
          }}
        />
      ))}

      {/* Very subtle full-page gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%,   rgba(108,99,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 50%,  rgba(6,182,212,0.03)  0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 20% 100%, rgba(167,139,250,0.04) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
