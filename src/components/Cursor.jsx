import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TRAIL_COUNT = 6;

// Don't show custom cursor on touch / mobile devices
const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function Cursor() {
  if (isTouch) return null;
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);
  const trailsRef = useRef([]);

  useEffect(() => {
    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;
    const trails = trailsRef.current;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;

    // Per-trail state
    const trailPos = trails.map(() => ({ x: mx, y: my, alpha: 0 }));
    let raf;

    // ── Mouse move ──
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: 'power2.out' });
    };

    // ── RAF loop: ring + trails ──
    const loop = () => {
      // Ring lags behind cursor
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      gsap.set(ring, { x: rx, y: ry });

      // Trail cascade: each follows the one before it
      trailPos[0].x += (mx - trailPos[0].x) * 0.22;
      trailPos[0].y += (my - trailPos[0].y) * 0.22;
      for (let i = 1; i < TRAIL_COUNT; i++) {
        trailPos[i].x += (trailPos[i-1].x - trailPos[i].x) * 0.28;
        trailPos[i].y += (trailPos[i-1].y - trailPos[i].y) * 0.28;
      }
      trails.forEach((el, i) => {
        if (!el) return;
        const scale = 1 - (i / TRAIL_COUNT) * 0.75;
        const opacity = (1 - i / TRAIL_COUNT) * 0.45;
        gsap.set(el, {
          x: trailPos[i].x,
          y: trailPos[i].y,
          scale,
          opacity,
        });
      });

      raf = requestAnimationFrame(loop);
    };

    // ── Hover effects ──
    const onEnter = (e) => {
      ring.classList.add('hovered');
      dot.classList.add('hidden');
      // Update label text
      const el = e.currentTarget;
      if (label) {
        label.textContent =
          el.dataset.cursor ||
          (el.tagName === 'A' ? 'VISIT' : 'CLICK');
      }
    };
    const onLeave = () => {
      ring.classList.remove('hovered');
      dot.classList.remove('hidden');
    };

    const attach = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    attach();

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(loop);

    // Hide on leave / show on enter window
    const onLeaveWindow = () => { gsap.to([dot, ring], { opacity: 0, duration: 0.3 }); };
    const onEnterWindow = () => { gsap.to([dot, ring], { opacity: 1, duration: 0.3 }); };
    document.addEventListener('mouseleave', onLeaveWindow);
    document.addEventListener('mouseenter', onEnterWindow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('mouseenter', onEnterWindow);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Glow dot */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Gradient ring with VIEW label */}
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label">VIEW</span>
      </div>

      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailsRef.current[i] = el)}
          className="cursor-trail"
          style={{
            width: `${8 - i * 0.9}px`,
            height: `${8 - i * 0.9}px`,
            background: `hsl(${245 + i * 8}, 80%, ${65 + i * 3}%)`,
          }}
        />
      ))}
    </>
  );
}
