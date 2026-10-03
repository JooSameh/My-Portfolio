import { Code, Shield, Server, Database, Cloud, Terminal, Brain, Users } from 'lucide-react';
import { motion } from 'motion/react';

export function Skills() {
  const skillCategories = [
    {
      title: "Offensive Security",
      icon: <Shield className="text-[#00F5FF]" size={24} />,
      skills: ["Penetration Testing", "Nmap", "Metasploit Framework", "Vulnerability Research", "Network Reconnaissance", "Security Auditing"],
      color: '#00F5FF'
    },
    {
      title: "AI & Development",
      icon: <Brain className="text-[#39FF14]" size={24} />,
      skills: ["Python", "Gradio", "LLM API Integration", "Qwen 2.5", "Full-Stack Web Development", "AI Automation"],
      color: '#39FF14'
    },
    {
      title: "Systems & Infrastructure",
      icon: <Server className="text-[#B026FF]" size={24} />,
      skills: ["OS Security", "File System Migration (NTFS/FAT32)", "Hardware Troubleshooting", "Linux Administration", "Windows Server"],
      color: '#B026FF'
    },
    {
      title: "Software & Tools",
      icon: <Code className="text-[#FF073A]" size={24} />,
      skills: ["Scapy (Packet Analysis)", "SQLite (Secure DB)", "XSS Mitigation Tools", "Burp Suite", "Professional Scriptwriting"],
      color: '#FF073A'
    },
    {
      title: "Leadership & Training",
      icon: <Users className="text-[#FFFF00]" size={24} />,
      skills: ["Technical Team Leadership", "Public Speaking", "Conference Organizing", "Student Mentoring", "Curriculum Development"],
      color: '#FFFF00'
    },
    {
      title: "Media & Communication",
      icon: <Terminal className="text-[#FF6B35]" size={24} />,
      skills: ["PR & Conference Organizing", "Broadcasting", "Journalism", "Marketing", "Professional Writing"],
      color: '#FF6B35'
    }
  ];

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C] via-[#0D1421] to-[#0A0F1C]" />
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20"
        style={{ 
          left: '10%', 
          top: '20%',
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl mb-4 text-white orbitron">
            Technical <span className="neon-text-blue">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto mb-6 neon-blue"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A comprehensive skillset covering offensive security, AI development, and technical instruction
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 0 40px ${category.color}40`
              }}
              className="glass-strong p-6 rounded-lg border transition-all duration-300"
              style={{ borderColor: `${category.color}20` }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  className="w-12 h-12 glass rounded-lg flex items-center justify-center mr-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{ borderColor: `${category.color}40`, borderWidth: 1 }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="text-lg text-white orbitron">{category.title}</h3>
              </div>
              
              <div className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index * 0.1) + (skillIndex * 0.05) }}
                    className="flex items-center group"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="text-gray-300 text-sm group-hover:text-[#E2E8F0] transition-colors fira-code">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Competencies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl text-white mb-8 orbitron">Core Competencies</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Penetration Testing", color: '#00F5FF' },
              { label: "AI Development", color: '#39FF14' },
              { label: "Technical Instruction", color: '#B026FF' },
              { label: "Vulnerability Research", color: '#FF073A' },
              { label: "Public Speaking", color: '#FFFF00' },
              { label: "Team Leadership", color: '#FF6B35' },
              { label: "Security Auditing", color: '#00F5FF' },
              { label: "Conference Organization", color: '#39FF14' }
            ].map((competency, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: `0 0 20px ${competency.color}60`
                }}
                className="px-4 py-2 glass rounded-full border transition-all cursor-default fira-code"
                style={{ 
                  borderColor: `${competency.color}40`,
                  color: competency.color
                }}
              >
                {competency.label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
