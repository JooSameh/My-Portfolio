import { useState, useEffect, useCallback, useRef } from 'react';
import { ShieldAlert, EyeOff, Terminal, CheckCircle2 } from 'lucide-react';

type TriggerReason = 'shortcut' | 'contextmenu' | 'multitouch' | 'recording_blocked';

export function ScreenShieldOverlay() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [triggerReason, setTriggerReason] = useState<TriggerReason>('shortcut');

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
    document.documentElement.classList.add('cyber-shield-locked');
    isLockedRef.current = true;
    lockTimestampRef.current = performance.now();
    setTriggerReason(reason);
    setIsShieldActive(true);
  }, []);

  useEffect(() => {
    const origGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia?.bind(navigator.mediaDevices);
    const origCaptureStream =
      typeof HTMLCanvasElement !== 'undefined' ? HTMLCanvasElement.prototype.captureStream : undefined;

    try {
      if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = async () => {
          engageShield('recording_blocked');
          overwriteClipboard();
          throw new DOMException('Screen recording is disabled by security policy.', 'NotAllowedError');
        };
      }
      if (origCaptureStream) {
        HTMLCanvasElement.prototype.captureStream = () => {
          engageShield('recording_blocked');
          throw new DOMException('Canvas stream capture is disabled by security policy.', 'NotAllowedError');
        };
      }
    } catch {}

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
        engageShield('contextmenu');
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 3) {
        engageShield('multitouch');
        overwriteClipboard();
      }
    };

    const isActiveCaptureOrInspectKey = (e: KeyboardEvent) => {
      const key = e.key || '';
      const code = e.code || '';
      const kc = e.keyCode || e.which;
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      if (key === 'PrintScreen' || code === 'PrintScreen' || kc === 44) {
        return true;
      }

      if (code === 'F12' || key === 'F12' || kc === 123) {
        return true;
      }

      if (
        isCtrlOrMeta &&
        (e.shiftKey || e.altKey) &&
        (code === 'KeyI' || kc === 73 ||
         code === 'KeyJ' || kc === 74 ||
         code === 'KeyC' || kc === 67 ||
         code === 'KeyK' || kc === 75 ||
         code === 'KeyU' || kc === 85)
      ) {
        return true;
      }

      if (
        isCtrlOrMeta &&
        (code === 'KeyU' || kc === 85 ||
         code === 'KeyS' || kc === 83 ||
         code === 'KeyP' || kc === 80)
      ) {
        return true;
      }

      if (
        e.metaKey &&
        ((e.shiftKey && (code === 'KeyS' || kc === 83 || code === 'Digit3' || code === 'Digit4' || code === 'Digit5')) ||
         code === 'KeyG' || kc === 71 ||
         (e.altKey && (code === 'KeyR' || kc === 82)))
      ) {
        return true;
      }

      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActiveCaptureOrInspectKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        engageShield('shortcut');
        overwriteClipboard();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isActiveCaptureOrInspectKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        engageShield('shortcut');
        overwriteClipboard();
      }
    };

    const handleRestoreGesture = () => {
      if (!isLockedRef.current) return;
      if (performance.now() - lockTimestampRef.current < 250) return;
      restoreDisplay();
    };

    document.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('wheel', handleRestoreGesture, { passive: true });
    window.addEventListener('pointerdown', handleRestoreGesture, { passive: true });

    return () => {
      document.documentElement.classList.remove('cyber-shield-locked');
      document.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('touchstart', handleTouchStart, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('wheel', handleRestoreGesture);
      window.removeEventListener('pointerdown', handleRestoreGesture);

      try {
        if (origGetDisplayMedia && navigator.mediaDevices) {
          navigator.mediaDevices.getDisplayMedia = origGetDisplayMedia;
        }
        if (origCaptureStream && typeof HTMLCanvasElement !== 'undefined') {
          HTMLCanvasElement.prototype.captureStream = origCaptureStream;
        }
      } catch {}
    };
  }, [engageShield, restoreDisplay, overwriteClipboard]);

  const reasonMessage =
    triggerReason === 'recording_blocked'
      ? 'Browser screen recording stream intercepted and blocked by security policy.'
      : triggerReason === 'contextmenu'
      ? 'Right-click inspection is disabled to protect portfolio credentials and assets.'
      : triggerReason === 'multitouch'
      ? '3-finger capture gesture intercepted. Display obscured to protect portfolio assets.'
      : 'Active capture or DevTools shortcut intercepted (PrintScreen / F12 / DevTools / View Source).';

  if (!isShieldActive) return null;

  return (
    <div
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
          <span>ACTIVE DEFENSE SHIELD • DISPLAY PROTECTED</span>
        </div>

        <h3 className="text-2xl font-bold text-white orbitron mb-3 tracking-wide">
          SECURITY SHIELD <span className="neon-text-blue">ACTIVE</span>
        </h3>

        <p className="text-gray-300 text-sm leading-relaxed mb-6 fira-code">
          {reasonMessage}
        </p>

        {/* Terminal status box */}
        <div className="bg-[#03050a] p-3 rounded-lg border border-white/10 text-xs text-left fira-code text-gray-400 mb-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[#00F5FF]">
            <Terminal size={13} />
            <span>ACTIVE CYBER SHIELD (YOUSSEF EL-GENDY)</span>
          </div>
          <div className="text-gray-500">
            &gt; TRIGGER_VECTOR: <span className="text-[#39FF14]">{triggerReason.toUpperCase()}</span>
          </div>
          <div className="text-gray-500">
            &gt; TAB_SWITCH_SAFE: <span className="text-[#00F5FF]">ENABLED (ZERO FALSE LOCKS)</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-[#39FF14] fira-code">
          <CheckCircle2 size={14} />
          <span>Click, tap, or scroll to resume browsing immediately</span>
        </div>
      </div>
    </div>
  );
}
