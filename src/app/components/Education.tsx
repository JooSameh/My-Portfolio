import { GraduationCap, Calendar, Award, BookOpen, Trophy, Star, Target } from 'lucide-react';
import { motion } from 'motion/react';

export function Education() {
  const certifications = [
    {
      name: "Financial Literacy & Entrepreneurship",
      issuer: "Agricultural Bank of Egypt (Shmool Initiative)",
      year: "2024",
      status: "Certified",
      category: "Business"
    },
    {
      name: "Financial Literacy Certificate",
      issuer: "EBSM & E-Bank",
      year: "2024",
      status: "Certified",
      category: "Finance"
    },
    {
      name: "Banking Awareness Forum",
      issuer: "EG Bank, OBM & Ministry of Youth & Sports",
      year: "2024",
      status: "Certified",
      category: "Banking"
    },
    {
      name: "Professional Media Diploma",
      issuer: "Nile Media & Nile Today",
      year: "2024",
      status: "Certified",
      category: "Media"
    },
    {
      name: "IT Foundations",
      issuer: "Academy of Scientific Research and Technology (ENSTINET)",
      year: "2024",
      status: "Certified",
      category: "Technology"
    },
    {
      name: "2nd Dan Black Belt - Certified Martial Arts Instructor",
      issuer: "Official Karate Federation",
      year: "2025",
      status: "Certified",
      category: "Athletics"
    }
  ];

  const achievements = [
    {
      title: "Featured Keynote Speaker",
      description: "Young Programmers Conference - Ministry of Youth & Sports Official Recognition",
      year: "Sept 2025"
    },
    {
      title: "Cybersecurity Instructor Excellence",
      description: "Trained 45+ students across 3 cohorts in cybersecurity fundamentals (36+ training hours)",
      year: "2025"
    },
    {
      title: "Head Karate Instructor",
      description: "Cairo Sports Club - 2nd Dan Black Belt directing competitive athletic training",
      year: "2025"
    },
    {
      title: "Guest Lecturer Appointment",
      description: "Elite Academy | iSchool - AI-driven security and Python automation modules",
      year: "2026 (Scheduled)"
    }
  ];

  const mediaTraining = [
    "Broadcasting",
    "Journalism",
    "Public Relations",
    "Marketing",
    "Professional Scriptwriting"
  ];

  return (
    <section id="education" className="py-20 relative overflow-hidden">
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
            Education & <span className="neon-text-blue">Certifications</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto neon-blue"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-strong p-8 rounded-lg border border-[#00F5FF]/20 mb-8">
              <div className="flex items-center mb-6">
                <motion.div
                  className="w-12 h-12 glass rounded-lg flex items-center justify-center mr-4 border border-[#00F5FF]/40"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <GraduationCap className="text-[#00F5FF]" size={24} />
                </motion.div>
                <div>
                  <h3 className="text-xl text-white orbitron">Bachelor of Science</h3>
                  <p className="text-[#00F5FF]">Business Administration</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <Calendar size={16} className="mr-2 text-[#00F5FF]" />
                  <span>2024 - 2027 (Expected)</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <BookOpen size={16} className="mr-2 text-[#00F5FF]" />
                  <span>Akhbar El Yom Academy</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Award size={16} className="mr-2 text-[#00F5FF]" />
                  <span>3rd Year Student (Arabic Section)</span>
                </div>
              </div>

              <h4 className="text-lg text-white mb-4 orbitron">Media Training Coursework</h4>
              <div className="grid grid-cols-1 gap-2">
                {mediaTraining.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center group"
                  >
                    <motion.div
                      className="w-2 h-2 bg-[#00F5FF] rounded-full mr-3"
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="text-gray-300 text-sm group-hover:text-[#E2E8F0] transition-colors fira-code">
                      {course}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl text-white mb-6 orbitron">Professional Certifications</h3>
            <div className="space-y-4 mb-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 245, 255, 0.2)' }}
                  className="glass-strong p-6 rounded-lg border border-[#00F5FF]/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg text-white flex-1">{cert.name}</h4>
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 ml-2">
                      {cert.status}
                    </span>
                  </div>
                  <p className="text-[#00F5FF] text-sm mb-1 fira-code">{cert.issuer}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm">{cert.year}</p>
                    <span className="text-xs px-2 py-1 glass rounded-full border border-[#39FF14]/30 text-[#39FF14]">
                      {cert.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl text-white mb-8 text-center orbitron">Professional Achievements</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
                }}
                className="glass-strong p-6 rounded-lg border border-[#39FF14]/20 hover:border-[#39FF14]/40 transition-colors"
              >
                <div className="flex items-start">
                  <motion.div
                    className="w-3 h-3 bg-[#39FF14] rounded-full mr-4 mt-2 flex-shrink-0"
                    whileHover={{ scale: 1.5 }}
                  />
                  <div>
                    <h4 className="text-lg text-white mb-2 orbitron">{achievement.title}</h4>
                    <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                    <span className="text-[#39FF14] text-xs fira-code">{achievement.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Professional Focus Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass-strong border border-[#B026FF]/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="text-lg text-white mb-2 orbitron">Multidisciplinary Excellence</h4>
            <p className="text-gray-300 text-sm">
              Combining business administration education with cybersecurity expertise, media training, 
              and martial arts discipline. This unique blend creates a comprehensive professional profile 
              bridging technical security, leadership, and communication excellence.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
