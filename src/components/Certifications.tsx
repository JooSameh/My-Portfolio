import { Award, Download, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function Certifications() {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  const certificates = [
    {
      title: "Financial Literacy Certificate",
      issuer: "Egyptian Banking System Model (EBSM) & E-Bank",
      image: "figma:asset/18ddefbf0336dde98dc7367e5a1b68eccc4d87a0.png",
      category: "Banking"
    },
    {
      title: "Financial Literacy & Entrepreneurship",
      issuer: "Agricultural Bank of Egypt",
      image: "figma:asset/c1b22d3a2c2e129758f5e35c9ea68626245efd7e.png",
      category: "Banking"
    },
    {
      title: "Appreciation Certificate",
      issuer: "Akademia Akhbar Al Youm - Choral Team Performance",
      image: "figma:asset/f1a46f68e5f1aa4020a55a2ad17a8ed49d64c4a2.png",
      category: "Arts"
    },
    {
      title: "Professional Media Diploma - Broadcasting",
      issuer: "Nile Media & Nile Today",
      image: "figma:asset/76885735deba300be7b1e2e84aaf1c7120bdb473.png",
      category: "Media"
    },
    {
      title: "Professional Media Diploma - Broadcasting & Television",
      issuer: "Nile Media & Nile Today",
      image: "figma:asset/9b1a5c89c5a293dd52dc89f76c6fccec3d22f578.png",
      category: "Media"
    },
    {
      title: "Professional Media Diploma - Scriptwriting",
      issuer: "Nile Media & Nile Today",
      image: "figma:asset/cd35c3e27db44e855b35a2d865d09fcdbbdb43a2.png",
      category: "Media"
    },
    {
      title: "Professional Media Diploma - Marketing",
      issuer: "Nile Media & Nile Today",
      image: "figma:asset/5bfebb56cb21757368d0866b8a8cbc3508f012a4.png",
      category: "Media"
    },
    {
      title: "Professional Media Diploma - Public Relations",
      issuer: "Nile Media & Nile Today",
      image: "figma:asset/8ac9973d7947f13c8066670c53ea389c94fdc62c.png",
      category: "Media"
    },
    {
      title: "Professional Media Diploma - Broadcasting & Television",
      issuer: "Nile Media & Nile Today",
      image: "figma:asset/24e17a468d346c91f61c69702b5c8c3a09b8f6f6.png",
      category: "Media"
    },
    {
      title: "Banking Awareness Forum",
      issuer: "EG Bank, OBM & Ministry of Youth & Sports",
      image: "figma:asset/e0ce514d5d43b3d397e7d7927ff9300a13bde8de.png",
      category: "Banking"
    },
    {
      title: "IT Foundations",
      issuer: "Academy of Scientific Research & Technology (ENSTINET)",
      image: "figma:asset/d63976f9b69154594039d385f5ae4868b5f270f7.png",
      category: "Technology"
    }
  ];

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
            Professional certifications and training achievements in media, technology, and banking
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-strong rounded-lg overflow-hidden border border-[#00F5FF]/20 hover:border-[#00F5FF]/40 transition-all cursor-pointer group"
              onClick={() => setSelectedCert(index)}
            >
              {/* Certificate Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="w-12 h-12 glass-strong rounded-full flex items-center justify-center border border-[#00F5FF]/40"
                  >
                    <Eye size={20} className="text-[#00F5FF]" />
                  </motion.div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 glass-strong rounded-full text-xs border border-[#39FF14]/40 text-[#39FF14]">
                    {cert.category}
                  </span>
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-4">
                <h3 className="text-white mb-2 orbitron text-sm line-clamp-2">{cert.title}</h3>
                <p className="text-[#00F5FF] text-xs fira-code mb-3">{cert.issuer}</p>
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-[#39FF14]" />
                  <span className="text-gray-400 text-xs">Certified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass-strong border border-[#00F5FF]/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="text-lg text-white mb-2 orbitron">Continuous Learning</h4>
            <p className="text-gray-300 text-sm mb-4">
              Committed to ongoing professional development across cybersecurity, media, and technology domains.
              Click on any certificate to view in detail.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Certificate Modal */}
      <AnimatePresence>
        {selectedCert !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedCert(null)}
                className="absolute -top-12 right-0 w-10 h-10 glass-strong rounded-full flex items-center justify-center border border-[#FF073A]/40 text-[#FF073A] hover:neon-red z-10"
              >
                <X size={20} />
              </motion.button>

              {/* Certificate Details */}
              <div className="glass-strong rounded-lg overflow-hidden border border-[#00F5FF]/40">
                <div className="p-4 border-b border-[#00F5FF]/20">
                  <h3 className="text-xl text-white orbitron mb-1">
                    {certificates[selectedCert].title}
                  </h3>
                  <p className="text-[#00F5FF] fira-code text-sm">
                    {certificates[selectedCert].issuer}
                  </p>
                </div>

                {/* Certificate Image */}
                <div className="relative bg-black">
                  <img
                    src={certificates[selectedCert].image}
                    alt={certificates[selectedCert].title}
                    className="w-full h-auto"
                  />
                </div>

                {/* Actions */}
                <div className="p-4 flex justify-between items-center">
                  <span className="px-3 py-1 glass rounded-full text-xs border border-[#39FF14]/40 text-[#39FF14]">
                    {certificates[selectedCert].category}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-gray-400 text-sm fira-code flex items-center gap-2">
                      <Award size={16} className="text-[#39FF14]" />
                      Verified Certificate
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}