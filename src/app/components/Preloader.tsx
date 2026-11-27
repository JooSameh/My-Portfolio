import { useEffect, useState } from 'react';

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), 450);
    const hideTimer = window.setTimeout(() => setVisible(false), 700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 inset-x-0 z-[100] h-[3px] pointer-events-none transition-opacity duration-200 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="h-full w-full bg-gradient-to-r from-[#00F5FF] via-[#39FF14] to-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.85)] animate-pulse" />
    </div>
  );
}
