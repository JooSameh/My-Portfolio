import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, ExternalLink, ShieldCheck, CheckCircle2, FileImage } from 'lucide-react';

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  category: string;
  color: string;
  imageUrl: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateData | null;
}

export function CertificateModal({ 
  isOpen, 
  onClose, 
  certificate
}: CertificateModalProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset image states when certificate changes or its imageUrl updates
  useEffect(() => {
    setImageError(false);
    setIsLoaded(false);
  }, [certificate?.imageUrl, certificate?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !certificate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          className="relative max-w-4xl w-full glass-strong rounded-2xl overflow-hidden border z-10 my-auto shadow-2xl flex flex-col max-h-[90vh]"
          style={{
            borderColor: `${certificate.color}60`,
            boxShadow: `0 0 60px ${certificate.color}25`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#00F5FF]/15 flex items-start justify-between gap-4 bg-[#0A0F1C]/90">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold fira-code border"
                  style={{
                    color: certificate.color,
                    borderColor: `${certificate.color}50`,
                    backgroundColor: `${certificate.color}15`
                  }}
                >
                  {certificate.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#39FF14] fira-code">
                  <CheckCircle2 size={13} />
                  Verified Credential
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl text-white orbitron font-bold tracking-wide truncate">
                {certificate.title}
              </h3>
              <p className="text-[#00F5FF] fira-code text-xs sm:text-sm mt-1 truncate">
                Issuer: {certificate.issuer}
              </p>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full glass-strong border border-[#FF073A]/40 text-[#FF073A] hover:bg-[#FF073A]/20 hover:border-[#FF073A] flex items-center justify-center transition-colors shrink-0"
              title="Close (Esc)"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Body / Certificate Image Viewer */}
          <div className="relative flex-1 overflow-auto bg-[#070B14] p-4 sm:p-6 flex items-center justify-center min-h-[350px]">
            {/* Cyber Grid background */}
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            {!imageError ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Image Display */}
                <img
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  onLoad={() => setIsLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`max-w-full max-h-[60vh] object-contain rounded-lg border border-[#00F5FF]/20 shadow-2xl transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Loading skeleton while image loads */}
                {!isLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-400 fira-code">Loading certificate...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback view when image is loading or unavailable */
              <div className="text-center p-6 sm:p-8 max-w-lg flex flex-col items-center justify-center">
                <motion.div
                  className="w-24 h-24 rounded-3xl glass-strong border-2 flex items-center justify-center mb-6"
                  style={{
                    borderColor: certificate.color,
                    boxShadow: `0 0 35px ${certificate.color}40`
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Award size={52} style={{ color: certificate.color }} />
                </motion.div>

                <h4 className="text-lg text-white orbitron mb-2 font-bold">
                  {certificate.title}
                </h4>
                <p className="text-sm text-gray-400 fira-code mb-4">
                  {certificate.issuer}
                </p>

                <div className="px-4 py-2 glass-strong rounded-xl border border-[#00F5FF]/30 text-xs fira-code text-[#00F5FF] flex items-center gap-2">
                  <FileImage size={15} />
                  <span>Official Accredited & Verified Credential</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-[#0A0F1C]/90 border-t border-[#00F5FF]/15 flex flex-wrap items-center justify-between gap-3 text-xs fira-code">
            <div className="flex items-center gap-2 text-[#39FF14]">
              <ShieldCheck size={16} />
              <span>Official Accreditation Verified</span>
            </div>

            <div className="flex items-center gap-2.5">
              {!imageError && isLoaded && (
                <a
                  href={certificate.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 glass-strong rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-[#00F5FF] flex items-center gap-1.5 transition-colors"
                >
                  <span>View Fullscreen</span>
                  <ExternalLink size={13} />
                </a>
              )}

              <button
                onClick={onClose}
                className="px-4 py-1.5 glass rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
