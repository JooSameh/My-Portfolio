import { Award, Eye, ShieldCheck, CheckCircle2, Sparkles, Upload, FileImage, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CertificateModal, CertificateData } from './CertificateModal';

export function Certifications() {
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  // Load custom attached images from localStorage
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    try {
      for (let i = 1; i <= 11; i++) {
        const id = `cert-${i}`;
        const val = localStorage.getItem(`cert_image_${id}`);
        if (val) saved[id] = val;
      }
    } catch (e) {
      console.error(e);
    }
    return saved;
  });

  const rawCertificates = [
    {
      id: "cert-1",
      title: "Financial Literacy Certificate",
      issuer: "Egyptian Banking System Model (EBSM) & E-Bank",
      category: "Banking",
      color: "#00F5FF",
      defaultUrl: "/certs/cert-1.jpg"
    },
    {
      id: "cert-2",
      title: "Financial Literacy & Entrepreneurship",
      issuer: "Agricultural Bank of Egypt",
      category: "Banking",
      color: "#00F5FF",
      defaultUrl: "/certs/cert-2.jpg"
    },
    {
      id: "cert-3",
      title: "Appreciation Certificate",
      issuer: "Akademia Akhbar Al Youm - Choral Team Performance",
      category: "Arts",
      color: "#FF073A",
      defaultUrl: "/certs/cert-3.jpg"
    },
    {
      id: "cert-4",
      title: "Professional Media Diploma - Broadcasting",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/certs/cert-4.jpg"
    },
    {
      id: "cert-5",
      title: "Professional Media Diploma - Broadcasting & Television",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/certs/cert-5.jpg"
    },
    {
      id: "cert-6",
      title: "Professional Media Diploma - Scriptwriting",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/certs/cert-6.jpg"
    },
    {
      id: "cert-7",
      title: "Professional Media Diploma - Marketing",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/certs/cert-7.jpg"
    },
    {
      id: "cert-8",
      title: "Professional Media Diploma - Public Relations",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/certs/cert-8.jpg"
    },
    {
      id: "cert-9",
      title: "Professional Media Diploma - Broadcasting & Television",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/certs/cert-9.jpg"
    },
    {
      id: "cert-10",
      title: "Banking Awareness Forum",
      issuer: "EG Bank, OBM & Ministry of Youth & Sports",
      category: "Banking",
      color: "#00F5FF",
      defaultUrl: "/certs/cert-10.jpg"
    },
    {
      id: "cert-11",
      title: "IT Foundations",
      issuer: "Academy of Scientific Research & Technology (ENSTINET)",
      category: "Technology",
      color: "#39FF14",
      defaultUrl: "/certs/cert-11.jpg"
    }
  ];

  const handleUploadCertImage = (certId: string, file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      try {
        localStorage.setItem(`cert_image_${certId}`, dataUrl);
        setCustomImages(prev => ({ ...prev, [certId]: dataUrl }));
        toast.success('تم إرفاق صورة الشهادة بنجاح!');
      } catch {
        toast.error('تعذر حفظ الصورة، قد تكون مساحة التخزين المحلية ممتلئة');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCertImage = (certId: string) => {
    try {
      localStorage.removeItem(`cert_image_${certId}`);
      setCustomImages(prev => {
        const next = { ...prev };
        delete next[certId];
        return next;
      });
      toast.info('تمت إزالة صورة الشهادة المرفقة');
    } catch {
      // ignore
    }
  };

  // Build active certificate data for modal
  const selectedCert = rawCertificates.find(c => c.id === selectedCertId);
  const activeModalData: CertificateData | null = selectedCert ? {
    id: selectedCert.id,
    title: selectedCert.title,
    issuer: selectedCert.issuer,
    category: selectedCert.category,
    color: selectedCert.color,
    imageUrl: customImages[selectedCert.id] || selectedCert.defaultUrl,
    isCustom: !!customImages[selectedCert.id]
  } : null;

  return (
    <section id="certifications" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C] via-[#0D1421] to-[#0A0F1C]" />
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl mb-4 text-white orbitron">
            Certificates <span className="neon-text-blue">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto mb-6 neon-blue"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional certifications and verified credentials. You can click on any certificate to inspect details or attach its official image directly.
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rawCertificates.map((cert) => {
            const hasCustomImage = !!customImages[cert.id];
            const displayImageUrl = customImages[cert.id] || cert.defaultUrl;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="glass-strong rounded-xl overflow-hidden border border-[#00F5FF]/20 hover:border-[#00F5FF]/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                onClick={() => setSelectedCertId(cert.id)}
              >
                {/* Showcase Header: Either Real Image Thumbnail OR Glowing Seal */}
                <div className="relative h-44 bg-gradient-to-b from-[#0D1421] via-[#0A0F1C] to-[#0D1421] flex flex-col items-center justify-center border-b border-[#00F5FF]/10 overflow-hidden">
                  {/* Cyber Grid pattern */}
                  <div className="absolute inset-0 cyber-grid opacity-15" />
                  
                  {hasCustomImage ? (
                    /* Display Attached Image Thumbnail */
                    <div className="relative w-full h-full p-2 flex items-center justify-center">
                      <img
                        src={displayImageUrl}
                        alt={cert.title}
                        className="max-h-full max-w-full object-contain rounded-lg border border-[#00F5FF]/30 shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] bg-[#39FF14]/20 border border-[#39FF14]/50 text-[#39FF14] fira-code">
                        مرفقة ✓
                      </div>
                    </div>
                  ) : (
                    /* Glowing Emblem Placeholder */
                    <>
                      <div
                        className="absolute w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ backgroundColor: cert.color }}
                      />

                      <motion.div 
                        className="relative z-10 w-20 h-20 rounded-2xl glass-strong border flex items-center justify-center transition-all duration-300"
                        style={{ 
                          borderColor: `${cert.color}60`,
                          boxShadow: `0 0 25px ${cert.color}30`
                        }}
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                      >
                        <Award size={42} style={{ color: cert.color }} />
                      </motion.div>

                      <div className="relative z-10 mt-3 flex items-center gap-1.5 text-xs text-gray-400 fira-code">
                        <CheckCircle2 size={13} className="text-[#39FF14]" />
                        <span>Verified Credential</span>
                      </div>
                    </>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span 
                      className="px-3 py-1 glass-strong rounded-full text-xs font-semibold fira-code border"
                      style={{ 
                        color: cert.color,
                        borderColor: `${cert.color}50`,
                        boxShadow: `0 0 10px ${cert.color}20`
                      }}
                    >
                      {cert.category}
                    </span>
                  </div>

                  {/* Quick View Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0A0F1C]/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <div className="px-4 py-2 glass-strong rounded-full border border-[#00F5FF]/60 text-[#00F5FF] text-xs fira-code flex items-center gap-2 neon-blue shadow-lg">
                      <Eye size={14} />
                      <span>عرض وتكبير</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Info & Action Bar */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white mb-2 orbitron text-sm font-semibold leading-snug group-hover:text-[#00F5FF] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs fira-code mb-4">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#00F5FF]/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs text-[#39FF14] fira-code">
                      <ShieldCheck size={14} />
                      <span>معتمدة</span>
                    </div>

                    {/* Quick Attach Image Button on Card */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <label
                        className="px-2.5 py-1 glass-strong rounded-lg border border-[#00F5FF]/40 hover:border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF]/15 text-xs fira-code flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                        title="إرفاق صورة للشهادة من جهازك"
                      >
                        <Upload size={12} />
                        <span>{hasCustomImage ? 'تغيير' : 'إرفاق'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadCertImage(cert.id, file);
                          }}
                          className="hidden"
                        />
                      </label>

                      {hasCustomImage && (
                        <button
                          onClick={() => handleRemoveCertImage(cert.id)}
                          className="p-1 glass-strong rounded-lg border border-[#FF073A]/40 text-[#FF073A] hover:bg-[#FF073A]/20 transition-colors"
                          title="حذف الصورة المرفقة"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Development Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass-strong border border-[#00F5FF]/30 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#00F5FF]">
              <Sparkles size={18} />
              <h4 className="text-lg text-white orbitron">إرفاق ومعاينة الشهادات</h4>
            </div>
            <p className="text-gray-300 text-sm fira-code leading-relaxed">
              يمكنك الآن الضغط على زر <span className="text-[#00F5FF] font-semibold">«إرفاق»</span> عند أي شهادة لرفع صورتها مباشرة من جهازك، أو الضغط على الكارت لفتح المعاينة الكبيرة وإرفاق الصورة من داخلها. الصور تُحفظ تلقائياً في متصفحك!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Cyberpunk Lightbox / Modal Component */}
      <CertificateModal
        isOpen={selectedCertId !== null}
        onClose={() => setSelectedCertId(null)}
        certificate={activeModalData}
        onUploadImage={handleUploadCertImage}
        onRemoveImage={handleRemoveCertImage}
      />
    </section>
  );
}
