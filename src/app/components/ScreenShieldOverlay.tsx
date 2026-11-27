import { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Terminal, Lock } from 'lucide-react';

const POLICY_MESSAGE =
  'SECURITY POLICY: Screen capture is protected on Youssef EL-Gendy Portfolio.';

function copyViaExecCommand(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function writePolicyToClipboard() {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(POLICY_MESSAGE).catch(() => {
      copyViaExecCommand(POLICY_MESSAGE);
    });
  } else {
    copyViaExecCommand(POLICY_MESSAGE);
  }
}

export function ScreenShieldOverlay() {
  const [locked, setLocked] = useState(false);
  const [vector, setVector] = useState('SHORTCUT');
  const timersRef = useRef<number[]>([]);

  const enforceClipboardPolicy = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    // Write immediately + retry after Windows finishes writing the screenshot bitmap
    writePolicyToClipboard();
    timersRef.current.push(
      window.setTimeout(writePolicyToClipboard, 80),
      window.setTimeout(writePolicyToClipboard, 220)
    );
  };

  useEffect(() => {
    const triggerShield = (reason: string) => {
      document.documentElement.classList.add('cyber-shield-locked');
      setVector(reason);
      setLocked(true);
      enforceClipboardPolicy();
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
        triggerShield(isPrintScreen || isWinSnip ? 'SCREEN_CAPTURE' : 'SHORTCUT');
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

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, []);

  const unlockShield = () => {
    // Re-write on real user click/tap (works silently even in strict/Incognito mode)
    copyViaExecCommand(POLICY_MESSAGE);
    writePolicyToClipboard();
    setLocked(false);
    document.documentElement.classList.remove('cyber-shield-locked');
  };

  if (!locked) return null;

  return (
    <div
      onClick={unlockShield}
      onWheel={unlockShield}
      onTouchStart={unlockShield}
      className="fixed inset-0 z-[99999] bg-[#060911]/98 backdrop-blur-2xl flex items-center justify-center p-4 select-none cursor-pointer"
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
            Active capture or DevTools shortcut intercepted (PrintScreen / F12 / DevTools / View Source).
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
            &gt; TAB_SWITCH_SAFE: <span className="text-[#39FF14]">ENABLED (ZERO FALSE LOCKS)</span>
          </div>
        </div>

        <p className="text-xs text-[#39FF14] fira-code">
          Click, tap, or scroll to resume browsing immediately
        </p>
      </div>
    </div>
  );
}
