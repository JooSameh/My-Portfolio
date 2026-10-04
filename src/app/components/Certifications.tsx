import { Award, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { CertificateModal, CertificateData } from './CertificateModal';

export function Certifications() {
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);

  // Preserve any custom attached images from localStorage
  const [customImages] = useState<Record<string, string>>(() => {
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
      defaultUrl: "/cert-1.jpg"
    },
    {
      id: "cert-2",
      title: "Financial Literacy & Entrepreneurship",
      issuer: "Agricultural Bank of Egypt",
      category: "Banking",
      color: "#00F5FF",
      defaultUrl: "/cert-2.jpg"
    },
    {
      id: "cert-3",
      title: "Appreciation Certificate",
      issuer: "Akademia Akhbar Al Youm - Choral Team Performance",
      category: "Arts",
      color: "#FF073A",
      defaultUrl: "/cert-3.jpg"
    },
    {
      id: "cert-4",
      title: "Professional Media Diploma - Broadcasting",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/cert-4.jpg"
    },
    {
      id: "cert-5",
      title: "Professional Media Diploma - Broadcasting & Television",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/cert-5.jpg"
    },
    {
      id: "cert-6",
      title: "Professional Media Diploma - Scriptwriting",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/cert-6.jpg"
    },
    {
      id: "cert-7",
      title: "Professional Media Diploma - Marketing",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/cert-7.jpg"
    },
    {
      id: "cert-8",
      title: "Professional Media Diploma - Public Relations",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/cert-8.jpg"
    },
    {
      id: "cert-9",
      title: "Professional Media Diploma - Broadcasting & Television",
      issuer: "Nile Media & Nile Today",
      category: "Media",
      color: "#B026FF",
      defaultUrl: "/cert-9.jpg"
    },
    {
      id: "cert-10",
      title: "Banking Awareness Forum",
      issuer: "EG Bank, OBM & Ministry of Youth & Sports",
      category: "Banking",
      color: "#00F5FF",
      defaultUrl: "/cert-10.jpg"
    },
    {
      id: "cert-11",
      title: "IT Foundations",
      issuer: "Academy of Scientific Research & Technology (ENSTINET)",
      category: "Technology",
      color: "#39FF14",
      defaultUrl: "/cert-11.jpg"
    }
  ];

  // Build active certificate data for modal
  const selectedCert = rawCertificates.find(c => c.id === selectedCertId);
  const activeModalData: CertificateData | null = selectedCert ? {
    id: selectedCert.id,
    title: selectedCert.title,
    issuer: selectedCert.issuer,
    category: selectedCert.category,
    color: selectedCert.color,
    imageUrl: customImages[selectedCert.id] || selectedCert.defaultUrl
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
            Professional certifications and verified credentials across offensive security, media broadcasting, technology, and banking
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
                      <span>View & Enlarge</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Info & Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white mb-2 orbitron text-sm font-semibold leading-snug group-hover:text-[#00F5FF] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs fira-code mb-4">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#00F5FF]/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-[#39FF14] fira-code">
                      <ShieldCheck size={14} />
                      <span>Verified & Accredited</span>
                    </div>

                    <div className="text-xs text-[#00F5FF] fira-code flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>Details</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cyberpunk Lightbox / Modal Component */}
      <CertificateModal
        isOpen={selectedCertId !== null}
        onClose={() => setSelectedCertId(null)}
        certificate={activeModalData}
      />
    </section>
  );
}
