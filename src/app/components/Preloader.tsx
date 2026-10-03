import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Terminal } from 'lucide-react';

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0F1C]"
        >
          {/* Cyber grid background */}
          <div className="absolute inset-0 cyber-grid opacity-20" />
          
          {/* Glowing orb */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-30"
            style={{ 
              background: 'radial-gradient(circle, rgba(0, 245, 255, 0.4) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative z-10 text-center">
            {/* Animated Shield Icon */}
            <motion.div
              className="flex justify-center mb-8"
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 glass-strong rounded-2xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(0, 245, 255, 0.3)',
                      '0 0 60px rgba(57, 255, 20, 0.3)',
                      '0 0 30px rgba(0, 245, 255, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="text-[#00F5FF]" size={48} />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#39FF14] rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl text-white mb-3 orbitron">
                Initializing <span className="neon-text-blue">Security Protocols</span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-[#94A3B8]">
                <Terminal size={16} className="text-[#00F5FF]" />
                <span className="fira-code text-sm">Loading cybersecurity portfolio...</span>
              </div>
            </motion.div>

            {/* Loading Bar */}
            <div className="mt-8 w-64 mx-auto">
              <div className="h-1 glass rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00F5FF] to-[#39FF14]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Binary code animation */}
            <motion.div
              className="mt-6 fira-code text-xs text-[#00F5FF]/50"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              01001000 01100101 01101100 01101100 01101111
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
