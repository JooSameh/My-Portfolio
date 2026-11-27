import { useEffect, useState } from 'react';
import { ShieldAlert, Terminal, Lock } from 'lucide-react';

const POLICY_MESSAGE =
  'SECURITY POLICY: Screen capture is protected on Youssef EL-Gendy Portfolio.';

function overwriteClipboardWithPolicy() {
  // 1. Try modern Clipboard API first (replaces screenshot image in Windows clipboard)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(POLICY_MESSAGE).catch(() => {});
  }

  // 2. Fallback via hidden textarea for active user gestures
  try {
    const textarea = document.createElement('textarea');
    textarea.value = POLICY_MESSAGE;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, POLICY_MESSAGE.length);
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch {
    // Ignore if blocked by browser sandbox
  }
}

export function ScreenShieldOverlay() {
  const [locked, setLocked] = useState(false);
  const [vector, setVector] = useState('SCREEN_CAPTURE');

  useEffect(() => {
    const triggerShield = (reason: string) => {
      document.documentElement.classList.add('cyber-shield-locked');
      setVector(reason);
      setLocked(true);
      overwriteClipboardWithPolicy();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase();
      const isPrintScreen =
        e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44;
      const isDevTools =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (e.metaKey && e.altKey && (key === 'i' || key === 'j' || key === 'c'));
      const isSourceOrSave =
        (e.ctrlKey || e.metaKey) && (key === 'u' || key === 's' || key === 'p');
      const isWinSnip = (e.metaKey || e.ctrlKey) && e.shiftKey && key === 's';

      if (isPrintScreen || isDevTools || isSourceOrSave || isWinSnip) {
        e.preventDefault();
        e.stopPropagation();
        triggerShield(isPrintScreen || isWinSnip ? 'SCREEN_CAPTURE' : 'DEVTOOLS_SHORTCUT');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerShield('SCREEN_CAPTURE');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerShield('CONTEXT_MENU');
    };

    const handleWindowBlur = () => {
      triggerShield('SNIPPING_TOOL / FOCUS_LOST');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerShield('SCREEN_SWITCH / CAPTURE');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const unlockShield = () => {
    setLocked(false);
    document.documentElement.classList.remove('cyber-shield-locked');
  };

  if (!locked) return null;

  return (
    <div
      onClick={unlockShield}
      onWheel={unlockShield}
      onTouchStart={unlockShield}
      className="fixed inset-0 z-[99999] bg-[#060911] flex items-center justify-center p-4 select-none cursor-pointer"
    >
      <div className="max-w-lg w-full glass-strong border border-[#00F5FF]/40 rounded-2xl p-8 text-center space-y-6 shadow-[0_0_60px_rgba(0,245,255,0.2)]">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00F5FF]/10 border border-[#00F5FF]/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,245,255,0.25)]">
          <ShieldAlert className="w-8 h-8 text-[#00F5FF]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-xs fira-code">
          <Lock className="w-3.5 h-3.5" />
          <span>ACTIVE DEFENSE SHIELD • DISPLAY PROTECTED</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold orbitron text-white tracking-wider">
            SECURITY SHIELD <span className="text-[#00F5FF]">ACTIVE</span>
          </h2>
          <p className="text-sm text-[#94A3B8] fira-code">
            {POLICY_MESSAGE}
          </p>
        </div>

        <div className="bg-[#0A0F1C] border border-white/10 rounded-xl p-4 text-left fira-code text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#00F5FF]">
            <Terminal className="w-3.5 h-3.5" />
            <span>&gt;_ ACTIVE CYBER SHIELD (YOUSSEF EL-GENDY)</span>
          </div>
          <div className="text-gray-400">
            &gt; TRIGGER_VECTOR: <span className="text-[#39FF14]">{vector}</span>
          </div>
          <div className="text-gray-400">
            &gt; POLICY_STATUS: <span className="text-[#39FF14]">ENFORCED</span>
          </div>
        </div>

        <p className="text-xs text-[#39FF14] fira-code">
          Click, tap, or scroll to resume browsing immediately
        </p>
      </div>
    </div>
  );
}
