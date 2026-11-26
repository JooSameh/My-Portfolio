import { useEffect, useState } from 'react';
import { 
  Shield, Code, Terminal, Lock, Zap, Eye, Cpu, Database, Binary, HardDrive
} from 'lucide-react';
import { m } from 'motion/react';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [profileImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('custom_profile_image');
      if (
        saved &&
        saved !== '/profile.png' &&
        (/^\/[a-zA-Z0-9._/-]+$/.test(saved) || /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/.test(saved))
      ) {
        return saved;
      }
      return '/profile.webp';
    } catch {
      return '/profile.webp';
    }
  });

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

  // Cyberpunk matrix & binary decorative symbols
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

        {/* Matrix Rain Effect - Cyberpunk Visual Aesthetics */}
        <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none select-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <m.div
              key={i}
              className="absolute select-none fira-code pointer-events-none"
              style={{
                left: `${(i * 4) + 1}%`,
                fontSize: `${(i % 3) * 3 + 9}px`,
                color: i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#39FF14' : '#94A3B8'
              }}
              animate={{
                y: ['-10vh', '110vh'],
              }}
              transition={{
                duration: (i % 4) + 3.5,
                repeat: Infinity,
                delay: (i % 5) * 0.7,
                ease: "linear"
              }}
            >
              {Array.from({ length: 18 }).map((_, j) => (
                <div key={j} style={{ opacity: 1 - (j * 0.05) }}>
                  {i % 2 === 0 
                    ? matrixChars[(i + j) % matrixChars.length]
                    : binaryChars[(i * 2 + j) % binaryChars.length]
                  }
                </div>
              ))}
            </m.div>
          ))}
        </div>

        {/* Floating geometric shapes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <m.div
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
          </m.div>
        ))}

        {/* Large glowing orbs */}
        <m.div
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
        <m.div
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

      {/* Cyber Defense Status HUD Node */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-24 lg:top-28 right-8 glass-strong rounded-xl p-3.5 z-20 hidden lg:block border border-[#00F5FF]/30 select-none shadow-[0_0_20px_rgba(0,245,255,0.15)]"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
            </span>
            <span className="text-[10px] text-[#39FF14] uppercase tracking-wider fira-code font-bold">DEFENSE ACTIVE</span>
          </div>
          <div className="text-[11px] fira-code text-gray-400 space-y-0.5 border-t border-white/10 pt-1.5">
            <div className="flex justify-between gap-4">
              <span>FIREWALL:</span>
              <span className="text-[#00F5FF]">ENFORCED</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>THREAT LEVEL:</span>
              <span className="text-[#39FF14]">SECURE</span>
            </div>
          </div>
        </div>
      </m.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <m.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Security Badge */}
            <m.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full"
            >
              <Shield size={16} className="text-[#39FF14]" />
              <span className="text-xs uppercase tracking-widest neon-text-green orbitron">
                Cybersecurity Specialist & Technical Instructor
              </span>
            </m.div>
              
            {/* Main Title with Holographic Effect */}
            <div className="space-y-6">
              <m.h1 
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl lg:text-9xl tracking-tight orbitron"
              >
                <span 
                  className="block text-white"
                  style={{ textShadow: '0 0 24px rgba(0,245,255,0.35)' }}
                >
                  Youssef
                </span>
                <span 
                  className="block bg-gradient-to-r from-[#00F5FF] via-[#39FF14] to-[#00F5FF] bg-clip-text text-transparent holographic"
                >
                  EL-Gendy
                </span>
              </m.h1>

              <m.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h2 className="text-2xl lg:text-3xl text-[#E2E8F0]">
                  Cybersecurity Instructor & <span className="neon-text-blue">AI Developer</span>
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-lg text-[#94A3B8]">
                  <Terminal size={20} className="text-[#00F5FF] pulse-neon" />
                  <span className="fira-code">Offensive Security & AI-Driven Solutions</span>
                </div>
              </m.div>
            </div>

            {/* Enhanced Description */}
            <m.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-xl"
            >
              <p className="text-lg text-[#E2E8F0] leading-relaxed">
                Ministry of Youth & Sports certified instructor training 45+ students in cybersecurity fundamentals. 
                Specializing in <span className="neon-text-blue">penetration testing</span>, 
                <span className="neon-text-green"> AI development</span>, and 
                offensive security research. Keynote speaker combining technical expertise with leadership excellence.
              </p>
            </m.div>

            {/* Animated Stats */}
            <m.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-6"
            >
              {[
                { value: '45+', label: 'Students Trained', color: '#00F5FF' },
                { value: '36+', label: 'Training Hours', color: '#39FF14' },
                { value: '2nd Dan', label: 'Karate Black Belt', color: '#B026FF' }
              ].map((stat, index) => (
                <m.div
                  key={index}
                  className="glass-strong p-4 rounded-xl text-center"
                  style={{ boxShadow: `0 0 28px ${stat.color}25` }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-2 orbitron" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#94A3B8] uppercase tracking-wide">
                    {stat.label}
                  </div>
                </m.div>
              ))}
            </m.div>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <m.button
                onClick={scrollToAbout}
                className="glass-strong px-8 py-4 rounded-full text-lg orbitron neon-blue hover:neon-green transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-3">
                  <Eye size={20} />
                  <span>Explore Arsenal</span>
                </div>
              </m.button>
              <m.a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=youssefs.sec@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-8 py-4 rounded-full text-lg border border-[#00F5FF]/50 text-[#00F5FF] hover:bg-[#00F5FF]/10 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-3">
                  <Zap size={20} />
                  <span>Initialize Contact</span>
                </div>
              </m.a>
            </m.div>

            {/* Floating Skill Tags */}
            <m.div
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
                <m.div
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
                </m.div>
              ))}
            </m.div>
          </m.div>

          {/* Right Content - 3D Profile Display */}
          <m.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center lg:justify-end perspective-1000"
          >
            <div className="relative preserve-3d">
              {/* Holographic Frame */}
              <m.div
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
                <m.div
                  className="absolute -inset-12 rounded-full border-2 border-[#00F5FF]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Middle Pulse Ring */}
                <m.div
                  className="absolute -inset-8 rounded-full border border-[#39FF14]/40"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Main Profile Container */}
                <div
                  className="w-80 h-80 sm:w-96 sm:h-96 rounded-full glass-strong relative overflow-hidden select-none bg-gradient-to-b from-[#0D1421] via-[#0A0F1C] to-[#0A0F1C] flex items-end justify-center shadow-[0_0_60px_rgba(0,245,255,0.3)]"
                >
                   {/* Pure Cyber Glow Backgrounds */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,245,255,0.25)_0%,transparent_70%)] pointer-events-none" />
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(57,255,20,0.15)_0%,transparent_60%)] pointer-events-none" />

                   {/* Profile Image with Touch & Right-Click Shield */}
                   <img
                     src={profileImage}
                     alt="Youssef Sameh EL-Gendy - Cybersecurity Professional"
                     width={300}
                     height={400}
                     {...{ fetchpriority: 'high' }}
                     draggable={false}
                     onContextMenu={(e) => e.preventDefault()}
                     onDragStart={(e) => e.preventDefault()}
                     className="w-full h-full object-contain object-bottom relative z-10 drop-shadow-[0_15px_30px_rgba(0,245,255,0.35)] scale-105 origin-bottom transition-transform duration-300 pointer-events-none select-none"
                   />

                   {/* Transparent Touch & Click Protection Shield */}
                   <div 
                     className="absolute inset-0 z-25 bg-transparent select-none image-shield" 
                     onContextMenu={(e) => e.preventDefault()}
                     onDragStart={(e) => e.preventDefault()}
                   />

                   {/* Smooth Bottom Gradient Blend */}
                   <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0A0F1C] to-transparent pointer-events-none z-15" />
                   
                   {/* Holographic Overlay */}
                   <div className="absolute inset-0 holographic opacity-20 pointer-events-none z-20" />
                   
                   {/* Scanning Lines */}
                   <m.div
                     className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F5FF]/30 to-transparent h-8 pointer-events-none z-20"
                     animate={{ y: ['-2rem', '24rem'] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   />
                </div>

                {/* Floating Tech Icons */}
                {[
                  { icon: Shield, position: { top: '5%', right: '10%' }, color: '#00F5FF' },
                  { icon: Lock, position: { bottom: '15%', left: '5%' }, color: '#39FF14' },
                  { icon: Terminal, position: { top: '50%', right: '0%' }, color: '#B026FF' },
                  { icon: Code, position: { bottom: '5%', right: '20%' }, color: '#FF073A' },
                  { icon: Database, position: { top: '25%', left: '0%' }, color: '#FFFF00' },
                  { icon: Cpu, position: { bottom: '35%', right: '5%' }, color: '#FF6B35' },
                ].map((item, index) => (
                  <m.div
                    key={index}
                    className="absolute w-12 h-12 glass-strong rounded-xl flex items-center justify-center"
                    style={{
                      ...item.position,
                      boxShadow: `0 0 25px ${item.color}40`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, 0],
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
                  </m.div>
                ))}
              </m.div>
            </div>
          </m.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <m.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-3"
        >
          <div className="text-xs uppercase tracking-widest neon-text-blue orbitron">
            Enter Cyberspace
          </div>
          <div className="w-6 h-10 border-2 border-[#00F5FF]/60 rounded-full p-1">
            <m.div
              className="w-2 h-2 bg-[#00F5FF] rounded-full mx-auto"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
