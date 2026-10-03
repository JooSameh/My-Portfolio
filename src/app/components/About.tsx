import { Shield, Code, Network, Users, Award, Mic, Brain, Download } from 'lucide-react';
import { motion } from 'motion/react';

export function About() {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
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
            Professional <span className="neon-text-blue">Objective</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto neon-blue"></div>
        </motion.div>

        {/* Objective Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong p-8 rounded-lg border border-[#00F5FF]/20 mb-12"
        >
          <p className="text-gray-300 text-lg leading-relaxed text-center">
            A <span className="neon-text-blue">Cybersecurity Specialist and Technical Instructor</span> with a focus on offensive security and AI development. 
            Recognized for training <span className="neon-text-green">45+ students</span> in national initiatives under the Ministry of Youth & Sports. 
            Proven Technical Team Lead experienced in managing development cohorts and AI-driven interfaces. 
            A <span className="neon-text-blue">2nd Dan Karate Captain</span> at Cairo Sports Club, combining high-level discipline with a track record 
            in public speaking and independent security research.
          </p>
        </motion.div>

        {/* Personal Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-3xl mb-8 text-white orbitron text-center">
            Personal <span className="neon-text-blue">Details</span>
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-strong p-6 rounded-lg border border-[#00F5FF]/20">
              <h4 className="text-xl text-white mb-4 orbitron">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Full Name:</span>
                  <span className="text-[#00F5FF]">Youssef Sameh EL-Gendy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date of Birth:</span>
                  <span className="text-[#00F5FF]">June 21, 2005</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-[#00F5FF] text-sm">youssefs.sec@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-[#00F5FF]">+20 106 997 5376</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 mb-1">Address:</span>
                  <span className="text-[#00F5FF] text-sm">27 Ammar Hassan St. - Ezz El Din Omar Ext., Cairo, Egypt</span>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 rounded-lg border border-[#39FF14]/20">
              <h4 className="text-xl text-white mb-4 orbitron">Additional Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Languages:</span>
                  <span className="text-[#00F5FF]">Arabic (Native), English (Fluent)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Military Status:</span>
                  <span className="text-[#00F5FF]">Postponed (Student)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Martial Arts:</span>
                  <span className="text-[#00F5FF]">2nd Dan Black Belt</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">LinkedIn:</span>
                  <a
                    href="https://www.linkedin.com/in/youssef-el-gendy-1b6b95369/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00F5FF] hover:underline hover:text-white transition-colors text-sm fira-code"
                  >
                    youssef-el-gendy
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">GitHub:</span>
                  <a
                    href="https://github.com/JooSameh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#39FF14] hover:underline hover:text-white transition-colors text-sm fira-code"
                  >
                    github.com/JooSameh
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download CV Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-16"
        >
          <motion.a
            href="https://www.linkedin.com/in/youssef-el-gendy-1b6b95369/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-strong px-8 py-4 rounded-full orbitron border border-[#00F5FF]/40 text-[#00F5FF] hover:bg-[#00F5FF]/20 hover:neon-blue transition-all duration-300 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={20} />
            <span>View Full CV on LinkedIn</span>
          </motion.a>
        </motion.div>

        {/* Professional Focus Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="glass-strong p-6 rounded-lg border border-[#00F5FF]/20">
              <Shield size={40} className="text-[#00F5FF] mb-4" />
              <h4 className="text-xl text-white mb-4 orbitron">Cybersecurity</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Specialized in offensive security, penetration testing, and vulnerability assessment.
              </p>
            </div>

            <div className="glass-strong p-6 rounded-lg border border-[#00F5FF]/20">
              <Code size={40} className="text-[#00F5FF] mb-4" />
              <h4 className="text-xl text-white mb-4 orbitron">AI Development</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Expert in developing AI-driven interfaces and machine learning models.
              </p>
            </div>

            <div className="glass-strong p-6 rounded-lg border border-[#00F5FF]/20">
              <Network size={40} className="text-[#00F5FF] mb-4" />
              <h4 className="text-xl text-white mb-4 orbitron">Network Security</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Proficient in network security, firewall management, and intrusion detection systems.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}