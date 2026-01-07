import { useState } from 'react';
import { Leaf, Mail, Phone, MapPin, Send, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
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
    // Handle form submission
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
    {
      question: 'Is there a minimum weight requirement?',
      answer: 'We recommend a minimum of 2-3 kg per pickup to make it efficient for our agents. However, you can book pickups for smaller amounts if you combine different types of recyclables.',
    },
    {
      question: 'How do I choose which NGO to support?',
      answer: 'During the booking process, you can select from our list of verified partner NGOs. Each NGO listing shows their focus area so you can choose a cause that resonates with you.',
    },
    {
      question: 'Can I schedule recurring pickups?',
      answer: 'This feature is coming soon! For now, you can book individual pickups as often as you like.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-10 h-10 bg-[#3BAF69] rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl text-[#3BAF69]">Prayas</span>
            </div>
            <Button onClick={() => onNavigate('landing')} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">We're here to help you with any questions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#3BAF69]" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-2">support@prayas.org</p>
            <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-[#3BAF69]" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-2">+91 98765 43210</p>
            <p className="text-sm text-gray-500">Mon-Sat, 9 AM - 6 PM</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#3BAF69]" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-2">Mumbai, Maharashtra</p>
            <p className="text-sm text-gray-500">Head Office</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-[#3BAF69]" />
              <h2 className="text-2xl text-gray-900">Send us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="Tell us how we can help..."
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full bg-[#3BAF69] hover:bg-[#2d9355]">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* FAQ */}
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-6 h-6 text-[#3BAF69]" />
              <h2 className="text-2xl text-gray-900">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          © 2025 Prayas. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
