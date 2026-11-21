import { useState, useEffect, useCallback } from 'react';

export type ShieldReason = 'focus-lost' | 'shortcut-detected' | 'hidden' | null;

export function useScreenProtection() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [shieldReason, setShieldReason] = useState<ShieldReason>(null);

  const activateShield = useCallback((reason: ShieldReason) => {
    setIsShieldActive(true);
    setShieldReason(reason);
  }, []);

  const dismissShield = useCallback(() => {
    setIsShieldActive(false);
    setShieldReason(null);
  }, []);

  useEffect(() => {
    // 1. Window Blur - Window loses focus (e.g. Snipping tool opened, OS screenshot overlay activated, alt-tab, screen recorder target change)
    const handleBlur = () => {
      activateShield('focus-lost');
    };

    // 2. Window Focus - User returns to the active window
    const handleFocus = () => {
      // Small timeout to allow user interaction to register
      setTimeout(() => {
        dismissShield();
      }, 150);
    };

    // 3. Tab Visibility Change (Tab switched or browser minimized)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        activateShield('hidden');
      } else {
        dismissShield();
      }
    };

    // 4. Keyboard Shortcuts for Screen Capture
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        activateShield('shortcut-detected');

        // Overwrite system clipboard to clear captured frame if possible
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('Security Policy: Screen capture is disabled on this system.').catch(() => {});
        }
        return;
      }

      // Windows Snipping Tool: Win + Shift + S
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        activateShield('shortcut-detected');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('Security Policy: Screen capture is disabled on this system.').catch(() => {});
        }
        return;
      }

      // macOS Screenshot shortcuts: Cmd + Shift + 3 / 4 / 5
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        activateShield('shortcut-detected');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('Security Policy: Screen capture is disabled on this system.').catch(() => {});
        }
        return;
      }

      // If shield is active, any other key press can dismiss if window has focus
      if (isShieldActive && document.hasFocus()) {
        dismissShield();
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
  }, [activateShield, dismissShield, isShieldActive]);

  return {
    isShieldActive,
    shieldReason,
    dismissShield,
  };
}
