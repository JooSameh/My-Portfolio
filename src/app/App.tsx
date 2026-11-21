import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { Toaster } from './components/ui/sonner';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Ensure any lingering lock class is cleared
    document.documentElement.classList.remove('cyber-shield-locked');

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    // 1. Prevent Right-Click on the entire website except within form inputs
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
      }
    };

    // 2. Prevent copying text or assets
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
      }
    };

    // 3. Prevent cutting text
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
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

    // 6. Block copy shortcuts, source inspection, and save/print attempts silently
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Copy & Select-all outside form inputs
      if (isCtrlOrMeta && !isInput && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
      }

      // Save page (Ctrl/Cmd+S), Print (Ctrl/Cmd+P), View source (Ctrl/Cmd+U)
      if (isCtrlOrMeta && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }

      // F12 or Developer Tools shortcut attempts
      if (e.key === 'F12' || (isCtrlOrMeta && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'c' || e.key === 'C' || e.key === 'j' || e.key === 'J'))) {
        e.preventDefault();
      }

      // Silent PrintScreen clipboard protection (no popup screen)
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText('').catch(() => {});
        } catch {}
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText('').catch(() => {});
        } catch {}
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#E2E8F0] overflow-x-hidden">
      <Preloader />
      <Header />
      <main>
        <Hero />
        <About />
        <Education />
        <Experience />
        <Projects />
        <Certifications />
        <Skills />
        <Contact />
      </main>
      <Footer />
      
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 glass-strong rounded-full flex items-center justify-center border border-[#00F5FF]/40 hover:neon-blue transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} className="text-[#00F5FF]" />
          </motion.button>
        )}
      </AnimatePresence>

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
    </div>
  );
}