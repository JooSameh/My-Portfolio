import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, EyeOff, Terminal, CheckCircle2 } from 'lucide-react';

type TriggerReason = 'focus_lost' | 'shortcut' | 'cursor_exit';

export function ScreenShieldOverlay() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [triggerReason, setTriggerReason] = useState<TriggerReason>('focus_lost');

  // Track lock state synchronously so event listeners have 0ms accuracy
  const isLockedRef = useRef(false);
  const lockReasonRef = useRef<TriggerReason>('focus_lost');
  const lockTimestampRef = useRef<number>(0);
  const isCursorInsideRef = useRef<boolean>(true);
  const reEntryPosRef = useRef<{ x: number; y: number } | null>(null);

  const overwriteClipboard = useCallback(() => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(
          'SECURITY POLICY: Screen capture is protected on Youssef Sameh Portfolio.'
        ).catch(() => {});
      }
    } catch {}
  }, []);

  const restoreDisplay = useCallback(() => {
    isLockedRef.current = false;
    reEntryPosRef.current = null;
    document.documentElement.classList.remove('cyber-shield-locked');
    setIsShieldActive(false);
  }, []);

  const engageShield = useCallback((reason: TriggerReason) => {
    // 0ms synchronous DOM blackout BEFORE Snipping Tool "New" or Win+G can grab the framebuffer
    document.documentElement.classList.add('cyber-shield-locked');
    isLockedRef.current = true;
    lockReasonRef.current = reason;
    lockTimestampRef.current = performance.now();
    reEntryPosRef.current = null;
    setTriggerReason(reason);
    setIsShieldActive(true);
  }, []);

  useEffect(() => {
    // 1. Window blur (switching to Snipping Tool window, OBS, external recorder, Alt+Tab)
    const handleBlur = () => {
      engageShield('focus_lost');
    };

    // 2. Tab / App visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        engageShield('focus_lost');
      } else if (document.hasFocus() && lockReasonRef.current !== 'shortcut') {
        restoreDisplay();
      }
    };

    // 3. Desktop Pointer Exit Tripwire (CRITICAL for Snipping Tool "New" button):
    // When Snipping Tool is floating on screen and the user moves the mouse cursor off the webpage
    // onto the Snipping Tool window to click "New", Windows freezes the screen on "New" mousedown
    // BEFORE firing window.blur!
    // By locking at 0ms on desktop mouseleave (before the cursor even reaches the "New" button),
    // clicking "New" in Snipping Tool only captures the black shield!
    const handleMouseLeave = (e: MouseEvent) => {
      // Only apply cursor-exit tripwire on desktop devices with a fine pointer (never on mobile touch)
      if (!window.matchMedia('(pointer: fine)').matches) return;

      if (
        e.relatedTarget === null ||
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        isCursorInsideRef.current = false;
        engageShield('cursor_exit');
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isCursorInsideRef.current = true;
      reEntryPosRef.current = { x: e.clientX, y: e.clientY };
    };

    // 4. Smart Auto-Restore on genuine user return inside the webpage:
    // - NOTE: No 1-second timer is used! Waiting in Win+G or Snipping Tool will NEVER unlock the screen.
    // - If locked by shortcut (Win+G / Win+Shift+S / PrintScreen), require a real scroll (wheel/touchmove)
    //   or click (pointerdown) inside the page after closing Win+G so the shield never vanishes while Win+G is open.
    // - If locked by cursor_exit or focus_lost (Snipping Tool), moving the mouse cursor back inside the
    //   focused webpage (over 35px distance) or scrolling/clicking automatically restores the display!
    const handleMouseMove = (e: MouseEvent) => {
      isCursorInsideRef.current = true;
      if (!isLockedRef.current) return;

      // Must be focused and visible
      if (document.hidden || !document.hasFocus()) return;

      // If locked by keyboard shortcut (e.g., Win+G), do NOT unlock on minor mouse movement;
      // require scroll or click so Win+G overlay can never accidentally unmask the page.
      if (lockReasonRef.current === 'shortcut') return;

      // Require at least 300ms since lock and 35px of intentional cursor travel inside the focused page
      if (performance.now() - lockTimestampRef.current < 300) return;

      if (!reEntryPosRef.current) {
        reEntryPosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const dx = e.clientX - reEntryPosRef.current.x;
      const dy = e.clientY - reEntryPosRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 35) {
        restoreDisplay();
      }
    };

    const handleScrollOrClickRestore = () => {
      if (!isLockedRef.current) return;
      if (document.hidden || !document.hasFocus()) return;
      // Ignore accidental events in the first 350ms of shortcut press
      if (performance.now() - lockTimestampRef.current < 350) return;
      restoreDisplay();
    };

    // 5. Pre-emptive 0ms Capture Shortcut Interception (Win+G, Win+Shift+S, PrintScreen, Alt+PrtScn)
    // NO auto-restore timer is attached, so the shield stays locked indefinitely while Win+G is open!
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

      // Pre-emptive Windows / Command key (catches Win+G, Win+Shift+S, Win+Alt+R, Win+PrtScn, Cmd+Shift+3/4/5)
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

      // Pre-emptive Alt key (catches Alt+PrtScn, Win+Alt+R Game Bar record, Alt+Tab)
      if (key === 'Alt' || code === 'AltLeft' || code === 'AltRight' || e.altKey) {
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

    // 6. High-frequency focus transition watchdog (100ms)
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
    document.documentElement.addEventListener('mouseenter', handleMouseEnter, true);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter, true);
      window.removeEventListener('mousemove', handleMouseMove);
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
              {triggerReason === 'shortcut'
                ? 'Capture shortcut intercepted (Win+G / Win+Shift+S / PrintScreen). Scroll or click anywhere on the page once you return.'
                : triggerReason === 'cursor_exit'
                ? 'Cursor exited webpage boundary (Snipping Tool / External App protection). Move cursor back inside the page to auto-restore.'
                : 'External capture tool or window active. Return to the webpage to automatically restore display.'}
            </p>

            {/* Terminal status box */}
            <div className="bg-[#03050a] p-3 rounded-lg border border-white/10 text-xs text-left fira-code text-gray-400 mb-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00F5FF]">
                <Terminal size={13} />
                <span>SMART CYBER SHIELD v4.0 (ANTI-SNIP & ANTI-GAMEBAR)</span>
              </div>
              <div className="text-gray-500">
                &gt; CAPTURE_INTERCEPT: <span className="text-[#39FF14]">LOCKED ({triggerReason.toUpperCase()})</span>
              </div>
              <div className="text-gray-500">
                &gt; RESTORE_MODE: <span className="text-[#00F5FF]">AUTO ON SCROLL / CLICK / CURSOR RETURN</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-[#39FF14] fira-code">
              <CheckCircle2 size={14} />
              <span>Scroll, click, or move cursor inside page to resume</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
