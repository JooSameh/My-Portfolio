import { Shield, Code, Network, Users, Award, Mic, Brain } from 'lucide-react';
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
            About <span className="neon-text-blue">Me</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto neon-blue"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              I am a <span className="neon-text-blue">Cybersecurity Specialist and Technical Instructor</span> with 
              a focus on offensive security and AI development. Recognized by the Ministry of Youth & Sports 
              for training <span className="neon-text-green">45+ students</span> across 3 cohorts in cybersecurity 
              fundamentals and network reconnaissance.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              As a featured <span className="neon-text-blue">Keynote Speaker</span> at the "Young Programmers Conference" 
              and a 2nd Dan Karate Captain at Cairo Sports Club, I combine technical expertise with discipline and 
              leadership. My work spans penetration testing, AI-driven interfaces, and independent security research 
              on academic web portals.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)' }}
                className="text-center p-4 glass rounded-lg border border-[#00F5FF]/20"
              >
                <div className="w-12 h-12 glass-strong rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="text-[#00F5FF]" size={24} />
                </div>
                <h3 className="text-white mb-2 orbitron">Teaching Excellence</h3>
                <p className="text-gray-400 text-sm">Training next-gen security professionals</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(57, 255, 20, 0.3)' }}
                className="text-center p-4 glass rounded-lg border border-[#39FF14]/20"
              >
                <div className="w-12 h-12 glass-strong rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="text-[#39FF14]" size={24} />
                </div>
                <h3 className="text-white mb-2 orbitron">AI Development</h3>
                <p className="text-gray-400 text-sm">Building intelligent security solutions</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(176, 38, 255, 0.3)' }}
                className="text-center p-4 glass rounded-lg border border-[#B026FF]/20"
              >
                <div className="w-12 h-12 glass-strong rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mic className="text-[#B026FF]" size={24} />
                </div>
                <h3 className="text-white mb-2 orbitron">Public Speaking</h3>
                <p className="text-gray-400 text-sm">Featured conference keynote speaker</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-strong p-6 rounded-lg border border-[#00F5FF]/20">
              <h3 className="text-xl text-white mb-4 orbitron">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-[#00F5FF]">Cairo, Egypt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-[#00F5FF] text-sm">youssefs.sec@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-[#00F5FF]">+20 106 997 5376</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Languages:</span>
                  <span className="text-[#00F5FF]">Arabic (Native), English (Fluent)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Martial Arts:</span>
                  <span className="text-[#00F5FF]">2nd Dan Black Belt</span>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 rounded-lg border border-[#39FF14]/20">
              <h3 className="text-xl text-white mb-4 orbitron">Career Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#00F5FF] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">
                    <span className="text-[#00F5FF]">Ministry of Youth & Sports:</span> Cybersecurity Instructor & Keynote Speaker
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#39FF14] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">
                    <span className="text-[#39FF14]">Young Programmers Conference:</span> Featured Speaker (Sept 8th)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#B026FF] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">
                    <span className="text-[#B026FF]">Cairo Sports Club:</span> Head Karate Instructor (2nd Dan)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FF073A] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">
                    <span className="text-[#FF073A]">Elite Academy | iSchool:</span> Guest Lecturer (Scheduled 2026)
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-strong p-6 rounded-lg border border-[#B026FF]/20">
              <h3 className="text-xl text-white mb-4 orbitron">Professional Focus</h3>
              <p className="text-gray-300">
                Specializing in <span className="neon-text-blue">offensive security</span>, <span className="neon-text-green">AI-driven automation</span>, 
                and vulnerability research. Passionate about educating the next generation of cybersecurity 
                professionals and bridging the gap between traditional security and artificial intelligence.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
