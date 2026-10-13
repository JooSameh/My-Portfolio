import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Lock, EyeOff, RotateCcw } from 'lucide-react';
import { ShieldReason } from '../hooks/useScreenProtection';

interface ScreenShieldOverlayProps {
  isActive: boolean;
  reason: ShieldReason;
  onDismiss: () => void;
}

export function ScreenShieldOverlay({ isActive, reason, onDismiss }: ScreenShieldOverlayProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onDismiss}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#0A0F1C]/95 backdrop-blur-3xl select-none cursor-pointer"
        >
          {/* Cyber Grid background */}
          <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

          {/* Holographic scanning line */}
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF073A] to-transparent pointer-events-none opacity-60"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Central Security Shield Container */}
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full glass-strong rounded-2xl p-6 sm:p-8 border border-[#FF073A]/40 text-center shadow-[0_0_80px_rgba(255,7,58,0.25)] overflow-hidden"
          >
            {/* Pulsing ambient glow behind icon */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#FF073A]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#00F5FF]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF073A]/15 border border-[#FF073A]/40 text-[#FF073A] text-xs font-mono mb-6 uppercase tracking-wider">
              <EyeOff size={13} />
              <span>Anti-Capture Protection Active</span>
            </div>

            {/* Glowing Shield Icon */}
            <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-2xl border border-[#FF073A]/40"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="w-20 h-20 rounded-2xl glass-strong flex items-center justify-center shadow-[0_0_40px_rgba(255,7,58,0.4)]"
                animate={{
                  boxShadow: [
                    '0 0 25px rgba(255,7,58,0.3)',
                    '0 0 50px rgba(255,7,58,0.6)',
                    '0 0 25px rgba(255,7,58,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShieldAlert size={44} className="text-[#FF073A]" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white orbitron tracking-wide mb-3">
              SECURITY SHIELD <span className="text-[#FF073A]">ACTIVATED</span>
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-300 fira-code leading-relaxed mb-2">
              Screen capture, recording utilities, and window defocusing are blocked to safeguard credential data.
            </p>
            <p className="text-xs text-gray-400 fira-code mb-6" dir="rtl">
              تم تفعيل درع الحماية لمنع تسجيل أو التقاط الشاشة للحفاظ على خصوصية البيانات.
            </p>

            {/* Trigger details badge */}
            <div className="p-2.5 rounded-lg bg-black/40 border border-[#00F5FF]/20 text-[11px] font-mono text-gray-400 mb-6 flex items-center justify-center gap-2">
              <Lock size={12} className="text-[#00F5FF]" />
              <span>
                Trigger: {reason === 'shortcut-detected' ? 'Capture Shortcut Intercepted' : reason === 'hidden' ? 'Background Visibility Change' : 'Window Focus Loss'}
              </span>
            </div>

            {/* Resume Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDismiss}
              className="w-full py-3 px-6 glass-strong rounded-xl border border-[#00F5FF]/50 text-[#00F5FF] hover:bg-[#00F5FF]/15 hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-all font-mono text-sm flex items-center justify-center gap-2 cursor-pointer orbitron"
            >
              <RotateCcw size={15} />
              <span>Click to Resume Browsing</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
