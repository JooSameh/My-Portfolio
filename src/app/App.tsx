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
import { ScreenShieldOverlay } from './components/ScreenShieldOverlay';
import { useScreenProtection } from './hooks/useScreenProtection';
import { Toaster } from './components/ui/sonner';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isShieldActive, shieldReason, dismissShield } = useScreenProtection();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    // 1. Prevent Right-Click on any image or protected element
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'IMG' ||
        target?.closest('img') ||
        target?.classList.contains('image-shield') ||
        target?.closest('.image-shield') ||
        target?.closest('.protected-media')
      ) {
        e.preventDefault();
      }
    };

    // 2. Prevent dragging images to desktop / folders across Mac / Windows
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'IMG' || target?.closest('img')) {
        e.preventDefault();
      }
    };

    // 3. Block Save Webpage (Ctrl/Cmd+S) and Print (Ctrl/Cmd+P) to protect assets
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#E2E8F0] overflow-x-hidden">
      <ScreenShieldOverlay isActive={isShieldActive} reason={shieldReason} onDismiss={dismissShield} />
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