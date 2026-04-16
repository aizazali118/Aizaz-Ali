import { useState } from 'react';
import Preloader    from './components/Preloader';
import Cursor       from './components/Cursor';
import ProgressBar  from './components/ProgressBar';
import CodeBg       from './components/CodeBg';
import ParallaxBg   from './components/ParallaxBg';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Services     from './components/Services';
import Pricing      from './components/Pricing';
import Portfolio    from './components/Portfolio';
import Contact      from './components/Contact';
import Footer       from './components/Footer';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* ── Preloader (shows on every refresh) ── */}
      <Preloader onDone={() => setLoaded(true)} />

      {/* ── Only render site after preloader exits ── */}
      {loaded && (
        <>
          {/* Custom cursor */}
          <Cursor />

          {/* Scroll-progress bar */}
          <ProgressBar />

          {/* Code rain canvas (z-1, behind everything) */}
          <CodeBg />

          {/* Gradient orb parallax (z-2) */}
          <ParallaxBg />

          {/* Navigation */}
          <Navbar />

          {/* Page content — sections have semi-transparent bg so code shows through edges */}
          <main className="relative z-10">
            <Hero />
            <About />
            <Services />
            <Pricing />
            <Portfolio />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </>
  );
}
