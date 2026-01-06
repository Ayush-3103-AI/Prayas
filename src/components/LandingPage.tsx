import { motion } from 'motion/react';
import { Recycle, TrendingUp, Users, Award, Heart, Leaf, ChevronRight, ArrowRight, Globe, Smartphone, Truck, Sparkles, User } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export function LandingPage({ onNavigate, onLogin }: LandingPageProps) {
  const stats = [
    { value: '125,000+', label: 'Kg Recycled', icon: Recycle },
    { value: '₹2,45,000', label: 'Donated', icon: Heart },
    { value: '3,400+', label: 'Happy Users', icon: Users },
    { value: '15+', label: 'Partner NGOs', icon: Award },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Book a Pickup',
      description: 'Schedule a convenient time for waste collection from your home',
      icon: Smartphone,
    },
    {
      step: '2',
      title: 'We Collect',
      description: 'Our agents arrive and collect your recyclable waste',
      icon: Truck,
    },
    {
      step: '3',
      title: 'Make Impact',
      description: 'Waste value converts to donations for NGOs of your choice',
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      text: 'Prayas made recycling so easy! I love seeing my impact grow every month.',
      icon: User,
    },
    {
      name: 'Rajesh Kumar',
      text: 'Amazing platform. Knowing my waste helps others is truly motivating.',
      icon: User,
    },
    {
      name: 'Anjali Patel',
      text: 'The leaderboard keeps me engaged. Recycling has become a fun habit!',
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#d4c5b0] bg-[#f5f5dc]/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6b8e6b] to-[#5a7a5a] rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-[#faf0e6]" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-semibold text-[#3d2817] tracking-wide">PRAYAS</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate('landing')} className="text-[#6b5d4f] hover:text-[#6b8e6b] transition-colors uppercase tracking-wide text-sm font-medium">
                Home
              </button>
              <button onClick={() => onNavigate('about')} className="text-[#6b5d4f] hover:text-[#6b8e6b] transition-colors uppercase tracking-wide text-sm font-medium">
                About Us
              </button>
              <button onClick={() => onNavigate('contact')} className="text-[#6b5d4f] hover:text-[#6b8e6b] transition-colors uppercase tracking-wide text-sm font-medium">
                Contact
              </button>
              <Button onClick={onLogin} variant="emerald" size="lg">
                Initialize Session <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-32 md:py-40">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 blur-zone-light p-8 rounded-lg"
            >
              <h1 className="text-5xl md:text-7xl text-[#3d2817] leading-tight">
                Recycle.{' '}
                <span className="text-[#6b8e6b]">Impact.</span>{' '}
                Inspire.
              </h1>
              <p className="text-xl text-[#2c1810] leading-relaxed">
                Turn your recyclable waste into meaningful donations. Join thousands making a difference, one pickup at a time.
              </p>
              <div className="flex gap-4">
                <Button onClick={onLogin} size="lg" variant="emerald">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => onNavigate('about')} variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <RecycledPaperCard className="p-12">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Globe className="w-32 h-32 text-[#6b8e6b] animate-pulse-slow" strokeWidth={1} />
                  </div>
                </div>
              </RecycledPaperCard>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 blur-zone p-6 rounded-lg">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <RecycledPaperCard className="p-6 text-center">
                    <stat.icon className="w-12 h-12 text-[#6b8e6b] mx-auto mb-4" strokeWidth={2} />
                    <div className="text-3xl text-[#3d2817] mb-2 font-semibold">{stat.value}</div>
                    <div className="text-[#2c1810] uppercase tracking-wide text-xs">{stat.label}</div>
                  </RecycledPaperCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16 blur-zone-light p-6 rounded-lg">
            <h2 className="text-4xl md:text-5xl text-[#3d2817] mb-4">How It Works</h2>
            <p className="text-xl text-[#2c1810]">Simple steps to make a big impact</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <RecycledPaperCard className="p-8 text-center">
                  <div className="w-20 h-20 bg-[#6b8e6b]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-10 h-10 text-[#6b8e6b]" strokeWidth={2} />
                  </div>
                  <div className="inline-block px-4 py-1 bg-[#6b8e6b]/20 text-[#6b8e6b] rounded-full mb-4 text-sm font-medium uppercase tracking-wide">
                    Step {item.step}
                  </div>
                  <h3 className="text-2xl text-[#3d2817] mb-3">{item.title}</h3>
                  <p className="text-[#2c1810]">{item.description}</p>
                </RecycledPaperCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Recycle */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="blur-zone p-8 rounded-lg">
                <h2 className="text-4xl md:text-5xl text-[#3d2817] mb-6">Why Recycle with Prayas?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#6b8e6b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-xl text-[#3d2817] mb-2">Environmental Impact</h3>
                      <p className="text-[#2c1810]">Reduce landfill waste and help create a sustainable future for our planet.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#6b8e6b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-xl text-[#3d2817] mb-2">Social Good</h3>
                      <p className="text-[#2c1810]">Convert waste value into donations that support meaningful causes.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#6b8e6b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-xl text-[#3d2817] mb-2">Track Your Progress</h3>
                      <p className="text-[#2c1810]">See your impact grow with detailed analytics and achievement badges.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <RecycledPaperCard className="p-12">
                  <div className="flex items-center justify-center">
                    <Globe className="w-40 h-40 text-[#6b8e6b]" strokeWidth={1} />
                  </div>
                </RecycledPaperCard>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16 blur-zone-light p-6 rounded-lg">
            <h2 className="text-4xl md:text-5xl text-[#3d2817] mb-4">What Our Users Say</h2>
            <p className="text-xl text-[#2c1810]">Join thousands of happy recyclers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <RecycledPaperCard className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#6b8e6b]/20 rounded-full flex items-center justify-center">
                      <testimonial.icon className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                    </div>
                    <div className="text-[#3d2817] font-medium">{testimonial.name}</div>
                  </div>
                  <p className="text-[#2c1810]">{testimonial.text}</p>
                </RecycledPaperCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center blur-zone p-8 rounded-lg">
            <RecycledPaperCard className="p-12">
              <h2 className="text-4xl md:text-5xl text-[#3d2817] mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-[#2c1810] mb-8">Join Prayas today and start your recycling journey</p>
              <Button onClick={onLogin} size="lg" variant="emerald">
                Book Your First Pickup <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </RecycledPaperCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#d4c5b0] py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6b8e6b] to-[#5a7a5a] rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-[#faf0e6]" strokeWidth={2.5} />
                  </div>
                  <span className="text-2xl font-semibold text-[#3d2817] tracking-wide">PRAYAS</span>
                </div>
                <p className="text-[#2c1810]">Making recycling rewarding and impactful.</p>
              </div>
              <div>
                <h3 className="mb-4 text-[#3d2817] uppercase tracking-wide text-sm font-semibold">Quick Links</h3>
                <div className="space-y-2 text-[#2c1810]">
                  <div className="cursor-pointer hover:text-[#6b8e6b] transition-colors" onClick={() => onNavigate('about')}>About Us</div>
                  <div className="cursor-pointer hover:text-[#6b8e6b] transition-colors" onClick={() => onNavigate('contact')}>Contact</div>
                  <div className="cursor-pointer hover:text-[#6b8e6b] transition-colors">FAQ</div>
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-[#3d2817] uppercase tracking-wide text-sm font-semibold">Legal</h3>
                <div className="space-y-2 text-[#2c1810]">
                  <div className="cursor-pointer hover:text-[#6b8e6b] transition-colors">Privacy Policy</div>
                  <div className="cursor-pointer hover:text-[#6b8e6b] transition-colors">Terms of Service</div>
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-[#3d2817] uppercase tracking-wide text-sm font-semibold">Connect</h3>
                <div className="space-y-2 text-[#2c1810]">
                  <div>support@prayas.org</div>
                  <div>+91 98765 43210</div>
                </div>
              </div>
            </div>
            <div className="border-t border-[#d4c5b0] mt-8 pt-8 text-center text-[#2c1810]">
              © 2025 Prayas. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
  );
}
