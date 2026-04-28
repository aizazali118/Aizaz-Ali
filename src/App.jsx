import { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';

import Preloader   from './components/Preloader';
import Cursor      from './components/Cursor';
import ProgressBar from './components/ProgressBar';
import ParallaxBg  from './components/ParallaxBg';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';

/* ── Homepage section components (eager — used on first load) ── */
import Hero      from './components/Hero';
import About     from './components/About';
import Services  from './components/Services';
import Pricing   from './components/Pricing';
import Portfolio from './components/Portfolio';
import Contact   from './components/Contact';
import Blog      from './components/Blog';

/* ── Proper pages (code-split) ── */
const AboutPage     = lazy(() => import('./pages/AboutPage'));
const ServicesPage  = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ContactPage   = lazy(() => import('./pages/ContactPage'));
const BlogPage      = lazy(() => import('./pages/BlogPage'));
const BlogPostPage  = lazy(() => import('./pages/BlogPostPage'));

/* ── Admin panel (code-split) ── */
const AdminLogin        = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout       = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPosts        = lazy(() => import('./pages/admin/AdminPosts'));
const AdminPostEditor   = lazy(() => import('./pages/admin/AdminPostEditor'));
const AdminPortfolio    = lazy(() => import('./pages/admin/AdminPortfolio'));
const AdminServices     = lazy(() => import('./pages/admin/AdminServices'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );
}

/* ── All routes live here — has access to useLocation ── */
function AppRoutes() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  /* Restore normal cursor on admin pages, hide it on public site */
  useEffect(() => {
    document.body.classList.toggle('admin-page', isAdmin);
  }, [isAdmin]);

  /* Skip the preloader entirely on admin pages */
  const [loaded, setLoaded] = useState(isAdmin);

  return (
    <>
      {/* Preloader only for the public site */}
      {!isAdmin && <Preloader onDone={() => setLoaded(true)} />}

      {loaded && (
        <>
          {/* Decorative layers — public site only, never on admin */}
          {!isAdmin && <Cursor />}
          {!isAdmin && <ProgressBar />}
          {!isAdmin && <ParallaxBg />}

          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* ══════════ PUBLIC ROUTES ══════════ */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <Hero />
                    <About />
                    <Services />
                    <Pricing />
                    <Portfolio />
                    <Blog />
                    <Contact />
                  </main>
                  <Footer />
                </>
              } />

              <Route path="/about" element={
                <><Navbar /><main className="relative z-10 min-h-screen"><AboutPage /></main><Footer /></>
              } />
              <Route path="/services" element={
                <><Navbar /><main className="relative z-10 min-h-screen"><ServicesPage /></main><Footer /></>
              } />
              <Route path="/portfolio" element={
                <><Navbar /><main className="relative z-10 min-h-screen"><PortfolioPage /></main><Footer /></>
              } />
              <Route path="/contact" element={
                <><Navbar /><main className="relative z-10 min-h-screen"><ContactPage /></main><Footer /></>
              } />
              <Route path="/blog" element={
                <><Navbar /><main className="relative z-10 min-h-screen"><BlogPage /></main><Footer /></>
              } />
              <Route path="/blog/:slug" element={
                <><Navbar /><main className="relative z-10 min-h-screen"><BlogPostPage /></main><Footer /></>
              } />

              {/* ══════════ ADMIN ROUTES ══════════ */}
              <Route path="/admin" element={<AdminLogin />} />

              <Route path="/admin/dashboard" element={
                <AdminLayout><AdminDashboard /></AdminLayout>
              } />
              <Route path="/admin/posts" element={
                <AdminLayout><AdminPosts /></AdminLayout>
              } />
              <Route path="/admin/posts/new" element={
                <AdminLayout><AdminPostEditor /></AdminLayout>
              } />
              <Route path="/admin/posts/:id/edit" element={
                <AdminLayout><AdminPostEditor /></AdminLayout>
              } />
              <Route path="/admin/portfolio" element={
                <AdminLayout><AdminPortfolio /></AdminLayout>
              } />
              <Route path="/admin/services" element={
                <AdminLayout><AdminServices /></AdminLayout>
              } />
              <Route path="/admin/testimonials" element={
                <AdminLayout><AdminTestimonials /></AdminLayout>
              } />
            </Routes>
          </Suspense>
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
