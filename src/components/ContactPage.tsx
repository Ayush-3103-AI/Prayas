import { useState } from 'react';
import { Leaf, Mail, Phone, MapPin, Send, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      question: 'How do I book a pickup?',
      answer: 'Simply sign up, log in, and click on "Book Pickup" in your dashboard. Fill in the details about your recyclable waste, select a preferred date and time, choose an NGO, and submit. An agent will be assigned to you shortly.',
    },
    {
      question: 'What types of waste can I recycle?',
      answer: 'We accept plastic, paper, metal, e-waste, and glass. Make sure the items are clean and dry. Hazardous materials like batteries and chemicals are not accepted.',
    },
    {
      question: 'How is the donation amount calculated?',
      answer: 'The donation amount is based on the weight and type of recyclable material collected. Different materials have different market values. The entire value goes directly to your chosen NGO.',
    },
    {
      question: 'Can I track my pickup?',
      answer: 'Yes! Go to the "Pickup Status" page to see real-time updates on your pickup, including when the agent is assigned, on the way, and when the waste is collected.',
    },
    {
      question: 'How do I earn badges?',
      answer: 'Badges are earned by reaching recycling milestones, maintaining streaks, referring friends, and making significant donations. Check your Impact page to see all available badges and your progress.',
    },
  ];

  return (
      <div className="min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a100c]/70 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[#3d2817]" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-semibold text-[#3d2817] tracking-wide">PRAYAS</span>
              </div>
              <Button onClick={() => onNavigate('landing')} variant="outline">
                Back to Home
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl text-[#3d2817] mb-6 text-center">Contact Us</h1>
            <p className="text-xl text-[#3d2817]/60 text-center mb-12">
              Have questions? We're here to help!
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <RecycledPaperCard className="p-6" glowColor="emerald">
                <Mail className="w-8 h-8 text-emerald-400 mb-4" strokeWidth={2} />
                <h3 className="text-xl text-[#3d2817] mb-2">Email</h3>
                <p className="text-[#3d2817]/60">support@prayas.org</p>
              </RecycledPaperCard>

              <RecycledPaperCard className="p-6" glowColor="emerald">
                <Phone className="w-8 h-8 text-emerald-400 mb-4" strokeWidth={2} />
                <h3 className="text-xl text-[#3d2817] mb-2">Phone</h3>
                <p className="text-[#3d2817]/60">+91 98765 43210</p>
              </RecycledPaperCard>
            </div>

            <RecycledPaperCard className="p-8 mb-12" glowColor="emerald">
              <h2 className="text-2xl text-[#3d2817] mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" strokeWidth={2} />
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-[#3d2817]/80 uppercase tracking-wide mb-2 block">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#3d2817]/80 uppercase tracking-wide mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-[#3d2817]/80 uppercase tracking-wide mb-2 block">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#3d2817]/80 uppercase tracking-wide mb-2 block">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                    className="bg-white/5 border-white/10 text-[#3d2817] placeholder:text-[#3d2817]/40"
                  />
                </div>

                <Button type="submit" variant="emerald" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" strokeWidth={2} />
                  Send Message
                </Button>
              </form>
            </RecycledPaperCard>

            <RecycledPaperCard className="p-8">
              <h2 className="text-2xl text-[#3d2817] mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6" strokeWidth={2} />
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                    <AccordionTrigger className="text-[#3d2817] hover:text-emerald-400">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#3d2817]/60">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </RecycledPaperCard>
          </div>
        </div>
      </div>
  );
}
