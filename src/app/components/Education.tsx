import { GraduationCap, Calendar, Award, BookOpen, Shield, Brain, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export function Education() {
  const mediaTraining = [
    "Broadcasting & Television Presentation",
    "Investigative Journalism & Reporting",
    "Strategic Public Relations & Media Protocols",
    "Digital Marketing & Audience Engagement",
    "Professional Scriptwriting & Content Architecture"
  ];

  const academicFocus = [
    {
      title: "Information Systems & Tech Management",
      description: "Bridging enterprise administration with modern cybersecurity governance and risk management.",
      icon: Shield,
      color: "#00F5FF"
    },
    {
      title: "AI & Digital Transformation",
      description: "Applying artificial intelligence automation and LLM workflows to streamline organizational operations.",
      icon: Brain,
      color: "#39FF14"
    },
    {
      title: "Executive Communication & Leadership",
      description: "Combining academic business strategy with public speaking, media diplomacy, and team leadership.",
      icon: Globe,
      color: "#B026FF"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
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
            Academic <span className="neon-text-blue">Foundation</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto neon-blue"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* University Degree & Media Coursework */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex"
          >
            <div className="glass-strong p-8 rounded-xl border border-[#00F5FF]/20 w-full flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-14 h-14 glass rounded-xl flex items-center justify-center mr-4 border border-[#00F5FF]/40"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap className="text-[#00F5FF]" size={28} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl text-white orbitron">Bachelor of Science</h3>
                    <p className="text-[#00F5FF] fira-code text-sm">Business Administration</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 p-4 glass rounded-lg border border-white/5">
                  <div className="flex items-center text-gray-300 text-sm fira-code">
                    <BookOpen size={16} className="mr-3 text-[#00F5FF]" />
                    <span>Akhbar El Yom Academy</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm fira-code">
                    <Calendar size={16} className="mr-3 text-[#39FF14]" />
                    <span>2024 – 2027 (Expected)</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm fira-code">
                    <Award size={16} className="mr-3 text-[#B026FF]" />
                    <span>3rd Year Undergraduate (Arabic Section)</span>
                  </div>
                </div>

                <h4 className="text-lg text-white mb-4 orbitron">Media & Communication Coursework</h4>
                <div className="space-y-2.5">
                  {mediaTraining.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="flex items-center group"
                    >
                      <motion.div
                        className="w-2 h-2 bg-[#00F5FF] rounded-full mr-3 flex-shrink-0"
                        whileHover={{ scale: 1.5 }}
                      />
                      <span className="text-gray-300 text-sm group-hover:text-[#E2E8F0] transition-colors fira-code">
                        {course}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Academic Focus & Multidisciplinary Synergy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between space-y-6"
          >
            {academicFocus.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${item.color}25` }}
                className="glass-strong p-6 rounded-xl border transition-all"
                style={{ borderColor: `${item.color}30` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 glass rounded-xl flex items-center justify-center border flex-shrink-0"
                    style={{ borderColor: `${item.color}50` }}
                  >
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="text-lg text-white orbitron mb-1.5">{item.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
