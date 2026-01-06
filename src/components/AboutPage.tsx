import { Leaf, Heart, Target, Users, TrendingUp, Award } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
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

        <section className="container mx-auto px-4 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl text-[#3d2817] mb-6">About Prayas</h1>
            <p className="text-xl text-[#3d2817]/60">
              We're on a mission to make recycling rewarding and impactful. Every piece of waste recycled is a step towards a cleaner planet and a better society.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <RecycledPaperCard className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-400" strokeWidth={2} />
              </div>
              <h2 className="text-2xl text-[#3d2817] mb-4">Our Mission</h2>
              <p className="text-[#3d2817]/60">
                To create a sustainable ecosystem where every household contributes to environmental conservation and social welfare through responsible recycling.
              </p>
            </RecycledPaperCard>

            <RecycledPaperCard className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-400" strokeWidth={2} />
              </div>
              <h2 className="text-2xl text-[#3d2817] mb-4">Our Vision</h2>
              <p className="text-[#3d2817]/60">
                A world where recycling is seamless, rewarding, and creates meaningful social impact, transforming waste into opportunities for positive change.
              </p>
            </RecycledPaperCard>

            <RecycledPaperCard className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-400" strokeWidth={2} />
              </div>
              <h2 className="text-2xl text-[#3d2817] mb-4">Our Values</h2>
              <p className="text-[#3d2817]/60">
                Sustainability, transparency, community impact, and innovation drive everything we do. We believe in making a difference, one pickup at a time.
              </p>
            </RecycledPaperCard>
          </div>
        </section>
      </div>
  );
}
