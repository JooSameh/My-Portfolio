import { ExternalLink, Github, Shield, Network, Globe, Brain, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function Projects() {
  const projects = [
    {
      title: "Arabic AI Chatbot - Qwen 2.5 Integration",
      description: "Built a custom Arabic language chatbot interface using Python and Gradio, powered by Qwen 2.5 LLM. Features natural language processing optimized for Arabic dialects with intelligent response generation and context awareness.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      tools: ["Python", "Gradio", "Qwen 2.5", "LLM API", "Natural Language Processing"],
      outcome: "Successfully deployed AI-powered chatbot with 90% accuracy in Arabic language comprehension. Integrated advanced conversation flow and context retention mechanisms.",
      github: null,
      demo: null,
      icon: <Brain className="text-[#39FF14]" size={20} />
    },
    {
      title: "Academic Web Portal Vulnerability Assessment",
      description: "Conducted comprehensive security audits on academic web portals to identify and document critical vulnerabilities. Performed systematic penetration testing including SQL injection, XSS, and authentication bypass assessments.",
      image: "https://images.unsplash.com/photo-1483817101829-339b08e8d83f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwc2VjdXJpdHklMjBjb2Rpbmd8ZW58MXx8fHwxNzU4OTkwNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tools: ["Nmap", "Metasploit", "Burp Suite", "OWASP Testing", "Vulnerability Research"],
      outcome: "Identified and reported multiple critical vulnerabilities. Created detailed remediation reports with step-by-step security improvements, leading to enhanced portal security.",
      github: null,
      demo: null,
      icon: <Shield className="text-[#00F5FF]" size={20} />
    },
    {
      title: "Cybersecurity Training Program - Ministry Initiative",
      description: "Designed and delivered a comprehensive cybersecurity training curriculum for 45+ students across 3 cohorts under the Ministry of Youth & Sports. Covered network reconnaissance, secure coding practices, and practical penetration testing scenarios.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      tools: ["Nmap", "Metasploit Framework", "Kali Linux", "Virtual Labs", "Training Materials"],
      outcome: "Successfully trained 45+ students with 36+ hours of hands-on cybersecurity fundamentals. Recognized by Ministry of Youth & Sports as featured instructor and keynote speaker.",
      github: null,
      demo: null,
      icon: <Users className="text-[#B026FF]" size={20} />
    }
  ];

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
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
            Featured <span className="neon-text-blue">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto mb-6 neon-blue"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hands-on projects demonstrating practical skills in offensive security, AI development, and technical instruction
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.01 }}
              className={`glass-strong rounded-lg overflow-hidden border border-[#00F5FF]/20 hover:border-[#00F5FF]/40 transition-all duration-300 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex`}
            >
              {/* Project Image */}
              <div className="lg:w-1/2">
                <div className="relative h-64 lg:h-full">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/20 to-transparent"></div>
                  <motion.div
                    className="absolute top-4 left-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-10 h-10 glass-strong rounded-lg flex items-center justify-center">
                      {project.icon}
                    </div>
                  </motion.div>
                  
                  {/* Holographic scan effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F5FF]/20 to-transparent h-16"
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>

              {/* Project Content */}
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <h3 className="text-2xl text-white mb-4 orbitron">{project.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tools Used */}
                <div className="mb-6">
                  <h4 className="text-[#00F5FF] mb-3 orbitron text-sm">Tools & Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool, toolIndex) => (
                      <motion.span
                        key={toolIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: toolIndex * 0.05 }}
                        whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0, 245, 255, 0.5)' }}
                        className="px-3 py-1 glass text-[#00F5FF] rounded-full text-sm border border-[#00F5FF]/40 fira-code"
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Outcome */}
                <div className="mb-6">
                  <h4 className="text-[#39FF14] mb-2 orbitron text-sm">Outcome & Impact:</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {project.outcome}
                  </p>
                </div>

                {/* Action Buttons */}
                {(project.github || project.demo) && (
                  <div className="flex gap-4">
                    {project.github && (
                      <Button 
                        className="glass-strong border border-[#00F5FF]/40 text-[#00F5FF] hover:bg-[#00F5FF]/20 hover:neon-blue"
                        onClick={() => window.open(project.github, '_blank')}
                      >
                        <Github size={16} className="mr-2" />
                        View Code
                      </Button>
                    )}
                    {project.demo && (
                      <Button 
                        className="glass-strong border border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/20"
                        onClick={() => window.open(project.demo, '_blank')}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Live Demo
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Research Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-strong border border-[#00F5FF]/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="text-lg text-white mb-2 orbitron">Independent Security Research</h4>
            <p className="text-gray-300 text-sm">
              Actively engaged in vulnerability research and security auditing. Published findings have 
              contributed to improved security practices in educational institutions and web applications.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
