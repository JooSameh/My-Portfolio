import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    botField: '' // Honeypot field for bot protection
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data Obfuscation to prevent scraping bots from grabbing your email/phone directly
  const contactInfo = {
    emailUser: 'youssefs.sec',
    emailDomain: 'gmail.com',
    phoneCode: '+20',
    phoneNumber: '106 997 5376'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Bot Protection (Honeypot Check)
    if (formData.botField !== '') {
      console.warn('Bot submission detected and blocked.');
      return; // Silently fail
    }

    setIsSubmitting(true);

    try {
      // 2. Real API Call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (!response.ok) {
         if (response.status === 429) {
            throw new Error('أرسلت طلبات كثيرة. يرجى المحاولة لاحقاً.');
         }
         throw new Error('فشل إرسال الرسالة');
      }

      toast.success('Message sent successfully! I\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        botField: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while sending the message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
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
            Get In <span className="neon-text-blue">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-[#00F5FF] mx-auto mb-6 neon-blue"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to discuss cybersecurity training, AI development projects, or collaboration opportunities? 
            I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl text-white mb-8 orbitron">Let's Connect</h3>
            
            <div className="space-y-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)' }}
                className="flex items-center glass-strong p-4 rounded-lg border border-[#00F5FF]/20"
              >
                <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mr-4 border border-[#00F5FF]/40">
                  <Mail className="text-[#00F5FF]" size={20} />
                </div>
                <div>
                  <h4 className="text-white orbitron">Email</h4>
                  <a href={`mailto:${contactInfo.emailUser}@${contactInfo.emailDomain}`} className="text-gray-400 hover:text-[#00F5FF] transition-colors fira-code text-sm">
                    {contactInfo.emailUser}@{contactInfo.emailDomain}
                  </a>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' }}
                className="flex items-center glass-strong p-4 rounded-lg border border-[#39FF14]/20"
              >
                <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mr-4 border border-[#39FF14]/40">
                  <Phone className="text-[#39FF14]" size={20} />
                </div>
                <div>
                  <h4 className="text-white orbitron">Phone</h4>
                  <a href={`tel:${contactInfo.phoneCode}${contactInfo.phoneNumber.replace(/\s/g, '')}`} className="text-gray-400 hover:text-[#39FF14] transition-colors fira-code text-sm">
                    {contactInfo.phoneCode} {contactInfo.phoneNumber}
                  </a>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(176, 38, 255, 0.3)' }}
                className="flex items-center glass-strong p-4 rounded-lg border border-[#B026FF]/20"
              >
                <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mr-4 border border-[#B026FF]/40">
                  <MapPin className="text-[#B026FF]" size={20} />
                </div>
                <div>
                  <h4 className="text-white orbitron">Location</h4>
                  <span className="text-gray-400 fira-code text-sm">27 Ammar Hassan St. - Ezz El Din Omar Ext., Cairo, Egypt</span>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="mb-8">
              <h4 className="text-white mb-4 orbitron">Follow Me</h4>
              <div className="flex space-x-4">
                <motion.a
                  href="https://www.linkedin.com/in/youssef-el-gendy-1b6b95369/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)' }}
                  className="w-12 h-12 glass-strong rounded-lg flex items-center justify-center border border-[#00F5FF]/40 transition-all"
                >
                  <Linkedin className="text-[#00F5FF]" size={20} />
                </motion.a>
                <motion.a
                  href="https://github.com/JooSameh"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)' }}
                  className="w-12 h-12 glass-strong rounded-lg flex items-center justify-center border border-[#39FF14]/40 transition-all"
                >
                  <Github className="text-[#39FF14]" size={20} />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl text-white mb-8 orbitron">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot Field - Hidden from real users */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="botField">Don't fill this out if you're human:</label>
                <Input
                  type="text"
                  id="botField"
                  name="botField"
                  value={formData.botField}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-2 fira-code">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100} // Input constraint
                    className="glass-strong border-[#00F5FF]/20 text-white placeholder:text-gray-500 focus:border-[#00F5FF] fira-code"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-2 fira-code">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={150} // Input constraint
                    className="glass-strong border-[#00F5FF]/20 text-white placeholder:text-gray-500 focus:border-[#00F5FF] fira-code"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm text-gray-400 mb-2 fira-code">
                  Subject
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={150} // Input constraint
                  className="glass-strong border-[#00F5FF]/20 text-white placeholder:text-gray-500 focus:border-[#00F5FF] fira-code"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-400 mb-2 fira-code">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  maxLength={2000} // Input constraint to prevent massive payloads
                  className="glass-strong border-[#00F5FF]/20 text-white placeholder:text-gray-500 focus:border-[#00F5FF] resize-none fira-code"
                  placeholder="Tell me about your project, opportunity, or just say hello..."
                  required
                />
                {/* Character Counter */}
                <div className="text-right mt-1 text-xs text-gray-500">
                  {formData.message.length} / 2000
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glass-strong border border-[#00F5FF]/40 text-[#00F5FF] hover:bg-[#00F5FF]/20 hover:neon-blue orbitron disabled:opacity-50"
                >
                  <Send size={16} className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 p-4 glass border border-[#39FF14]/30 rounded-lg">
              <p className="text-gray-300 text-sm fira-code">
                <strong className="text-[#39FF14]">Response Time:</strong> I typically respond within 24 hours. 
                For urgent matters, feel free to reach out via phone or LinkedIn.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}