import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#0a0a0a' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="text-center max-w-lg"
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{ background: 'rgba(124,178,110,0.1)', border: '1px solid rgba(124,178,110,0.25)' }}
        >
          <FiAlertCircle size={36} style={{ color: '#7cb26e' }} />
        </div>

        {/* 404 number */}
        <p className="text-8xl font-display font-black mb-4" style={{ color: 'rgba(255,255,255,0.06)' }}>
          404
        </p>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-4 -mt-6">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-bold text-sm shadow-xl shadow-accent/25 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <FiHome size={15} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8' }}
          >
            <FiArrowLeft size={15} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
