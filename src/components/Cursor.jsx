import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TRAIL_COUNT = 5;
const MAGNETIC_RADIUS = 72;   // px — pull starts within this distance from element center
const MAGNETIC_STRENGTH = 0.38; // 0–1 how hard the ring is pulled

// Desktop only — triple-check: media query + touch events + touch points
const isTouch = typeof window !== 'undefined' && (
  window.matchMedia('(pointer: coarse)').matches ||
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0
);

export default function Cursor() {
  if (isTouch) return null;

  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const auraRef  = useRef(null);
  const labelRef = useRef(null);
  const trailsRef = useRef([]);

  useEffect(() => {
    const dot    = dotRef.current;
    const ring   = ringRef.current;
    const aura   = auraRef.current;
    const label  = labelRef.current;
    const trails = trailsRef.current;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    // Ring target (before magnetic pull)
    let rx = mx, ry = my;
    // Ring rendered position (after pull)
    let finalX = mx, finalY = my;

    const trailPos = trails.map(() => ({ x: mx, y: my }));
    let raf;
    let isHovered = false;

    // ── Mouse move — dot snaps instantly ──
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: 'power2.out' });
      gsap.to(aura, { x: mx, y: my, duration: 0.55, ease: 'power2.out' });
    };

    // ── RAF loop: ring with magnetic pull + trails ──
    const loop = () => {
      // Smooth lag for ring base position
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;

      // Magnetic pull — find closest interactive element
      let pullX = rx, pullY = ry;
      if (!isHovered) {
        const interactives = document.querySelectorAll('a, button, [data-cursor]');
        let closestDist = Infinity;
        let closestPullX = rx, closestPullY = ry;

        interactives.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width  / 2;
          const cy = rect.top  + rect.height / 2;
          const dist = Math.hypot(rx - cx, ry - cy);

          if (dist < MAGNETIC_RADIUS && dist < closestDist) {
            closestDist = dist;
            const t = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS; // 0→1 as cursor gets closer
            closestPullX = rx + (cx - rx) * t * MAGNETIC_STRENGTH;
            closestPullY = ry + (cy - ry) * t * MAGNETIC_STRENGTH;
          }
        });
        pullX = closestPullX;
        pullY = closestPullY;
      }

      // Smooth lerp to pulled position
      finalX += (pullX - finalX) * 0.18;
      finalY += (pullY - finalY) * 0.18;
      gsap.set(ring, { x: finalX, y: finalY });

      // Trail cascade — each follows the previous
      trailPos[0].x += (mx - trailPos[0].x) * 0.25;
      trailPos[0].y += (my - trailPos[0].y) * 0.25;
      for (let i = 1; i < TRAIL_COUNT; i++) {
        trailPos[i].x += (trailPos[i - 1].x - trailPos[i].x) * 0.30;
        trailPos[i].y += (trailPos[i - 1].y - trailPos[i].y) * 0.30;
      }
      trails.forEach((el, i) => {
        if (!el) return;
        const scale   = 1 - (i / TRAIL_COUNT) * 0.78;
        const opacity = (1 - i / TRAIL_COUNT) * 0.35;
        gsap.set(el, { x: trailPos[i].x, y: trailPos[i].y, scale, opacity });
      });

      raf = requestAnimationFrame(loop);
    };

    // ── Hover state ──
    const onEnter = (e) => {
      isHovered = true;
      ring.classList.add('hovered');
      dot.classList.add('hidden');
      if (label) {
        const el = e.currentTarget;
        label.textContent = el.dataset.cursor || (el.tagName === 'A' ? 'VISIT' : 'CLICK');
      }
    };
    const onLeave = () => {
      isHovered = false;
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

    const onLeaveWin = () => gsap.to([dot, ring, aura], { opacity: 0, duration: 0.3 });
    const onEnterWin = () => gsap.to([dot, ring, aura], { opacity: 1, duration: 0.3 });
    document.addEventListener('mouseleave', onLeaveWin);
    document.addEventListener('mouseenter', onEnterWin);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeaveWin);
      document.removeEventListener('mouseenter', onEnterWin);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Sharp dot — mix-blend-mode: difference for invert effect */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Magnetic ring */}
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label">VIEW</span>
      </div>

      {/* Soft aura glow that follows loosely */}
      <div ref={auraRef} className="cursor-aura" />

      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailsRef.current[i] = el)}
          className="cursor-trail"
          style={{
            width:  `${7 - i * 1.0}px`,
            height: `${7 - i * 1.0}px`,
          }}
        />
      ))}
    </>
  );
}
