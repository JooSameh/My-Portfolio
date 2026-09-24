import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ArrowDown, Shield, Code, Terminal, Lock, Zap, Eye, Cpu, Wifi, Database, Binary, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Matrix and binary characters for cyberpunk effect
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const binaryChars = '01010011010001010100001101010101010100100100001101001001010101010100010101000101010101';

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Cyberpunk Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1C] via-[#0D1421] to-[#0A0F1C]" />
        
        {/* Animated cyber grid */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Interactive cursor glow */}
        <div 
          className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: `radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, rgba(0, 245, 255, 0.05) 30%, transparent 70%)`,
          }}
        />
        
        {/* Matrix Rain Effect - Enhanced */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute select-none fira-code"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 8 + 8}px`,
                color: i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#39FF14' : '#94A3B8'
              }}
              animate={{
                y: ['-10vh', '110vh'],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear"
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <div key={j} style={{ opacity: 1 - (j * 0.05) }}>
                  {i % 2 === 0 
                    ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
                    : binaryChars[Math.floor(Math.random() * binaryChars.length)]
                  }
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Floating geometric shapes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 8,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          >
            <div 
              className={`w-4 h-4 ${
                i % 3 === 0 ? 'bg-[#00F5FF]/20 border-[#00F5FF]/40' :
                i % 3 === 1 ? 'bg-[#39FF14]/20 border-[#39FF14]/40' :
                'bg-[#B026FF]/20 border-[#B026FF]/40'
              } border ${Math.random() > 0.5 ? 'rounded-full' : 'rounded-lg'} backdrop-blur-sm`}
            />
          </motion.div>
        ))}

        {/* Large glowing orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30"
          style={{ 
            left: '5%', 
            top: '10%',
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, rgba(0, 245, 255, 0.1) 30%, transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-20"
          style={{ 
            right: '5%', 
            bottom: '10%',
            background: 'radial-gradient(circle, rgba(57, 255, 20, 0.3) 0%, rgba(57, 255, 20, 0.1) 30%, transparent 70%)',
            filter: 'blur(30px)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Floating Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute top-8 right-8 glass rounded-xl p-4 z-20 hidden lg:block"
      >
        <div className="text-center space-y-3">
          <div className="text-xs text-[#00F5FF] uppercase tracking-wide orbitron">Contact</div>
          <div className="flex gap-3 justify-center">
            <motion.a
              href="mailto:youssefs.sec@gmail.com"
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 glass-strong rounded-lg flex items-center justify-center neon-blue"
            >
              <Terminal size={16} className="text-[#00F5FF]" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/youssef-sameh-1b6b95369/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 glass-strong rounded-lg flex items-center justify-center neon-blue"
            >
              <Wifi size={16} className="text-[#00F5FF]" />
            </motion.a>
            <motion.a
              href="https://github.com/JooSameh"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 glass-strong rounded-lg flex items-center justify-center neon-blue"
            >
              <Code size={16} className="text-[#00F5FF]" />
            </motion.a>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full"
            >
              <Shield size={16} className="text-[#39FF14]" />
              <span className="text-xs uppercase tracking-widest neon-text-green orbitron">
                Cybersecurity Specialist & Technical Instructor
              </span>
            </motion.div>
              
            {/* Main Title with Holographic Effect */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-7xl lg:text-9xl tracking-tight orbitron"
              >
                <motion.span 
                  className="block text-white"
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(255,255,255,0.5)',
                      '0 0 40px rgba(0,245,255,0.3)',
                      '0 0 20px rgba(255,255,255,0.5)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Youssef
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-[#00F5FF] via-[#39FF14] to-[#00F5FF] bg-clip-text text-transparent holographic"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  EL-Gendy
                </motion.span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <h2 className="text-2xl lg:text-3xl text-[#E2E8F0]">
                  Cybersecurity Instructor & <span className="neon-text-blue">AI Developer</span>
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-lg text-[#94A3B8]">
                  <Terminal size={20} className="text-[#00F5FF] pulse-neon" />
                  <span className="fira-code">Offensive Security & AI-Driven Solutions</span>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass p-6 rounded-xl"
            >
              <p className="text-lg text-[#E2E8F0] leading-relaxed">
                Ministry of Youth & Sports certified instructor training 45+ students in cybersecurity fundamentals. 
                Specializing in <span className="neon-text-blue">penetration testing</span>, 
                <span className="neon-text-green"> AI development</span>, and 
                offensive security research. Keynote speaker combining technical expertise with leadership excellence.
              </p>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-3 gap-6"
            >
              {[
                { value: '45+', label: 'Students Trained', color: '#00F5FF' },
                { value: '36+', label: 'Training Hours', color: '#39FF14' },
                { value: '2nd Dan', label: 'Karate Black Belt', color: '#B026FF' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass-strong p-4 rounded-xl text-center"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${stat.color}20`,
                      `0 0 40px ${stat.color}40`,
                      `0 0 20px ${stat.color}20`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <div className="text-3xl mb-2 orbitron" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#94A3B8] uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={scrollToAbout}
                className="glass-strong px-8 py-4 rounded-full text-lg orbitron neon-blue hover:neon-green transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-3">
                  <Eye size={20} />
                  <span>Explore Arsenal</span>
                </div>
              </motion.button>
              <motion.button
                className="glass px-8 py-4 rounded-full text-lg border border-[#00F5FF]/50 text-[#00F5FF] hover:bg-[#00F5FF]/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('mailto:youssefs.sec@gmail.com')}
              >
                <div className="flex items-center gap-3">
                  <Zap size={20} />
                  <span>Initialize Contact</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Floating Skill Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {[
                { icon: Shield, label: "Penetration Testing", color: '#00F5FF' },
                { icon: Lock, label: "AI Development", color: '#39FF14' },
                { icon: Binary, label: "Vulnerability Research", color: '#B026FF' },
                { icon: HardDrive, label: "Public Speaking", color: '#FF073A' }
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  className="glass px-4 py-2 rounded-full border"
                  style={{ borderColor: `${skill.color}40` }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: `0 0 20px ${skill.color}60`
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity, delay: index * 0.2 },
                    hover: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <skill.icon size={16} style={{ color: skill.color }} />
                    <span className="text-sm text-[#E2E8F0] fira-code">{skill.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Profile Display */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end perspective-1000"
          >
            <div className="relative preserve-3d">
              {/* Holographic Frame */}
              <motion.div
                className="relative"
                animate={{
                  rotateY: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Outer Scanning Ring */}
                <motion.div
                  className="absolute -inset-12 rounded-full border-2 border-[#00F5FF]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Middle Pulse Ring */}
                <motion.div
                  className="absolute -inset-8 rounded-full border border-[#39FF14]/40"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Main Profile Container */}
                <motion.div
                  className="w-96 h-96 rounded-full glass-strong relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 50px rgba(0, 245, 255, 0.3)',
                      '0 0 100px rgba(57, 255, 20, 0.3)',
                      '0 0 50px rgba(0, 245, 255, 0.3)'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                   <img
                     src="figma:asset/f97af8db2714449f11797188bda3b2b562bbe8f1.png"
                     alt="Youssef Sameh EL-Gendy - Cybersecurity Professional"
                     className="w-full h-full object-cover"
                   />
                   
                   {/* Holographic Overlay */}
                   <div className="absolute inset-0 holographic opacity-40" />
                   
                   {/* Scanning Lines */}
                   <motion.div
                     className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F5FF]/30 to-transparent h-8"
                     animate={{ y: ['-2rem', '24rem'] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   />
                </motion.div>

                {/* Floating Tech Icons */}
                {[
                  { icon: Shield, position: { top: '5%', right: '10%' }, color: '#00F5FF' },
                  { icon: Lock, position: { bottom: '15%', left: '5%' }, color: '#39FF14' },
                  { icon: Terminal, position: { top: '50%', right: '0%' }, color: '#B026FF' },
                  { icon: Code, position: { bottom: '5%', right: '20%' }, color: '#FF073A' },
                  { icon: Database, position: { top: '25%', left: '0%' }, color: '#FFFF00' },
                  { icon: Cpu, position: { bottom: '35%', right: '5%' }, color: '#FF6B35' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-12 h-12 glass-strong rounded-xl flex items-center justify-center"
                    style={item.position}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, 0],
                      boxShadow: [
                        `0 0 20px ${item.color}40`,
                        `0 0 40px ${item.color}60`,
                        `0 0 20px ${item.color}40`
                      ]
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <item.icon size={20} style={{ color: item.color }} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-3"
        >
          <div className="text-xs uppercase tracking-widest neon-text-blue orbitron">
            Enter Cyberspace
          </div>
          <div className="w-6 h-10 border-2 border-[#00F5FF]/60 rounded-full p-1">
            <motion.div
              className="w-2 h-2 bg-[#00F5FF] rounded-full mx-auto"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}