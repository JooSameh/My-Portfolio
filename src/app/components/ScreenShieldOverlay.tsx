import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, EyeOff, Terminal, CheckCircle2 } from 'lucide-react';

type TriggerReason = 'focus_lost' | 'shortcut' | 'cursor_exit' | 'recording_blocked';

export function ScreenShieldOverlay() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [triggerReason, setTriggerReason] = useState<TriggerReason>('focus_lost');

  // Track lock state synchronously so event listeners have 0ms accuracy
  const isLockedRef = useRef(false);
  const lockTimestampRef = useRef<number>(0);

  const overwriteClipboard = useCallback(() => {
    const policyText = 'SECURITY POLICY: Screen capture is protected on Youssef EL-Gendy Portfolio.';
    try {
      document.execCommand('copy');
    } catch {}
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(policyText).catch(() => {});
      }
    } catch {}
  }, []);

  const restoreDisplay = useCallback(() => {
    isLockedRef.current = false;
    document.documentElement.classList.remove('cyber-shield-locked');
    setIsShieldActive(false);
  }, []);

  const engageShield = useCallback((reason: TriggerReason) => {
    // 0ms synchronous DOM blackout BEFORE Snipping Tool "New", Win+G, or PrintScreen can grab the frame
    document.documentElement.classList.add('cyber-shield-locked');
    isLockedRef.current = true;
    lockTimestampRef.current = performance.now();
    setTriggerReason(reason);
    setIsShieldActive(true);
  }, []);

  useEffect(() => {
    // 0. Block Browser / WebRTC / Extension Screen Recording APIs (getDisplayMedia & captureStream)
    try {
      if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = async () => {
          engageShield('recording_blocked');
          overwriteClipboard();
          throw new DOMException('Screen recording is disabled by security policy.', 'NotAllowedError');
        };
      }
      if (typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype) {
        HTMLCanvasElement.prototype.captureStream = () => {
          engageShield('recording_blocked');
          throw new DOMException('Canvas stream capture is disabled by security policy.', 'NotAllowedError');
        };
      }
    } catch {}

    // 1. Window blur (switching to Snipping Tool window, OBS, external recorder, Alt+Tab)
    const handleBlur = () => {
      engageShield('focus_lost');
    };

    // 2. Tab / App visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        engageShield('focus_lost');
      }
    };

    // 3. Desktop Pointer Exit Tripwire (locks at 0ms when cursor moves off the page toward Snipping Tool "New")
    const handleMouseLeave = (e: MouseEvent) => {
      if (!window.matchMedia('(pointer: fine)').matches) return;

      if (
        e.relatedTarget === null ||
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        engageShield('cursor_exit');
      }
    };

    // 4. Instant Smooth Restore on Scroll or Click inside the focused webpage (no artificial countdown)
    const handleScrollOrClickRestore = () => {
      if (!isLockedRef.current) return;
      if (document.hidden || !document.hasFocus()) return;
      // Minimal 250ms debounce so the key press itself doesn't immediately unlock
      if (performance.now() - lockTimestampRef.current < 250) return;
      restoreDisplay();
    };

    // 5. Pre-emptive 0ms Capture & Inspection Shortcut Interception (Arabic & English keyboard safe via e.code/e.keyCode)
    const isCaptureKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTypingInForm = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      const key = e.key || '';
      const code = e.code || '';
      const kc = e.keyCode || e.which;

      // PrintScreen (keydown or keyup keyCode 44) — ALWAYS blocked even inside inputs
      if (key === 'PrintScreen' || code === 'PrintScreen' || kc === 44) {
        return true;
      }

      // Pre-emptive Windows / Command key (catches Win+G, Win+Alt+R, Win+Shift+S, Win+PrtScn, Cmd+Shift+3/4/5)
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

      // Function keys (F9-F12 including F12 DevTools keyCode 123) — ALWAYS blocked
      if (['F9', 'F10', 'F11', 'F12'].includes(code) || ['F9', 'F10', 'F11', 'F12'].includes(key) || kc === 123) {
        return true;
      }

      // Ctrl + U (View Source), Ctrl + S (Save), Ctrl + P (Print) — ALWAYS blocked in Arabic & English
      if (
        e.ctrlKey &&
        (code === 'KeyU' || kc === 85 ||
         code === 'KeyS' || kc === 83 ||
         code === 'KeyP' || kc === 80)
      ) {
        return true;
      }

      // Explicit DevTools / Recorder Ctrl + Shift combinations (I, J, C, K, R, E, S) — ALWAYS blocked
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (code === 'KeyI' || kc === 73 ||
         code === 'KeyJ' || kc === 74 ||
         code === 'KeyC' || kc === 67 ||
         code === 'KeyK' || kc === 75 ||
         code === 'KeyR' || kc === 82 ||
         code === 'KeyE' || kc === 69 ||
         code === 'KeyS' || kc === 83)
      ) {
        return true;
      }

      // Allow Alt+Shift / Ctrl+Shift keyboard language switching & text selection ONLY while typing inside Contact form inputs
      if (isTypingInForm) {
        if (e.altKey && (code === 'F9' || code === 'F10' || code === 'KeyR' || code === 'PrintScreen')) {
          return true;
        }
        return false;
      }

      // Outside form inputs: pre-emptive Alt key (Win+Alt+R, Alt+F9, Alt+PrtScn, Alt+Tab) & Ctrl+Shift
      if (key === 'Alt' || code === 'AltLeft' || code === 'AltRight' || e.altKey) {
        return true;
      }

      if (e.ctrlKey && e.shiftKey) {
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

    // 6. Focus transition watchdog (100ms)
    let wasFocused = document.hasFocus();
    const focusWatchdog = window.setInterval(() => {
      const currentlyFocused = document.hasFocus();
      if (document.hidden || (wasFocused && !currentlyFocused)) {
        engageShield('focus_lost');
      }
      wasFocused = currentlyFocused;
    }, 100);

    window.addEventListener('blur', handleBlur, true);
    document.addEventListener('visibilitychange', handleVisibilityChange, true);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave, true);
    window.addEventListener('wheel', handleScrollOrClickRestore, { passive: true });
    window.addEventListener('pointerdown', handleScrollOrClickRestore, { passive: true });
    window.addEventListener('touchmove', handleScrollOrClickRestore, { passive: true });
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.clearInterval(focusWatchdog);
      document.documentElement.classList.remove('cyber-shield-locked');
      window.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave, true);
      window.removeEventListener('wheel', handleScrollOrClickRestore);
      window.removeEventListener('pointerdown', handleScrollOrClickRestore);
      window.removeEventListener('touchmove', handleScrollOrClickRestore);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [engageShield, restoreDisplay, overwriteClipboard]);

  return (
    <AnimatePresence>
      {isShieldActive && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          onClick={restoreDisplay}
          onTouchStart={restoreDisplay}
          className="fixed inset-0 z-[99999] bg-[#050811] flex items-center justify-center p-4 select-none cursor-pointer"
        >
          {/* Cyberpunk Animated Matrix Grid */}
          <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

          {/* Central Shield Card */}
          <div className="relative max-w-lg w-full glass-strong p-8 rounded-2xl border border-[#00F5FF]/50 text-center shadow-[0_0_80px_rgba(0,245,255,0.25)] overflow-hidden">
            {/* Holographic Glowing Scanner Ring */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl glass-strong border-2 border-[#00F5FF] flex items-center justify-center relative shadow-[0_0_35px_rgba(0,245,255,0.35)]">
              <ShieldAlert size={40} className="text-[#00F5FF]" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/40 bg-[#00F5FF]/10 text-xs fira-code text-[#00F5FF] mb-4">
              <EyeOff size={14} className="text-[#39FF14]" />
              <span>ZERO-LATENCY SHIELD • DISPLAY PROTECTED</span>
            </div>

            <h3 className="text-2xl font-bold text-white orbitron mb-3 tracking-wide">
              SECURITY SHIELD <span className="neon-text-blue">ACTIVE</span>
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 fira-code">
              {triggerReason === 'recording_blocked'
                ? 'Browser screen recording stream intercepted and blocked by security policy.'
                : triggerReason === 'shortcut'
                ? 'Capture shortcut intercepted (Win+G / Win+Shift+S / PrintScreen).'
                : triggerReason === 'cursor_exit'
                ? 'Cursor exited webpage boundary (Snipping Tool / External App protection).'
                : 'External capture tool or window active. Display obscured to protect portfolio assets.'}
            </p>

            {/* Terminal status box */}
            <div className="bg-[#03050a] p-3 rounded-lg border border-white/10 text-xs text-left fira-code text-gray-400 mb-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00F5FF]">
                <Terminal size={13} />
                <span>SMART CYBER SHIELD (YOUSSEF EL-GENDY)</span>
              </div>
              <div className="text-gray-500">
                &gt; CAPTURE_INTERCEPT: <span className="text-[#39FF14]">LOCKED ({triggerReason.toUpperCase()})</span>
              </div>
              <div className="text-gray-500">
                &gt; RESTORE_MODE: <span className="text-[#00F5FF]">INSTANT ON CLICK OR SCROLL</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-[#39FF14] fira-code">
              <CheckCircle2 size={14} />
              <span>Scroll or click anywhere inside the page to resume immediately</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
