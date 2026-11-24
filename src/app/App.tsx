import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Preloader } from './components/Preloader';
import { ScreenShieldOverlay } from './components/ScreenShieldOverlay';
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp } from 'lucide-react';

const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));
const Education = lazy(() => import('./components/Education').then((m) => ({ default: m.Education })));
const Experience = lazy(() => import('./components/Experience').then((m) => ({ default: m.Experience })));
const Projects = lazy(() => import('./components/Projects').then((m) => ({ default: m.Projects })));
const Certifications = lazy(() => import('./components/Certifications').then((m) => ({ default: m.Certifications })));
const Skills = lazy(() => import('./components/Skills').then((m) => ({ default: m.Skills })));
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })));
const Toaster = lazy(() => import('./components/ui/sonner').then((m) => ({ default: m.Toaster })));

function DeferredSection({
  id,
  minHeight = 'min-h-[800px]',
  rootMargin = '200px',
  children,
}: {
  id?: string;
  minHeight?: string;
  rootMargin?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const el = ref.current;
    if (!el) return;

    if (id && window.location.hash === `#${id}`) {
      setShouldLoad(true);
      return;
    }

    const onHashChange = () => {
      if (id && window.location.hash === `#${id}`) {
        setShouldLoad(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [id, rootMargin, shouldLoad]);

  return (
    <div id={id} ref={ref} className={shouldLoad ? undefined : minHeight}>
      {shouldLoad ? (
        <Suspense fallback={<div className={minHeight} aria-hidden="true" />}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
}

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mountToaster, setMountToaster] = useState(false);

  useEffect(() => {
    // Ensure any lingering lock class is cleared
    document.documentElement.classList.remove('cyber-shield-locked');

    const enableToaster = () => setMountToaster(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setMountToaster(true);
    };

    // 1. Prevent Right-Click on the entire website except within form inputs
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
      }
    };

    const POLICY_MESSAGE = 'SECURITY POLICY: Screen capture is protected on Youssef EL-Gendy Portfolio.';

    // 2. Prevent copying text or assets and overwrite clipboard with policy message
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', POLICY_MESSAGE);
      }
    };

    // 3. Prevent cutting text
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', POLICY_MESSAGE);
      }
    };

    // 4. Prevent text selection
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
      }
    };

    // 5. Prevent dragging images or text
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 6. Block copy shortcuts, view-source (Ctrl+U), DevTools (F12 / Ctrl+Shift+I/J/C/K), and save/print
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const code = e.code || '';
      const keyLower = (e.key || '').toLowerCase();
      const kc = e.keyCode || e.which;

      const blockEvent = () => {
        e.preventDefault();
        e.stopPropagation();
      };

      // F12 (DevTools)
      if (code === 'F12' || keyLower === 'f12' || kc === 123) {
        blockEvent();
        return;
      }

      // View Source (Ctrl/Cmd + U), Save Page (Ctrl/Cmd + S), Print (Ctrl/Cmd + P)
      if (
        isCtrlOrMeta &&
        (code === 'KeyU' || kc === 85 || keyLower === 'u' ||
         code === 'KeyS' || kc === 83 || keyLower === 's' ||
         code === 'KeyP' || kc === 80 || keyLower === 'p')
      ) {
        blockEvent();
        return;
      }

      // DevTools Inspect / Console / Element Picker
      if (
        isCtrlOrMeta &&
        (e.shiftKey || e.altKey) &&
        (code === 'KeyI' || kc === 73 || keyLower === 'i' ||
         code === 'KeyJ' || kc === 74 || keyLower === 'j' ||
         code === 'KeyC' || kc === 67 || keyLower === 'c' ||
         code === 'KeyK' || kc === 75 || keyLower === 'k' ||
         code === 'KeyU' || kc === 85 || keyLower === 'u')
      ) {
        blockEvent();
        return;
      }

      // Copy & Select-all outside form inputs (works in Arabic & English keyboard layouts)
      if (
        isCtrlOrMeta &&
        !isInput &&
        (code === 'KeyC' || kc === 67 || keyLower === 'c' ||
         code === 'KeyA' || kc === 65 || keyLower === 'a' ||
         code === 'KeyX' || kc === 88 || keyLower === 'x')
      ) {
        blockEvent();
        return;
      }

      // PrintScreen clipboard protection
      if (e.key === 'PrintScreen' || code === 'PrintScreen' || kc === 44) {
        blockEvent();
        try {
          document.execCommand('copy');
          navigator.clipboard?.writeText(POLICY_MESSAGE).catch(() => {});
        } catch {}
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code || '';
      const kc = e.keyCode || e.which;
      if (e.key === 'PrintScreen' || code === 'PrintScreen' || kc === 44) {
        e.preventDefault();
        e.stopPropagation();
        try {
          document.execCommand('copy');
          navigator.clipboard?.writeText(POLICY_MESSAGE).catch(() => {});
        } catch {}
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointerdown', enableToaster, { once: true, passive: true });
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('dragstart', handleDragStart, true);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', enableToaster);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#E2E8F0] overflow-x-hidden">
      <Preloader />
      <ScreenShieldOverlay />
      <Header />
      <main>
        <Hero />
        <DeferredSection id="about" rootMargin="0px">
          <About />
        </DeferredSection>
        <DeferredSection id="education">
          <Education />
        </DeferredSection>
        <DeferredSection id="experience">
          <Experience />
        </DeferredSection>
        <DeferredSection id="projects">
          <Projects />
        </DeferredSection>
        <DeferredSection id="certifications">
          <Certifications />
        </DeferredSection>
        <DeferredSection id="skills">
          <Skills />
        </DeferredSection>
        <DeferredSection id="contact">
          <Contact />
        </DeferredSection>
      </main>
      <DeferredSection minHeight="min-h-[180px]">
        <Footer />
      </DeferredSection>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-50 w-12 h-12 glass-strong rounded-full flex items-center justify-center border border-[#00F5FF]/40 hover:neon-blue hover:scale-110 active:scale-90 transition-all duration-200"
        >
          <ArrowUp size={20} className="text-[#00F5FF]" />
        </button>
      )}

      {mountToaster && (
        <Suspense fallback={null}>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 245, 255, 0.3)',
                color: '#E2E8F0',
                borderRadius: '12px',
              },
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
