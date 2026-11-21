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

        {/* Credentials & Discipline Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-strong p-6 rounded-xl border border-[#00F5FF]/30 hover:border-[#00F5FF] transition-all">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center mb-4 border border-[#00F5FF]/40">
                <Shield className="text-[#00F5FF]" size={20} />
              </div>
              <h4 className="text-white orbitron font-bold mb-1 text-sm">Specialization</h4>
              <p className="text-gray-300 text-xs fira-code leading-relaxed">
                Offensive Security, Vulnerability Research & AI Model Integration
              </p>
            </div>

            <div className="glass-strong p-6 rounded-xl border border-[#39FF14]/30 hover:border-[#39FF14] transition-all">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center mb-4 border border-[#39FF14]/40">
                <Award className="text-[#39FF14]" size={20} />
              </div>
              <h4 className="text-white orbitron font-bold mb-1 text-sm">Martial Arts Captain</h4>
              <p className="text-gray-300 text-xs fira-code leading-relaxed">
                2nd Dan Black Belt Karate Instructor at Cairo Sports Club
              </p>
            </div>

            <div className="glass-strong p-6 rounded-xl border border-[#B026FF]/30 hover:border-[#B026FF] transition-all">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center mb-4 border border-[#B026FF]/40">
                <Users className="text-[#B026FF]" size={20} />
              </div>
              <h4 className="text-white orbitron font-bold mb-1 text-sm">Govt. Instructor</h4>
              <p className="text-gray-300 text-xs fira-code leading-relaxed">
                Youth & Sports Ministry Keynote Speaker; Trained 45+ Students
              </p>
            </div>

            <div className="glass-strong p-6 rounded-xl border border-[#FFFF00]/30 hover:border-[#FFFF00] transition-all">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center mb-4 border border-[#FFFF00]/40">
                <Brain className="text-[#FFFF00]" size={20} />
              </div>
              <h4 className="text-white orbitron font-bold mb-1 text-sm">Languages & Status</h4>
              <p className="text-gray-300 text-xs fira-code leading-relaxed">
                Arabic (Native), English (Fluent) • Military Postponed (Student)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.a
            href="https://www.linkedin.com/in/youssef-el-gendy-1b6b95369"
            target="_blank"
            rel="noopener"
            referrerPolicy="strict-origin-when-cross-origin"
            className="glass-strong px-8 py-4 rounded-full orbitron border border-[#00F5FF]/40 text-[#00F5FF] hover:bg-[#00F5FF]/20 hover:neon-blue transition-all duration-300 flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={20} />
            <span>Connect on LinkedIn</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}