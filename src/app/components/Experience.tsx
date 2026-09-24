import { Briefcase, Calendar, MapPin, Users, Award, Code, Shield, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export function Experience() {
  const experiences = [
    {
      title: "Cybersecurity Instructor & Keynote Speaker",
      organization: "Ministry of Youth & Sports",
      period: "Sept 2025 – Present",
      location: "Cairo, Egypt",
      type: "Government Initiative",
      achievements: [
        "Featured Keynote Speaker at the 'Young Programmers Conference' (Sept 8th); recognized on official Ministry platforms",
        "Trained 45+ students (3 cohorts) in Cybersecurity Fundamentals",
        "Delivered 36+ hours of practical training in network reconnaissance and secure coding",
        "Developed comprehensive curriculum covering offensive security principles and ethical hacking"
      ],
      color: "#00F5FF",
      icon: Shield
    },
    {
      title: "Head Karate Instructor (2nd Dan)",
      organization: "Cairo Sports Club",
      period: "March 2025 – Present",
      location: "Cairo, Egypt",
      type: "Athletic Leadership",
      achievements: [
        "Directing athletic training for competitive teams",
        "Fostering discipline and strategic leadership among athletes",
        "Managing training programs for students of all skill levels",
        "Implementing structured development pathways for competitive excellence"
      ],
      color: "#39FF14",
      icon: Trophy
    },
    {
      title: "Guest Lecturer (Upcoming)",
      organization: "Elite Academy | iSchool",
      period: "Scheduled 2026",
      location: "Cairo, Egypt",
      type: "Education",
      achievements: [
        "Contracted to deliver specialized modules on AI-driven security",
        "Teaching Python automation for youth cybersecurity programs",
        "Developing hands-on curriculum integrating AI and security concepts",
        "Mentoring next generation of security professionals"
      ],
      color: "#B026FF",
      icon: Code
    }
  ];

  const researchProjects = [
    {
      title: "Vulnerability Assessment",
      description: "Conducted security audits on academic web portals; identified and reported critical vulnerabilities",
      icon: Shield,
      color: "#00F5FF"
    },
    {
      title: "Arabic AI Project",
      description: "Built a custom chatbot interface using Python & Gradio powered by Qwen 2.5 for Arabic language processing",
      icon: Code,
      color: "#39FF14"
    }
  ];

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
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
            Professional <span className="neon-text-blue">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto neon-blue"></div>
        </motion.div>

        {/* Experience Timeline */}
        <div className="space-y-8 mb-16">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 0 30px ${exp.color}40`
              }}
              className="glass-strong p-6 rounded-lg border"
              style={{ borderColor: `${exp.color}40` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex items-start gap-4 mb-4 lg:mb-0">
                  <motion.div
                    className="w-14 h-14 glass rounded-lg flex items-center justify-center border flex-shrink-0"
                    style={{ borderColor: `${exp.color}60` }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <exp.icon size={24} style={{ color: exp.color }} />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-xl text-white orbitron mb-1">{exp.title}</h3>
                    <p className="text-lg mb-2" style={{ color: exp.color }}>{exp.organization}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} style={{ color: exp.color }} />
                        <span className="fira-code">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} style={{ color: exp.color }} />
                        <span className="fira-code">{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <span 
                  className="px-3 py-1 rounded-full text-xs border self-start"
                  style={{ 
                    borderColor: `${exp.color}40`,
                    color: exp.color,
                    backgroundColor: `${exp.color}10`
                  }}
                >
                  {exp.type}
                </span>
              </div>

              <div className="space-y-2 ml-0 lg:ml-[72px]">
                {exp.achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: exp.color }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="text-gray-300 text-sm group-hover:text-[#E2E8F0] transition-colors">
                      {achievement}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Independent Research Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl text-white mb-8 text-center orbitron">
            Independent Research & <span className="neon-text-blue">Projects</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {researchProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 0 30px ${project.color}30`
                }}
                className="glass-strong p-6 rounded-lg border"
                style={{ borderColor: `${project.color}30` }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 glass rounded-lg flex items-center justify-center border flex-shrink-0"
                    style={{ borderColor: `${project.color}40` }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <project.icon size={20} style={{ color: project.color }} />
                  </motion.div>
                  
                  <div>
                    <h4 className="text-lg text-white mb-2 orbitron">{project.title}</h4>
                    <p className="text-gray-300 text-sm">{project.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Core Competencies Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass-strong border border-[#00F5FF]/30 rounded-lg p-6 max-w-3xl mx-auto">
            <h4 className="text-lg text-white mb-3 orbitron">Core Competencies</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "Technical Team Leadership",
                "Public Speaking",
                "PR & Conference Organizing",
                "Professional Scriptwriting",
                "Curriculum Development",
                "Security Research"
              ].map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-4 py-2 glass rounded-full text-sm border border-[#00F5FF]/30 text-[#00F5FF] fira-code"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
