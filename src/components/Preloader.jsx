import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = ['WordPress Developer', 'Shopify Expert', 'React Developer', 'Freelancer'];

export default function Preloader({ onDone }) {
  const [progress,  setProgress]  = useState(0);
  const [roleIdx,   setRoleIdx]   = useState(0);
  const [visible,   setVisible]   = useState(true);
  const intervalRef = useRef(null);

  /* ── progress counter ── */
  useEffect(() => {
    let p = 0;
    intervalRef.current = setInterval(() => {
      const jump = Math.random() * 14 + 4;
      p = Math.min(p + jump, 100);
      setProgress(Math.floor(p));
      if (p >= 100) {
        clearInterval(intervalRef.current);
        // brief pause at 100%, then exit
        setTimeout(() => {
          setVisible(false);
          setTimeout(onDone, 1100);   // fire after curtain finishes
        }, 600);
      }
    }, 90);
    return () => clearInterval(intervalRef.current);
  }, [onDone]);

  /* ── role cycler ── */
  useEffect(() => {
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ background: 'linear-gradient(145deg, #06040f 0%, #0d0b1a 50%, #040a12 100%)' }}
        >
          {/* ── ambient glow blobs ── */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute pointer-events-none"
            style={{
              width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(108,99,255,0.30) 0%, transparent 65%)',
              filter: 'blur(30px)', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.10, 0.20, 0.10] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute pointer-events-none"
            style={{
              width: 400, height: 400, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 65%)',
              filter: 'blur(40px)', bottom: '15%', right: '10%',
            }}
          />

          {/* ── floating code bits in background ── */}
          {['<div/>', 'const', '=>', '{...}', 'npm i', '.php', 'flex', 'async'].map((w, i) => (
            <motion.span
              key={w}
              className="absolute font-mono text-xs pointer-events-none"
              style={{
                left: `${10 + i * 11}%`,
                top: `${15 + (i % 3) * 25}%`,
                color: `rgba(${i % 2 === 0 ? '108,99,255' : '6,182,212'},0.18)`,
              }}
              animate={{ y: [-8, 8, -8], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            >
              {w}
            </motion.span>
          ))}

          {/* ── profile photo + rings ── */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* pulse rings */}
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                className="absolute rounded-full border border-accent/20"
                animate={{ scale: [0.85, 1.4, 0.85], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: n * 0.5, ease: 'easeOut' }}
                style={{ width: n * 40 + 120, height: n * 40 + 120 }}
              />
            ))}
            {/* spinning gradient ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 122, height: 122, padding: 3,
                background: 'linear-gradient(135deg, #6c63ff, #a78bfa, #06b6d4)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            {/* photo — circular clip */}
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative rounded-full overflow-hidden"
              style={{
                width: 116, height: 116,
                border: '3px solid transparent',
                boxShadow: '0 0 28px rgba(108,99,255,0.55), 0 0 60px rgba(108,99,255,0.2)',
                background: 'linear-gradient(#0d0b1a, #0d0b1a) padding-box, linear-gradient(135deg, #6c63ff, #a78bfa, #06b6d4) border-box',
              }}
            >
              <img
                src="/profile.png"
                alt="Aizaz Ali Afridi"
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
          </div>

          {/* ── name ── */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="text-4xl md:text-5xl font-display font-black text-center"
              style={{
                background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 45%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              Aizaz Ali Afridi
            </motion.h1>
          </div>

          {/* ── animated role label ── */}
          <div className="h-6 overflow-hidden mb-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="text-center text-sm font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(108,99,255,0.8)' }}
              >
                {ROLES[roleIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ── progress bar ── */}
          <div className="w-56 flex flex-col items-center gap-3">
            <div className="w-full h-[3px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6c63ff, #a78bfa, #06b6d4)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: 'linear' }}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <motion.span
                className="text-[11px] font-mono"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading portfolio...
              </motion.span>
              <span
                className="text-[11px] font-mono font-bold"
                style={{ color: '#a78bfa' }}
              >
                {progress}%
              </span>
            </div>
          </div>

          {/* ── bottom signature ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute bottom-8 text-[11px] font-mono tracking-widest"
            style={{ color: 'rgba(255,255,255,0.12)' }}
          >
            wordpress · shopify · react
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
