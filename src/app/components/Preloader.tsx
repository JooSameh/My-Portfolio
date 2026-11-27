import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Shield, Terminal } from 'lucide-react';

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <m.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0F1C]"
          style={{ willChange: 'opacity' }}
        >
          <div className="absolute inset-0 cyber-grid opacity-20" />

          <div
            className="absolute w-[380px] h-[380px] rounded-full opacity-30 pointer-events-none animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0, 245, 255, 0.4) 0%, transparent 70%)',
              filter: 'blur(55px)',
            }}
          />

          <div className="relative z-10 text-center px-4">
            <m.div
              className="flex justify-center mb-8"
              style={{ willChange: 'transform' }}
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            >
              <div className="relative">
                <div className="w-24 h-24 glass-strong rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,245,255,0.35)]">
                  <Shield className="text-[#00F5FF]" size={48} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#39FF14] rounded-full shadow-[0_0_16px_rgba(57,255,20,0.6)] animate-pulse" />
              </div>
            </m.div>

            <div>
              <h2 className="text-3xl text-white mb-3 orbitron">
                Initializing <span className="neon-text-blue">Security Protocols</span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-[#94A3B8]">
                <Terminal size={16} className="text-[#00F5FF]" />
                <span className="fira-code text-sm">Loading cybersecurity portfolio...</span>
              </div>
            </div>

            <div className="mt-8 w-64 mx-auto">
              <div className="h-1 glass rounded-full overflow-hidden">
                <m.div
                  className="h-full w-full origin-left bg-gradient-to-r from-[#00F5FF] to-[#39FF14]"
                  style={{ willChange: 'transform' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              </div>
            </div>

            <div className="mt-6 fira-code text-xs text-[#00F5FF]/50 select-none pointer-events-none animate-pulse">
              01001000 01100101 01101100 01101100 01101111
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
