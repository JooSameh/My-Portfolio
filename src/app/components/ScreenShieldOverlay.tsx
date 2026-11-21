import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, EyeOff, Terminal, RefreshCw } from 'lucide-react';

type TriggerReason = 'focus_lost' | 'shortcut' | 'cursor_exit' | 'mobile_gesture';

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
    // or OS capture tools (Win+G, Snipping Tool, 3-Finger Swipe, Palm Swipe, Control Center) grab the frame
    document.documentElement.classList.add('cyber-shield-locked');
    setTriggerReason(reason);
    setIsShieldActive(true);
  }, []);

  const handleDismiss = useCallback(() => {
    document.documentElement.classList.remove('cyber-shield-locked');
    setIsShieldActive(false);
  }, []);

  useEffect(() => {
    // 1. Loss of window focus (Snipping Tool, Xbox Game Bar Win+G, Mobile Notification Shade / Control Center / App Switcher)
    const handleBlur = () => {
      engageShield('focus_lost');
    };

    // 2. Tab visibility & mobile lifecycle state changes (App Switcher, Home button, Screen Lock, Split-screen)
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState !== 'visible') {
        engageShield('focus_lost');
      }
    };

    const handlePageHideOrFreeze = () => {
      engageShield('focus_lost');
    };

    // 3. Cursor leaving desktop browser viewport (pre-emptively locks screen when moving cursor to click Snipping Tool)
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

    // 4. Mobile Screenshot Gesture & OS Interrupt Interception (Android & iOS)
    // - Catches 2-finger & 3-finger screenshot swipes (Xiaomi, Realme, Oppo, Vivo, OnePlus, Motorola) at 0ms on touchstart
    // - Catches Samsung Palm Swipe to Capture (large capacitive touch radiusX / radiusY or high force/3D touch)
    // - Catches OS touch stream cancellation (touchcancel / pointercancel) fired when iOS/Android intercepts
    //   touches for Control Center, Notification Center, AssistiveTouch, or Smart Select screenshot overlays
    let longPressTimer: number | null = null;
    let touchStartPos: { x: number; y: number } | null = null;

    const clearLongPressTimer = () => {
      if (longPressTimer !== null) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Multi-finger touch (2 or 3+ fingers used for 3-finger screenshot swipe or 2-finger capture gestures)
      if (e.touches.length >= 2) {
        clearLongPressTimer();
        engageShield('mobile_gesture');
        overwriteClipboard();
        return;
      }

      // Check for Palm Swipe (Samsung Galaxy wide palm capacitive contact) or 3D/Haptic Force Touch
      const touch = e.touches[0];
      if (touch) {
        const radiusX = (touch as Touch & { radiusX?: number }).radiusX || 0;
        const radiusY = (touch as Touch & { radiusY?: number }).radiusY || 0;
        const force = (touch as Touch & { force?: number }).force || 0;

        // Palm swipe covers a wide contact area on the digitizer (> 42px radius)
        if (radiusX > 42 || radiusY > 42 || (force > 0.9 && radiusX > 28)) {
          clearLongPressTimer();
          engageShield('mobile_gesture');
          overwriteClipboard();
          return;
        }

        // Stationary long-press trap (blocks mobile long-press image/page capture menus unless inside an input)
        const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (targetTag !== 'input' && targetTag !== 'textarea' && targetTag !== 'button' && targetTag !== 'a') {
          touchStartPos = { x: touch.clientX, y: touch.clientY };
          clearLongPressTimer();
          longPressTimer = window.setTimeout(() => {
            engageShield('mobile_gesture');
          }, 550);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        clearLongPressTimer();
        engageShield('mobile_gesture');
        overwriteClipboard();
        return;
      }

      const touch = e.touches[0];
      if (touch) {
        const radiusX = (touch as Touch & { radiusX?: number }).radiusX || 0;
        const radiusY = (touch as Touch & { radiusY?: number }).radiusY || 0;
        if (radiusX > 45 || radiusY > 45) {
          clearLongPressTimer();
          engageShield('mobile_gesture');
          return;
        }

        // Cancel stationary long-press timer if the user is just normally scrolling with 1 finger
        if (touchStartPos) {
          const dx = Math.abs(touch.clientX - touchStartPos.x);
          const dy = Math.abs(touch.clientY - touchStartPos.y);
          if (dx > 12 || dy > 12) {
            clearLongPressTimer();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      clearLongPressTimer();
      touchStartPos = null;
    };

    // Critical for Mobile: When the OS steals a gesture (3-finger screenshot, pulling down Control Center / Notification bar,
    // Samsung Edge Panel, or iOS AssistiveTouch), the browser immediately fires `touchcancel` / `pointercancel`.
    const handleTouchOrPointerCancel = () => {
      clearLongPressTimer();
      engageShield('mobile_gesture');
      overwriteClipboard();
    };

    // 5. Pre-emptive 0ms Desktop & Mobile Hardware Key Interception
    const isCaptureKey = (e: KeyboardEvent) => {
      const key = e.key || '';
      const code = e.code || '';

      // Direct PrintScreen / Volume+Power key events if exposed by WebView
      if (
        key === 'PrintScreen' ||
        code === 'PrintScreen' ||
        e.keyCode === 44 ||
        e.which === 44 ||
        key === 'VolumeDown' ||
        key === 'VolumeUp' ||
        key === 'Power'
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

      // Function keys commonly mapped to third-party screen capture tools
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

    // 6. High-frequency focus transition watchdog
    let wasFocused = document.hasFocus();
    const focusWatchdog = window.setInterval(() => {
      const currentlyFocused = document.hasFocus();
      if (document.hidden) {
        engageShield('focus_lost');
      } else if (wasFocused && !currentlyFocused) {
        engageShield('focus_lost');
      }
      wasFocused = currentlyFocused;
    }, 100);

    window.addEventListener('blur', handleBlur, true);
    document.addEventListener('visibilitychange', handleVisibilityChange, true);
    window.addEventListener('pagehide', handlePageHideOrFreeze, true);
    document.addEventListener('freeze', handlePageHideOrFreeze, true);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave, true);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    // Mobile touch & gesture capture-phase listeners
    window.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true });
    window.addEventListener('touchend', handleTouchEnd, { capture: true, passive: true });
    window.addEventListener('touchcancel', handleTouchOrPointerCancel, { capture: true, passive: true });
    window.addEventListener('pointercancel', handleTouchOrPointerCancel, { capture: true, passive: true });

    return () => {
      clearLongPressTimer();
      window.clearInterval(focusWatchdog);
      window.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      window.removeEventListener('pagehide', handlePageHideOrFreeze, true);
      document.removeEventListener('freeze', handlePageHideOrFreeze, true);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);

      window.removeEventListener('touchstart', handleTouchStart, true);
      window.removeEventListener('touchmove', handleTouchMove, true);
      window.removeEventListener('touchend', handleTouchEnd, true);
      window.removeEventListener('touchcancel', handleTouchOrPointerCancel, true);
      window.removeEventListener('pointercancel', handleTouchOrPointerCancel, true);
    };
  }, [engageShield, overwriteClipboard]);

  const reasonMessage =
    triggerReason === 'shortcut'
      ? 'System shortcut or capture key detected (Win / Game Bar / Snipping / PrintScreen). Display immediately blacked out.'
      : triggerReason === 'mobile_gesture'
      ? 'Mobile capture gesture or OS touch interrupt detected (Multi-Finger Swipe / Palm Swipe / Control Center). Display locked.'
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
                <span>CYBER DEFENSE SYSTEM v3.5 (DESKTOP + MOBILE)</span>
              </div>
              <div className="text-gray-500">
                &gt; CAPTURE_INTERCEPT: <span className="text-[#39FF14]">ENGAGED ({triggerReason.toUpperCase()})</span>
              </div>
              <div className="text-gray-500">
                &gt; MANUAL_UNLOCK_REQUIRED: <span className="text-[#00F5FF]">TRUE (0ms DOM BLACKOUT)</span>
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
              Manual tap/click required to unlock display
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
