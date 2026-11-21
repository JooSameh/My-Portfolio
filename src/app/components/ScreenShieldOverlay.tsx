import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, EyeOff, Terminal, RefreshCw } from 'lucide-react';

export function ScreenShieldOverlay() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [triggerReason, setTriggerReason] = useState<'focus_lost' | 'shortcut'>('focus_lost');

  useEffect(() => {
    // 1. Loss of window focus (e.g., Snipping Tool, OBS, Screen Recording, DevTools, Alt-Tab)
    const handleBlur = () => {
      setTriggerReason('focus_lost');
      setIsShieldActive(true);
    };

    // 2. Regain window focus - seamlessly restore display
    const handleFocus = () => {
      setIsShieldActive(false);
    };

    // 3. Tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTriggerReason('focus_lost');
        setIsShieldActive(true);
      }
    };

    // 4. Keystroke detection for Screenshot and Snipping shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        setTriggerReason('shortcut');
        setIsShieldActive(true);
        try {
          navigator.clipboard?.writeText('Security Policy: Screen capture is protected on this portfolio.');
        } catch {}
        return;
      }

      // Windows Snipping Tool (Win + Shift + S) or Mac Screenshot (Cmd + Shift + 3/4/5)
      const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
      if (
        (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4' || e.key === '5') &&
        e.shiftKey &&
        (isMac ? e.metaKey : (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault();
        setTriggerReason('shortcut');
        setIsShieldActive(true);
        try {
          navigator.clipboard?.writeText('Security Policy: Screen capture is protected on this portfolio.');
        } catch {}
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDismiss = () => {
    setIsShieldActive(false);
  };

  return (
    <AnimatePresence>
      {isShieldActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] backdrop-blur-3xl bg-[#0A0F1C]/92 flex items-center justify-center p-4 cursor-pointer select-none"
        >
          {/* Cyberpunk Animated Matrix Grid */}
          <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

          {/* Central Shield Card */}
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative max-w-lg w-full glass-strong p-8 rounded-2xl border border-[#00F5FF]/50 text-center shadow-[0_0_80px_rgba(0,245,255,0.25)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Holographic Glowing Scanner Ring */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-2xl glass-strong border-2 border-[#00F5FF] flex items-center justify-center relative shadow-[0_0_40px_rgba(0,245,255,0.4)]"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0,245,255,0.3)',
                  '0 0 50px rgba(57,255,20,0.4)',
                  '0 0 20px rgba(0,245,255,0.3)'
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <ShieldAlert size={44} className="text-[#00F5FF]" />
              <motion.div 
                className="absolute inset-0 rounded-2xl border border-[#39FF14]"
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/40 bg-[#00F5FF]/10 text-xs fira-code text-[#00F5FF] mb-4">
              <EyeOff size={14} className="text-[#39FF14]" />
              <span>DEFENSE PROTOCOL • DISPLAY OBSCURED</span>
            </div>

            <h3 className="text-2xl font-bold text-white orbitron mb-3 tracking-wide">
              SECURITY SHIELD <span className="neon-text-blue">ACTIVATED</span>
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 fira-code">
              {triggerReason === 'shortcut'
                ? 'Screenshot shortcut captured. Screen capture and recording are disabled for protected credentials.'
                : 'Window focus departed. Display obscured to prevent external recording and snipping tool capture.'}
            </p>

            {/* Terminal status box */}
            <div className="bg-[#050811] p-3 rounded-lg border border-white/10 text-xs text-left fira-code text-gray-400 mb-6 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00F5FF]">
                <Terminal size={13} />
                <span>CYBER DEFENSE SYSTEM v2.4</span>
              </div>
              <div className="text-gray-500">
                &gt; CAPTURE_PROTECTION: <span className="text-[#39FF14]">TRIGGERED</span>
              </div>
              <div className="text-gray-500">
                &gt; ASSET_INTEGRITY: <span className="text-[#00F5FF]">VERIFIED & LOCKED</span>
              </div>
            </div>

            {/* Resume button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-3.5 px-6 rounded-xl glass-strong border border-[#00F5FF]/50 text-[#00F5FF] hover:bg-[#00F5FF]/20 hover:neon-blue orbitron font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,245,255,0.2)]"
            >
              <RefreshCw size={16} />
              <span>CLICK TO RESTORE DISPLAY</span>
            </button>
            <p className="text-[11px] text-gray-500 mt-2.5 fira-code">
              or click anywhere outside to resume browsing
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
