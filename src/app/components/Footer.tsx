import { Heart, Shield, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="relative border-t border-[#00F5FF]/20 py-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-[#0D1421]" />
      <div className="absolute inset-0 cyber-grid opacity-5" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center mb-4 md:mb-0"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="text-[#00F5FF] mr-2" size={20} />
            </motion.div>
            <span className="text-white orbitron">Youssef Sameh EL-Gendy</span>
            <span className="text-gray-400 ml-2 fira-code text-sm">- Cybersecurity Specialist</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-end fira-code">
              Made with <Heart className="text-red-500 mx-1" size={14} /> and secure coding practices
            </p>
            <p className="text-gray-500 text-xs mt-1 fira-code">
              © 2026 Youssef Sameh EL-Gendy. All rights reserved.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 pt-6 border-t border-[#00F5FF]/10 text-center"
        >
          <p className="text-gray-500 text-xs fira-code">
            This portfolio follows cybersecurity best practices including secure development lifecycle, 
            data protection principles, and privacy by design. Built with React, Motion, and Tailwind CSS.
          </p>
          <div className="flex justify-center items-center gap-2 mt-3">
            <Terminal className="text-[#00F5FF]" size={12} />
            <span className="text-[#00F5FF] text-xs fira-code">security.instructor@online</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
