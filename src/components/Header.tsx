import { Mail, Github, Linkedin, Menu, X, Terminal, Shield, Cpu } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 glass-strong border-b border-[#00F5FF]/20 z-50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Cyberpunk Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 glass rounded-lg flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 245, 255, 0.3)',
                    '0 0 30px rgba(57, 255, 20, 0.3)',
                    '0 0 20px rgba(0, 245, 255, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Shield className="text-[#00F5FF]" size={20} />
              </motion.div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#39FF14] rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg neon-text-blue orbitron tracking-wide">Youssef EL-Gendy</h1>
              <p className="text-xs text-[#94A3B8] fira-code">security.instructor</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: 'about', label: 'About' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education' },
              { id: 'contact', label: 'Contact' }
            ].map((section) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="glass px-4 py-2 rounded-lg text-[#E2E8F0] hover:text-[#00F5FF] transition-all duration-300 text-sm orbitron"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {section.label}
              </motion.button>
            ))}
          </nav>

          {/* System Status Indicator */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="glass px-3 py-2 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-[#39FF14] rounded-full pulse-neon" />
              <span className="text-xs text-[#94A3B8] fira-code">ONLINE</span>
            </div>
            
            {/* Quick Access Icons */}
            <div className="flex items-center space-x-2">
              <motion.a 
                href="mailto:youssefs.sec@gmail.com" 
                className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:neon-blue transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={16} className="text-[#00F5FF]" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:neon-blue transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={16} className="text-[#00F5FF]" />
              </motion.a>
              <motion.a 
                href="https://github.com" 
                className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:neon-blue transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={16} className="text-[#00F5FF]" />
              </motion.a>
            </div>
          </div>

          {/* Cyberpunk Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 glass rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? 
                <X size={20} className="text-[#FF073A]" /> : 
                <Menu size={20} className="text-[#00F5FF]" />
              }
            </motion.div>
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="mt-4 pt-4 border-t border-[#00F5FF]/20">
            <nav className="grid grid-cols-2 gap-3 mb-4">
              {[
                { id: 'about', label: 'About', icon: Terminal },
                { id: 'skills', label: 'Skills', icon: Cpu },
                { id: 'projects', label: 'Projects', icon: Shield },
                { id: 'education', label: 'Education', icon: Terminal },
                { id: 'contact', label: 'Contact', icon: Mail }
              ].map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="glass p-3 rounded-lg text-left hover:neon-blue transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2">
                    <section.icon size={16} className="text-[#00F5FF]" />
                    <span className="text-sm text-[#E2E8F0] orbitron">{section.label}</span>
                  </div>
                </motion.button>
              ))}
            </nav>
            
            {/* Mobile Social Links */}
            <div className="flex justify-center space-x-4 pb-2">
              <motion.a 
                href="mailto:youssefs.sec@gmail.com" 
                className="w-12 h-12 glass rounded-lg flex items-center justify-center hover:neon-blue transition-all"
                whileHover={{ scale: 1.1 }}
              >
                <Mail size={18} className="text-[#00F5FF]" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                className="w-12 h-12 glass rounded-lg flex items-center justify-center hover:neon-blue transition-all"
                whileHover={{ scale: 1.1 }}
              >
                <Linkedin size={18} className="text-[#00F5FF]" />
              </motion.a>
              <motion.a 
                href="https://github.com" 
                className="w-12 h-12 glass rounded-lg flex items-center justify-center hover:neon-blue transition-all"
                whileHover={{ scale: 1.1 }}
              >
                <Github size={18} className="text-[#00F5FF]" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}