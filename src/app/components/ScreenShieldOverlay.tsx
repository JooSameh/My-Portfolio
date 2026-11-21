import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, EyeOff, Terminal, RefreshCw } from 'lucide-react';

type TriggerReason = 'focus_lost' | 'shortcut' | 'cursor_exit';

export function ScreenShieldOverlay() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [triggerReason, setTriggerReason] = useState<TriggerReason>('focus_lost');

  const overwriteClipboard = useCallback(() => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(
          'SECURITY POLICY: Screen capture and recording are disabled on Youssef Sameh Portfolio.'
        ).catch(() => {});
      }
    } catch {}
  }, []);

  const engageShield = useCallback((reason: TriggerReason) => {
    // 0ms synchronous DOM class injection — blacks out main/header/footer BEFORE React re-renders
    // or Windows DWM (Win+G, Win+Shift+S, PrintScreen, Snipping Tool) can grab the framebuffer
    document.documentElement.classList.add('cyber-shield-locked');
    setTriggerReason(reason);
    setIsShieldActive(true);
  }, []);

  const handleDismiss = useCallback(() => {
    document.documentElement.classList.remove('cyber-shield-locked');
    setIsShieldActive(false);
  }, []);

  useEffect(() => {
    // 1. Loss of window focus (Snipping Tool window, Xbox Game Bar Win+G overlay, Alt+Tab, OBS)
    const handleBlur = () => {
      engageShield('focus_lost');
    };

    // 2. Tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        engageShield('focus_lost');
      }
    };

    // 3. Cursor leaving browser viewport (pre-emptively locks screen when moving cursor to click Snipping Tool "New" or taskbar)
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight ||
        !e.relatedTarget
      ) {
        engageShield('cursor_exit');
      }
    };

    // 4. Pre-emptive 0ms keydown & keyup interception
    // Important: Windows intercepts Win+G and Win+Shift+S at the OS kernel level when 'G' or 'S' is pressed,
    // and only sends 'PrintScreen' to the browser on KEYUP.
    // By locking the screen the instant 'Meta' (Win/Cmd) or 'Alt' or 'PrintScreen' is touched on keydown/keyup,
    // the DOM is blacked out milliseconds BEFORE the user finishes pressing '+ G' or '+ Shift + S'.
    const isCaptureKey = (e: KeyboardEvent) => {
      const key = e.key || '';
      const code = e.code || '';

      // Direct PrintScreen (Windows often fires this on keyup with keyCode 44)
      if (
        key === 'PrintScreen' ||
        code === 'PrintScreen' ||
        e.keyCode === 44 ||
        e.which === 44
      ) {
        return true;
      }

      // Pre-emptive Windows / Command key touch (catches Win+G, Win+Alt+R, Win+Shift+S, Win+PrtScn, Cmd+Shift+3/4/5)
      if (
        key === 'Meta' ||
        key === 'OS' ||
        code === 'MetaLeft' ||
        code === 'MetaRight' ||
        code === 'OSLeft' ||
        code === 'OSRight' ||
        e.metaKey
      ) {
        return true;
      }

      // Pre-emptive Alt key touch (catches Alt+PrtScn, Win+Alt+R Game Bar Recording, Alt+Tab)
      if (key === 'Alt' || code === 'AltLeft' || code === 'AltRight' || e.altKey) {
        return true;
      }

      // Ctrl + Shift combinations or Ctrl + P (Print / Save PDF)
      if (e.ctrlKey && (e.shiftKey || key.toLowerCase() === 'p' || key.toLowerCase() === 's')) {
        return true;
      }

      // Function keys commonly mapped to third-party screen capture tools (ShareX, Lightshot, Greenshot, Fraps)
      if (['F9', 'F10', 'F11', 'F12'].includes(key)) {
        return true;
      }

      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCaptureKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        engageShield('shortcut');
        overwriteClipboard();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isCaptureKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        engageShield('shortcut');
        overwriteClipboard();
      }
    };

    // 5. High-frequency focus transition watchdog (catches OS overlays & focus steals after document was focused)
    let wasFocused = document.hasFocus();
    const focusWatchdog = window.setInterval(() => {
      const currentlyFocused = document.hasFocus();
      if (document.hidden) {
        engageShield('focus_lost');
      } else if (wasFocused && !currentlyFocused) {
        engageShield('focus_lost');
      }
      wasFocused = currentlyFocused;
    }, 120);

    window.addEventListener('blur', handleBlur, true);
    document.addEventListener('visibilitychange', handleVisibilityChange, true);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave, true);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.clearInterval(focusWatchdog);
      window.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [engageShield, overwriteClipboard]);

  const reasonMessage =
    triggerReason === 'shortcut'
      ? 'System shortcut or capture key detected (Win / Game Bar / Snipping / PrintScreen). Display immediately blacked out.'
      : triggerReason === 'cursor_exit'
      ? 'Pointer exited active viewport boundary. Display locked to prevent external Snipping Tool or recording capture.'
      : 'Window focus departed or external overlay detected. Display obscured to prevent screen recording and capture.';

  return (
    <AnimatePresence>
      {isShieldActive && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[99999] bg-[#050811] flex items-center justify-center p-4 cursor-pointer select-none"
        >
          {/* Cyberpunk Animated Matrix Grid */}
          <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

          {/* Central Shield Card */}
          <div
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
              <span>ZERO-LATENCY DEFENSE • DISPLAY BLACKOUT</span>
            </div>

            <h3 className="text-2xl font-bold text-white orbitron mb-3 tracking-wide">
              SECURITY SHIELD <span className="neon-text-blue">LOCKED</span>
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 fira-code">
              {reasonMessage}
            </p>

            {/* Terminal status box */}
            <div className="bg-[#03050a] p-3 rounded-lg border border-white/10 text-xs text-left fira-code text-gray-400 mb-6 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00F5FF]">
                <Terminal size={13} />
                <span>CYBER DEFENSE SYSTEM v3.0 (0ms DOM BLACKOUT)</span>
              </div>
              <div className="text-gray-500">
                &gt; CAPTURE_INTERCEPT: <span className="text-[#39FF14]">ENGAGED ({triggerReason.toUpperCase()})</span>
              </div>
              <div className="text-gray-500">
                &gt; MANUAL_UNLOCK_REQUIRED: <span className="text-[#00F5FF]">TRUE (ANTI-GAMEBAR)</span>
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
              Manual click required to unlock display
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
