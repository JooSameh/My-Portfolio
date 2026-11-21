import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, EyeOff, Terminal, CheckCircle2 } from 'lucide-react';

type TriggerReason = 'focus_lost' | 'shortcut';

export function ScreenShieldOverlay() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [triggerReason, setTriggerReason] = useState<TriggerReason>('focus_lost');
  const autoRestoreTimerRef = useRef<number | null>(null);

  const clearAutoRestoreTimer = useCallback(() => {
    if (autoRestoreTimerRef.current !== null) {
      window.clearTimeout(autoRestoreTimerRef.current);
      autoRestoreTimerRef.current = null;
    }
  }, []);

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
    clearAutoRestoreTimer();
    document.documentElement.classList.remove('cyber-shield-locked');
    setIsShieldActive(false);
  }, [clearAutoRestoreTimer]);

  const engageShield = useCallback(
    (reason: TriggerReason, autoRestoreMs?: number) => {
      clearAutoRestoreTimer();
      // 0ms synchronous DOM blackout before OS screenshot utility captures the frame
      document.documentElement.classList.add('cyber-shield-locked');
      setTriggerReason(reason);
      setIsShieldActive(true);

      if (autoRestoreMs && autoRestoreMs > 0) {
        autoRestoreTimerRef.current = window.setTimeout(() => {
          if (!document.hidden && document.hasFocus()) {
            restoreDisplay();
          }
        }, autoRestoreMs);
      }
    },
    [clearAutoRestoreTimer, restoreDisplay]
  );

  useEffect(() => {
    // 1. Window blur (switching to Snipping Tool, OBS, external recorder, or mobile app switch)
    const handleBlur = () => {
      engageShield('focus_lost');
    };

    // 2. Window focus — AUTOMATICALLY restore display immediately without clicking any button
    const handleFocus = () => {
      if (!document.hidden) {
        restoreDisplay();
      }
    };

    // 3. Tab / App visibility change — lock when hidden, auto-restore when visible again
    const handleVisibilityChange = () => {
      if (document.hidden) {
        engageShield('focus_lost');
      } else {
        restoreDisplay();
      }
    };

    // 4. Seamless auto-restore if user scrolls, touches, or moves mouse inside the focused page
    const handleUserActivity = () => {
      if (!document.hidden && document.hasFocus()) {
        restoreDisplay();
      }
    };

    // 5. Capture shortcut detection (0ms synchronous blackout + auto-restore after 1.4s)
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

      // Windows / Command key (catches Win+Shift+S, Win+G, Win+Alt+R, Win+PrtScn, Cmd+Shift+3/4/5)
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

      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCaptureKey(e)) {
        e.preventDefault();
        engageShield('shortcut', 1400);
        overwriteClipboard();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isCaptureKey(e)) {
        e.preventDefault();
        engageShield('shortcut', 1200);
        overwriteClipboard();
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('wheel', handleUserActivity, { passive: true });
    window.addEventListener('touchmove', handleUserActivity, { passive: true });

    return () => {
      clearAutoRestoreTimer();
      document.documentElement.classList.remove('cyber-shield-locked');
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('wheel', handleUserActivity);
      window.removeEventListener('touchmove', handleUserActivity);
    };
  }, [engageShield, restoreDisplay, overwriteClipboard, clearAutoRestoreTimer]);

  return (
    <AnimatePresence>
      {isShieldActive && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={restoreDisplay}
          onTouchStart={restoreDisplay}
          onMouseMove={() => {
            if (document.hasFocus() && !document.hidden) {
              restoreDisplay();
            }
          }}
          className="fixed inset-0 z-[99999] bg-[#050811] flex items-center justify-center p-4 select-none"
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
              <span>SMART AUTO-SHIELD • DISPLAY PROTECTED</span>
            </div>

            <h3 className="text-2xl font-bold text-white orbitron mb-3 tracking-wide">
              SECURITY SHIELD <span className="neon-text-blue">ACTIVE</span>
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 fira-code">
              {triggerReason === 'shortcut'
                ? 'Capture shortcut intercepted. Display will automatically restore in a moment.'
                : 'External window or capture tool active. Display automatically restores as soon as you return to the page.'}
            </p>

            {/* Terminal status box */}
            <div className="bg-[#03050a] p-3 rounded-lg border border-white/10 text-xs text-left fira-code text-gray-400 mb-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00F5FF]">
                <Terminal size={13} />
                <span>SMART CYBER SHIELD (AUTO-RESTORE)</span>
              </div>
              <div className="text-gray-500">
                &gt; CAPTURE_PROTECTION: <span className="text-[#39FF14]">ACTIVE</span>
              </div>
              <div className="text-gray-500">
                &gt; AUTO_RECOVERY: <span className="text-[#00F5FF]">ENABLED (NO CLICK NEEDED)</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-[#39FF14] fira-code">
              <CheckCircle2 size={14} />
              <span>Restores automatically upon returning to the page</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
