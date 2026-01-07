import { Leaf, Heart, Target, Users, TrendingUp, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl text-gray-900 mb-6">About Prayas</h1>
          <p className="text-xl text-gray-600">
            We're on a mission to make recycling rewarding and impactful. Every piece of waste recycled is a step towards a cleaner planet and a better society.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-[#3BAF69]" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To create a sustainable ecosystem where every household contributes to environmental conservation and social welfare through responsible recycling.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-[#3BAF69]" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              A world where zero waste is not just a goal but a reality, and where every recycling action creates tangible social impact.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#3BAF69]" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600">
              Transparency, sustainability, and community. We believe in empowering individuals to make a difference through simple, everyday actions.
            </p>
          </Card>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-gray-600 text-lg">
              <p>
                Prayas was born from a simple observation: millions of households want to recycle but lack convenient options, while countless NGOs struggle to fund their vital work.
              </p>
              <p>
                In 2024, a group of environmental enthusiasts and social entrepreneurs came together to create a bridge. We asked ourselves: "What if we could turn everyday waste into everyday impact?"
              </p>
              <p>
                Today, Prayas connects urban households with efficient recycling agents and channels the value of recyclables directly to verified NGOs. Every pickup is a win for the environment, a win for society, and a win for our community members who see their small actions create big change.
              </p>
              <p>
                We've grown from a small pilot program in Mumbai to serving thousands of households across major cities, but our mission remains the same: making sustainability simple, transparent, and rewarding for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Philosophy */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl text-gray-900 mb-12 text-center">Our Impact Philosophy</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">Environmental Responsibility</h3>
              <p className="text-gray-600">
                We ensure proper recycling practices that minimize landfill waste and reduce carbon footprint.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">Social Impact</h3>
              <p className="text-gray-600">
                100% of recyclable value is donated to verified NGOs working on critical social causes.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">Community Building</h3>
              <p className="text-gray-600">
                We create a engaged community of conscious citizens making collective impact.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                Every transaction is tracked and every donation is verifiable with complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#3BAF69] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-green-100 mb-8">
            Be part of a growing community creating real environmental and social impact
          </p>
          <Button onClick={() => onNavigate('landing')} size="lg" variant="secondary" className="bg-white text-[#3BAF69] hover:bg-green-50">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          © 2025 Prayas. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
