import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Preloader } from './components/Preloader';
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import { ArrowUp } from 'lucide-react';

const ScreenShieldOverlay = lazy(() =>
  import('./components/ScreenShieldOverlay').then((m) => ({ default: m.ScreenShieldOverlay }))
);
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
  rootMargin = '150px',
  threshold = 0.05,
  children,
}: {
  id?: string;
  minHeight?: string;
  rootMargin?: string;
  threshold?: number;
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
      { rootMargin, threshold }
    );

    observer.observe(el);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [id, rootMargin, threshold, shouldLoad]);

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
  const [mountShield, setMountShield] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('cyber-shield-locked');

    const activateShield = () => setMountShield(true);
    const shieldTimer = window.setTimeout(activateShield, 1000);

    const enableToaster = () => setMountToaster(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setMountToaster(true);
      setMountShield(true);
    };

    const POLICY_MESSAGE = 'SECURITY POLICY: Screen capture is protected on Youssef EL-Gendy Portfolio.';

    const isEditable = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable;
    };

    const handleCopyOrCut = (e: ClipboardEvent) => {
      if (!isEditable(e.target)) {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', POLICY_MESSAGE);
      }
    };

    const handleSelectStart = (e: Event) => {
      if (!isEditable(e.target)) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointerdown', enableToaster, { once: true, passive: true });
    window.addEventListener('pointerdown', activateShield, { once: true, passive: true });
    window.addEventListener('keydown', activateShield, { once: true, capture: true });
    window.addEventListener('touchstart', activateShield, { once: true, passive: true });
    document.addEventListener('copy', handleCopyOrCut, true);
    document.addEventListener('cut', handleCopyOrCut, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('dragstart', handleDragStart, true);

    return () => {
      clearTimeout(shieldTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', enableToaster);
      window.removeEventListener('pointerdown', activateShield);
      window.removeEventListener('keydown', activateShield, true);
      window.removeEventListener('touchstart', activateShield);
      document.removeEventListener('copy', handleCopyOrCut, true);
      document.removeEventListener('cut', handleCopyOrCut, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('dragstart', handleDragStart, true);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-[#0A0F1C] text-[#E2E8F0] overflow-x-hidden">
        <Preloader />
        {mountShield && (
          <Suspense fallback={null}>
            <ScreenShieldOverlay />
          </Suspense>
        )}
        <Header />
        <main>
          <Hero />
          <DeferredSection id="about" rootMargin="0px" threshold={0.05}>
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
    </LazyMotion>
  );
}
