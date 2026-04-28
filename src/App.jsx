import { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';

import Preloader   from './components/Preloader';
import Cursor      from './components/Cursor';
import ProgressBar from './components/ProgressBar';
import ParallaxBg  from './components/ParallaxBg';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';

/* ── Public pages ── */
import Hero        from './components/Hero';
import About       from './components/About';
import Services    from './components/Services';
import Pricing     from './components/Pricing';
import Portfolio   from './components/Portfolio';
import Contact     from './components/Contact';
import Blog        from './components/Blog';

/* ── Proper separate pages (lazy loaded) ── */
const AboutPage     = lazy(() => import('./pages/AboutPage'));
const ServicesPage  = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ContactPage   = lazy(() => import('./pages/ContactPage'));
const BlogPage      = lazy(() => import('./pages/BlogPage'));
const BlogPostPage  = lazy(() => import('./pages/BlogPostPage'));

/* ── Admin panel (lazy loaded) ── */
const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout   = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPosts    = lazy(() => import('./pages/admin/AdminPosts'));
const AdminPostEditor = lazy(() => import('./pages/admin/AdminPostEditor'));

/* Loading fallback */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );
}

/* ── Main homepage (all sections in one scroll) ── */
function HomePage() {
  return (
    <main className="relative z-10">
      <Hero />
      <About />
      <Services />
      <Pricing />
      <Portfolio />
      <Blog />
      <Contact />
    </main>
  );
}

/* ── Public layout wrapper (navbar + footer + animations) ── */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
      <Footer />
    </>
  );
}

/* ── Admin wrapper (no public nav/footer) ── */
function AdminWrapper({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Preloader onDone={() => setLoaded(true)} />

          {loaded && (
            <>
              {/* Global decorative layers (public pages only — hidden on admin via CSS) */}
              <Cursor />
              <ProgressBar />
              <ParallaxBg />

              <Routes>
                {/* ── Public Routes ── */}
                <Route path="/" element={
                  <PublicLayout>
                    <HomePage />
                  </PublicLayout>
                } />
                <Route path="/about" element={
                  <PublicLayout>
                    <main className="relative z-10 min-h-screen">
                      <AboutPage />
                    </main>
                  </PublicLayout>
                } />
                <Route path="/services" element={
                  <PublicLayout>
                    <main className="relative z-10 min-h-screen">
                      <ServicesPage />
                    </main>
                  </PublicLayout>
                } />
                <Route path="/portfolio" element={
                  <PublicLayout>
                    <main className="relative z-10 min-h-screen">
                      <PortfolioPage />
                    </main>
                  </PublicLayout>
                } />
                <Route path="/contact" element={
                  <PublicLayout>
                    <main className="relative z-10 min-h-screen">
                      <ContactPage />
                    </main>
                  </PublicLayout>
                } />
                <Route path="/blog" element={
                  <PublicLayout>
                    <main className="relative z-10 min-h-screen">
                      <BlogPage />
                    </main>
                  </PublicLayout>
                } />
                <Route path="/blog/:slug" element={
                  <PublicLayout>
                    <main className="relative z-10 min-h-screen">
                      <BlogPostPage />
                    </main>
                  </PublicLayout>
                } />

                {/* ── Admin Routes ── */}
                <Route path="/admin" element={<AdminWrapper><AdminLogin /></AdminWrapper>} />
                <Route path="/admin/dashboard" element={
                  <AdminWrapper>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminWrapper>
                } />
                <Route path="/admin/posts" element={
                  <AdminWrapper>
                    <AdminLayout>
                      <AdminPosts />
                    </AdminLayout>
                  </AdminWrapper>
                } />
                <Route path="/admin/posts/new" element={
                  <AdminWrapper>
                    <AdminLayout>
                      <AdminPostEditor />
                    </AdminLayout>
                  </AdminWrapper>
                } />
                <Route path="/admin/posts/:id/edit" element={
                  <AdminWrapper>
                    <AdminLayout>
                      <AdminPostEditor />
                    </AdminLayout>
                  </AdminWrapper>
                } />
              </Routes>
            </>
          )}
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
