import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, ExternalLink, ShieldCheck, CheckCircle2, FileImage, Upload, Trash2, RotateCcw } from 'lucide-react';

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  category: string;
  color: string;
  imageUrl: string;
  isCustom?: boolean;
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateData | null;
  onUploadImage?: (certId: string, file: File) => void;
  onRemoveImage?: (certId: string) => void;
}

export function CertificateModal({ 
  isOpen, 
  onClose, 
  certificate,
  onUploadImage,
  onRemoveImage 
}: CertificateModalProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      onUploadImage(certificate.id, file);
      setImageError(false);
      setIsLoaded(false);
    }
  };

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
                {certificate.isCustom && (
                  <span className="px-2 py-0.5 rounded text-[11px] bg-[#39FF14]/15 border border-[#39FF14]/40 text-[#39FF14] fira-code">
                    تم إرفاق صورة مخصصة
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl text-white orbitron font-bold tracking-wide truncate">
                {certificate.title}
              </h3>
              <p className="text-[#00F5FF] fira-code text-xs sm:text-sm mt-1 truncate">
                Issuer: {certificate.issuer}
              </p>
            </div>

            {/* Actions & Close Button */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full glass-strong border border-[#FF073A]/40 text-[#FF073A] hover:bg-[#FF073A]/20 hover:border-[#FF073A] flex items-center justify-center transition-colors shrink-0"
                title="إغلاق (Esc)"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          {/* Hidden File Input for Modal */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

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
                    <span className="text-xs text-gray-400 fira-code">جاري تحميل صورة الشهادة...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback view when no image is present yet */
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
                <p className="text-sm text-gray-400 fira-code mb-5">
                  {certificate.issuer}
                </p>

                {/* Upload Button Call to Action */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 rounded-xl glass-strong border border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF]/20 flex items-center gap-2.5 fira-code text-sm font-semibold neon-blue shadow-xl transition-all"
                >
                  <Upload size={18} />
                  <span>إرفاق صورة الشهادة الآن</span>
                </motion.button>

                <p className="text-xs text-gray-500 fira-code mt-4">
                  يمكنك رفع صورة من جهازك مباشرة بصيغة PNG أو JPG
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-[#0A0F1C]/90 border-t border-[#00F5FF]/15 flex flex-wrap items-center justify-between gap-3 text-xs fira-code">
            <div className="flex items-center gap-2 text-[#39FF14]">
              <ShieldCheck size={16} />
              <span>Official Accreditation Verified</span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Attach / Replace Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 glass-strong rounded-lg border border-[#00F5FF]/40 text-[#00F5FF] hover:bg-[#00F5FF]/20 flex items-center gap-1.5 transition-colors"
              >
                <Upload size={14} />
                <span>{certificate.isCustom || (!imageError && isLoaded) ? 'تغيير الصورة' : 'إرفاق صورة'}</span>
              </button>

              {/* Remove Custom Attached Image Button */}
              {certificate.isCustom && onRemoveImage && (
                <button
                  onClick={() => {
                    onRemoveImage(certificate.id);
                    setImageError(true);
                  }}
                  className="px-3 py-1.5 glass-strong rounded-lg border border-[#FF073A]/40 text-[#FF073A] hover:bg-[#FF073A]/20 flex items-center gap-1.5 transition-colors"
                  title="إزالة الصورة المرفقة واستعادة الافتراضية"
                >
                  <Trash2 size={13} />
                  <span>إزالة الصورة</span>
                </button>
              )}

              {!imageError && isLoaded && (
                <a
                  href={certificate.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 glass-strong rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 flex items-center gap-1.5 transition-colors"
                >
                  <span>عرض بملء الشاشة</span>
                  <ExternalLink size={13} />
                </a>
              )}

              <button
                onClick={onClose}
                className="px-4 py-1.5 glass rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
