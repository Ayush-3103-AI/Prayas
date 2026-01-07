import { motion } from 'motion/react';
import { Recycle, TrendingUp, Users, Award, Heart, Leaf, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
      icon: '📱',
    },
    {
      step: '2',
      title: 'We Collect',
      description: 'Our agents arrive and collect your recyclable waste',
      icon: '🚚',
    },
    {
      step: '3',
      title: 'Make Impact',
      description: 'Waste value converts to donations for NGOs of your choice',
      icon: '💚',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      text: 'Prayas made recycling so easy! I love seeing my impact grow every month.',
      avatar: '👩',
    },
    {
      name: 'Rajesh Kumar',
      text: 'Amazing platform. Knowing my waste helps others is truly motivating.',
      avatar: '👨',
    },
    {
      name: 'Anjali Patel',
      text: 'The leaderboard keeps me engaged. Recycling has become a fun habit!',
      avatar: '👩‍💼',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#3BAF69] rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl text-[#3BAF69]">Prayas</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate('landing')} className="text-gray-700 hover:text-[#3BAF69] transition-colors">
                Home
              </button>
              <button onClick={() => onNavigate('about')} className="text-gray-700 hover:text-[#3BAF69] transition-colors">
                About Us
              </button>
              <button onClick={() => onNavigate('contact')} className="text-gray-700 hover:text-[#3BAF69] transition-colors">
                Contact
              </button>
              <Button onClick={onLogin} className="bg-[#3BAF69] hover:bg-[#2d9355]">
                Login / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl text-gray-900 mb-6">
              Recycle. <span className="text-[#3BAF69]">Impact.</span> Inspire.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Turn your recyclable waste into meaningful donations. Join thousands making a difference, one pickup at a time.
            </p>
            <div className="flex gap-4">
              <Button onClick={onLogin} size="lg" className="bg-[#3BAF69] hover:bg-[#2d9355]">
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
            <div className="w-full h-96 bg-gradient-to-br from-green-200 to-green-100 rounded-3xl flex items-center justify-center text-8xl">
              ♻️
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#3BAF69] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-3xl text-white mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Simple steps to make a big impact</p>
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
              <Card className="p-8 text-center hover:shadow-xl transition-shadow border-2 border-green-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  {item.icon}
                </div>
                <div className="inline-block px-4 py-1 bg-[#3BAF69] text-white rounded-full mb-4">
                  Step {item.step}
                </div>
                <h3 className="text-2xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Recycle */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl text-gray-900 mb-6">Why Recycle with Prayas?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">Environmental Impact</h3>
                    <p className="text-gray-600">Reduce landfill waste and help create a sustainable future for our planet.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">Social Good</h3>
                    <p className="text-gray-600">Convert waste value into donations that support meaningful causes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">Track Your Progress</h3>
                    <p className="text-gray-600">See your impact grow with detailed analytics and achievement badges.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-200 to-green-200 rounded-3xl flex items-center justify-center text-8xl">
                🌍
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600">Join thousands of happy recyclers</p>
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
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div className="text-gray-900">{testimonial.name}</div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#3BAF69] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-green-100 mb-8">Join Prayas today and start your recycling journey</p>
          <Button onClick={onLogin} size="lg" variant="secondary" className="bg-white text-[#3BAF69] hover:bg-green-50">
            Book Your First Pickup <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#3BAF69] rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl">Prayas</span>
              </div>
              <p className="text-gray-400">Making recycling rewarding and impactful.</p>
            </div>
            <div>
              <h3 className="mb-4">Quick Links</h3>
              <div className="space-y-2 text-gray-400">
                <div className="cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate('about')}>About Us</div>
                <div className="cursor-pointer hover:text-white transition-colors" onClick={() => onNavigate('contact')}>Contact</div>
                <div className="cursor-pointer hover:text-white transition-colors">FAQ</div>
              </div>
            </div>
            <div>
              <h3 className="mb-4">Legal</h3>
              <div className="space-y-2 text-gray-400">
                <div className="cursor-pointer hover:text-white transition-colors">Privacy Policy</div>
                <div className="cursor-pointer hover:text-white transition-colors">Terms of Service</div>
              </div>
            </div>
            <div>
              <h3 className="mb-4">Connect</h3>
              <div className="space-y-2 text-gray-400">
                <div>support@prayas.org</div>
                <div>+91 98765 43210</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2025 Prayas. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
