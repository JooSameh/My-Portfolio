import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, EyeOff, Terminal, CheckCircle2, Lock } from 'lucide-react';

type TriggerReason = 'focus_lost' | 'shortcut' | 'cursor_exit' | 'recording_blocked';

export function ScreenShieldOverlay() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [triggerReason, setTriggerReason] = useState<TriggerReason>('focus_lost');
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Track lock state synchronously so event listeners have 0ms accuracy
  const isLockedRef = useRef(false);
  const lockReasonRef = useRef<TriggerReason>('focus_lost');
  const unlockAllowedAtRef = useRef<number>(0);

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
    if (performance.now() < unlockAllowedAtRef.current) return;
    isLockedRef.current = false;
    setCooldownSeconds(0);
    document.documentElement.classList.remove('cyber-shield-locked');
    setIsShieldActive(false);
  }, []);

  const engageShield = useCallback((reason: TriggerReason) => {
    // 0ms synchronous DOM blackout BEFORE Snipping Tool "New", Win+G, or Video Recorders can grab the framebuffer
    document.documentElement.classList.add('cyber-shield-locked');
    isLockedRef.current = true;
    lockReasonRef.current = reason;

    // Enforce a 3.5-second anti-recorder hold for shortcuts & focus loss (defeats Snipping Tool 3-2-1 video countdown),
    // and 1.2-second hold for cursor exit
    const holdDurationMs = reason === 'cursor_exit' ? 1200 : 3500;
    unlockAllowedAtRef.current = performance.now() + holdDurationMs;
    setCooldownSeconds(Math.ceil(holdDurationMs / 1000));

    setTriggerReason(reason);
    setIsShieldActive(true);
  }, []);

  // Update visual countdown timer while shield is active
  useEffect(() => {
    if (!isShieldActive) return;
    const interval = window.setInterval(() => {
      const remainingMs = unlockAllowedAtRef.current - performance.now();
      if (remainingMs <= 0) {
        setCooldownSeconds(0);
      } else {
        setCooldownSeconds(Math.ceil(remainingMs / 1000));
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [isShieldActive]);

  useEffect(() => {
    // 0. Block Browser / WebRTC / Extension Video Recording APIs (getDisplayMedia & captureStream)
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

    // 3. Desktop Pointer Exit Tripwire (CRITICAL for Snipping Tool "New" & Video Record toolbar):
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

    // 4. Smart Auto-Restore ONLY on active Scroll or Click inside the focused webpage AFTER anti-recorder cooldown:
    const handleScrollOrClickRestore = () => {
      if (!isLockedRef.current) return;
      if (document.hidden || !document.hasFocus()) return;
      if (performance.now() < unlockAllowedAtRef.current) return;
      restoreDisplay();
    };

    // 5. Pre-emptive 0ms Capture & Video Recording Shortcut Interception
    const isCaptureKey = (e: KeyboardEvent) => {
      const key = e.key || '';
      const code = e.code || '';

      // PrintScreen (keydown or keyup keyCode 44)
      if (
        key === 'PrintScreen' ||
        code === 'PrintScreen' ||
        e.keyCode === 44 ||
        e.which === 44
      ) {
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

      // Pre-emptive Alt key (catches Win+Alt+R video record, Alt+F9 ShadowPlay, Alt+PrtScn, Alt+Tab)
      if (key === 'Alt' || code === 'AltLeft' || code === 'AltRight' || e.altKey) {
        return true;
      }

      // Dedicated video recording function keys (F9, F10, F11, F12)
      if (['F9', 'F10', 'F11', 'F12'].includes(key)) {
        return true;
      }

      // Ctrl + Shift combinations (Ctrl+Shift+R, Ctrl+Shift+E, Ctrl+Shift+S, etc.)
      if (e.ctrlKey && e.shiftKey) {
        return true;
      }

      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCaptureKey(e)) {
        e.preventDefault();
        engageShield('shortcut');
        overwriteClipboard();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isCaptureKey(e)) {
        e.preventDefault();
        engageShield('shortcut');
        overwriteClipboard();
      }
    };

    // 6. High-frequency focus transition watchdog (80ms)
    let wasFocused = document.hasFocus();
    const focusWatchdog = window.setInterval(() => {
      const currentlyFocused = document.hasFocus();
      if (document.hidden || (wasFocused && !currentlyFocused)) {
        engageShield('focus_lost');
      }
      wasFocused = currentlyFocused;
    }, 80);

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
      document.removeEventListener('mouseleave', handleMouseLeave, true);
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
                ? 'Screen recording stream intercepted and blocked by security policy.'
                : triggerReason === 'shortcut'
                ? 'Capture or recording shortcut intercepted (Win+G / Win+Alt+R / Snipping / PrintScreen).'
                : triggerReason === 'cursor_exit'
                ? 'Cursor exited webpage boundary (Snipping Tool / Screen Recorder protection).'
                : 'External capture or recording tool active. Display obscured to protect portfolio assets.'}
            </p>

            {/* Terminal status box */}
            <div className="bg-[#03050a] p-3 rounded-lg border border-white/10 text-xs text-left fira-code text-gray-400 mb-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00F5FF]">
                <Terminal size={13} />
                <span>SMART CYBER SHIELD v4.6 (YOUSSEF EL-GENDY)</span>
              </div>
              <div className="text-gray-500">
                &gt; CAPTURE_INTERCEPT: <span className="text-[#39FF14]">LOCKED ({triggerReason.toUpperCase()})</span>
              </div>
              <div className="text-gray-500">
                &gt; ANTI_RECORDER_HOLD: <span className="text-[#00F5FF]">{cooldownSeconds > 0 ? `LOCKED (${cooldownSeconds}s)` : 'READY TO RESTORE'}</span>
              </div>
            </div>

            {cooldownSeconds > 0 ? (
              <div className="inline-flex items-center gap-2 text-xs text-amber-400 fira-code">
                <Lock size={14} />
                <span>Anti-recorder cooldown active ({cooldownSeconds}s)...</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs text-[#39FF14] fira-code">
                <CheckCircle2 size={14} />
                <span>Scroll or click anywhere inside the page to resume</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
