import { useEffect, useRef } from 'react';

/*
  Canvas-based "code rain" background.
  - Web-dev keywords fall in columns like The Matrix
  - Scroll speeds them up and brightens them
  - Completely non-interactive, z-index 1
*/

const KEYWORDS = [
  // JS / React
  'const', 'let', 'var', '=>', 'fn()', '{ }', '[ ]', '...',
  'import', 'export', 'return', 'async', 'await', 'class',
  'useState', 'useRef', 'props', 'JSX', 'null', 'true',
  // CSS / Tailwind
  'flex', 'grid', 'rem', 'px', 'rgba', ':root', '@media',
  // WordPress / PHP
  '<?php', 'wp_()', 'hook', 'ACF', '.php', 'WP',
  // Shopify / Liquid
  '{% %}', '{{ }}', 'liquid', 'theme', 'section',
  // General dev
  'API', 'GET', 'POST', '200', '404', 'npm', 'git',
  'push', 'pull', 'build', 'dev', 'CSS', 'HTML',
  '//', '/*', '*/', '===', '!==', '&&', '||',
];

const COL_W    = 72;   // px between columns
const FONT_SZ  = 12;   // px
const FONT     = `${FONT_SZ}px 'Courier New', monospace`;
const FPS      = 18;   // base frames per second

export default function CodeBg() {
  const canvasRef   = useRef(null);
  const scrollSpeed = useRef(1);    // multiplier driven by scroll velocity
  const lastScroll  = useRef(0);
  const lastTime    = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* ── resize ── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── columns ── */
    const numCols = () => Math.ceil(canvas.width / COL_W) + 2;

    let cols = [];
    const initCols = () => {
      cols = Array.from({ length: numCols() }, (_, i) => ({
        x:       i * COL_W + Math.random() * 20 - 10,
        y:       Math.random() * -canvas.height,      // start above screen
        speed:   0.6 + Math.random() * 1.2,           // chars/frame
        opacity: 0.15 + Math.random() * 0.25,
        kwIdx:   Math.floor(Math.random() * KEYWORDS.length),
        trail:   [],                                   // last N y positions
        trailLen:4 + Math.floor(Math.random() * 5),
      }));
    };
    initCols();

    /* ── scroll speed tracker ── */
    const onScroll = () => {
      const now = Date.now();
      const dt  = Math.max(now - lastTime.current, 1);
      const dy  = Math.abs(window.scrollY - lastScroll.current);
      scrollSpeed.current = Math.min(1 + dy / 8, 5);   // cap at 5×
      lastScroll.current  = window.scrollY;
      lastTime.current    = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── decay scroll speed back to 1 ── */
    const decayId = setInterval(() => {
      scrollSpeed.current = 1 + (scrollSpeed.current - 1) * 0.85;
    }, 50);

    /* ── draw loop ── */
    let lastDraw = 0;
    const interval = 1000 / FPS;
    let rafId;

    const draw = (ts) => {
      rafId = requestAnimationFrame(draw);
      if (ts - lastDraw < interval / scrollSpeed.current) return;
      lastDraw = ts;

      /* Fade out old content */
      ctx.fillStyle = 'rgba(255,255,255,0.045)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = FONT;

      const sp = Math.max(scrollSpeed.current, 1);
      const brightBoost = Math.min((sp - 1) * 0.3, 0.6); // extra brightness while scrolling

      cols.forEach((col) => {
        const kw = KEYWORDS[col.kwIdx];

        /* ── draw trail (fading older positions) ── */
        col.trail.forEach((ty, ti) => {
          const fade = (1 - ti / col.trailLen) * (col.opacity * 0.6);
          ctx.fillStyle = `rgba(108,99,255,${fade})`;
          ctx.fillText(kw, col.x, ty);
        });

        /* ── draw leading keyword (brightest) ── */
        const leadOpacity = Math.min(col.opacity + brightBoost + 0.05, 0.85);

        // Cyan tint for leading char when fast-scrolling
        if (sp > 2) {
          ctx.fillStyle = `rgba(6,182,212,${leadOpacity * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(108,99,255,${leadOpacity})`;
        }
        ctx.fillText(kw, col.x, col.y);

        /* ── advance ── */
        col.trail.unshift(col.y);
        if (col.trail.length > col.trailLen) col.trail.pop();

        col.y += col.speed * sp * 1.5;

        /* ── reset when off-screen ── */
        if (col.y > canvas.height + 40) {
          col.y      = -FONT_SZ * 4;
          col.kwIdx  = Math.floor(Math.random() * KEYWORDS.length);
          col.speed  = 0.6 + Math.random() * 1.2;
          col.trail  = [];
          col.opacity = 0.12 + Math.random() * 0.22;
        }
      });
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(decayId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
