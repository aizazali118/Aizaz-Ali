import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Preloader   from './components/Preloader';
import Cursor      from './components/Cursor';
import ProgressBar from './components/ProgressBar';
import ParallaxBg  from './components/ParallaxBg';
import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import About       from './components/About';
import Services    from './components/Services';
import Pricing     from './components/Pricing';
import Portfolio   from './components/Portfolio';
import Contact     from './components/Contact';
import Footer      from './components/Footer';
import Blog        from './components/Blog';
import BlogPost    from './components/BlogPost';

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

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* Preloader (shows on every refresh) */}
        <Preloader onDone={() => setLoaded(true)} />

        {loaded && (
          <>
            <Cursor />
            <ProgressBar />
            <ParallaxBg />
            <Navbar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={
                <main className="relative z-10 pt-28">
                  <Blog standalone />
                </main>
              } />
              <Route path="/blog/:slug" element={
                <main className="relative z-10 pt-28">
                  <BlogPost />
                </main>
              } />
            </Routes>

            <Footer />
          </>
        )}
      </BrowserRouter>
    </HelmetProvider>
  );
}
