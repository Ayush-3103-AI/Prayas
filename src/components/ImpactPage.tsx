import { motion } from 'motion/react';
import { TrendingUp, Heart, Award, Leaf, Trophy, Target } from 'lucide-react';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { UserNavbar } from './UserNavbar';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { cn } from './ui/utils';

interface ImpactPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ImpactPage({ onNavigate, onLogout }: ImpactPageProps) {
  const monthlyData = [
    { month: 'Jan', waste: 12, donation: 180 },
    { month: 'Feb', waste: 15, donation: 225 },
    { month: 'Mar', waste: 18, donation: 270 },
    { month: 'Apr', waste: 22, donation: 330 },
    { month: 'May', waste: 19, donation: 285 },
    { month: 'Jun', waste: 25, donation: 375 },
  ];

  const categoryData = [
    { category: 'Plastic', weight: 45, color: '#10b981' },
    { category: 'Paper', weight: 38, color: '#34d399' },
    { category: 'Metal', weight: 28, color: '#6ee7b7' },
    { category: 'E-waste', weight: 20, color: '#a7f3d0' },
    { category: 'Glass', weight: 14, color: '#d1fae5' },
  ];

  const badges = [
    { name: 'First Pickup', emoji: '🌟', earned: true, description: 'Complete your first recyclable pickup', earnedDate: 'Jan 15, 2025' },
    { name: 'Green Warrior', emoji: '🛡️', earned: true, description: 'Recycle for 30 consecutive days', earnedDate: 'Feb 20, 2025' },
    { name: '50kg Recycler', emoji: '🏆', earned: true, description: 'Recycle 50kg of waste', earnedDate: 'Mar 10, 2025' },
    { name: '100kg Recycler', emoji: '💎', earned: true, description: 'Recycle 100kg of waste', earnedDate: 'May 5, 2025' },
    { name: 'Top Donor', emoji: '👑', earned: false, description: 'Donate ₹5,000 or more', progress: 57 },
    { name: 'Eco Champion', emoji: '🌍', earned: false, description: 'Recycle 200kg of waste', progress: 72 },
    { name: 'Streak Master', emoji: '🔥', earned: false, description: 'Maintain a 90-day streak', progress: 45 },
    { name: 'Community Leader', emoji: '⭐', earned: false, description: 'Refer 10 new users', progress: 30 },
  ];

  const ngoImpact = [
    { name: 'Green Earth Foundation', amount: '₹1,200', percentage: 42, focus: 'Environmental Conservation' },
    { name: 'Hope for Children', amount: '₹850', percentage: 30, focus: 'Child Education' },
    { name: 'Clean India Initiative', amount: '₹500', percentage: 18, focus: 'Waste Management' },
    { name: 'Animal Welfare Trust', amount: '₹300', percentage: 10, focus: 'Animal Care' },
  ];

  return (
      <div className="min-h-screen">
        <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="impact" />
        
        <div className="md:ml-64 container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl text-white mb-2">Your Impact</h1>
          <p className="text-xl text-white/60 mb-8">See the difference you're making</p>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <RecycledPaperCard className="p-6" glowColor="emerald">
                <Leaf className="w-12 h-12 mb-4 text-[#6b8e6b]" strokeWidth={2} />
                <div className="text-4xl mb-2 text-[#2c1810] font-bold">145 kg</div>
                <div className="text-[#3d2817] text-base">Total Waste Recycled</div>
                <div className="text-sm text-[#3d2817]/70 mt-2">Equivalent to 725 plastic bottles</div>
              </RecycledPaperCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <RecycledPaperCard className="p-6" glowColor="gold">
                <Heart className="w-12 h-12 mb-4 text-[#8b6f47]" strokeWidth={2} />
                <div className="text-4xl mb-2 text-[#2c1810] font-bold">₹2,850</div>
                <div className="text-[#3d2817] text-base">Total Donated</div>
                <div className="text-sm text-[#3d2817]/70 mt-2">Supporting 4 NGOs</div>
              </RecycledPaperCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <RecycledPaperCard className="p-6" glowColor="blue">
                <TrendingUp className="w-12 h-12 mb-4 text-[#5a4a3a]" strokeWidth={2} />
                <div className="text-4xl mb-2 text-[#2c1810] font-bold">23</div>
                <div className="text-[#3d2817] text-base">Pickups Completed</div>
                <div className="text-sm text-[#3d2817]/70 mt-2">6.3 kg average per pickup</div>
              </RecycledPaperCard>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <RecycledPaperCard className="p-6" glowColor="emerald">
                <h3 className="text-xl text-white mb-6">Monthly Recycling Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip contentStyle={{ backgroundColor: '#0a100c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={3} name="Waste (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </RecycledPaperCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <RecycledPaperCard className="p-6" glowColor="emerald">
                <h3 className="text-xl text-white mb-6">Waste by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="category" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip contentStyle={{ backgroundColor: '#0a100c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="weight" fill="#10b981" name="Weight (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </RecycledPaperCard>
            </motion.div>
          </div>

          {/* NGO Impact */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <RecycledPaperCard className="p-6" glowColor="emerald">
              <h3 className="text-2xl text-white mb-6">NGO Donation Breakdown</h3>
              <div className="space-y-4">
                {ngoImpact.map((ngo, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-white">{ngo.name}</div>
                        <div className="text-sm text-white/60">{ngo.focus}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">{ngo.amount}</div>
                        <div className="text-sm text-white/60">{ngo.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ngo.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-emerald-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </RecycledPaperCard>
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <RecycledPaperCard className="p-6" glowColor="gold">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-amber-400" strokeWidth={2} />
                <h3 className="text-2xl text-white">Achievement Badges</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "p-4 rounded-xl border-2",
                      badge.earned
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-white/10 bg-white/5 opacity-60 grayscale"
                    )}
                  >
                    <div className="text-4xl mb-2 text-center">{badge.emoji}</div>
                    <div className="text-center mb-2">
                      <div className="text-white mb-1">{badge.name}</div>
                      <div className="text-xs text-white/60">{badge.description}</div>
                    </div>
                    {badge.earned ? (
                      <Badge className="w-full justify-center bg-amber-500/20 text-amber-400 border-amber-500/30">
                        Earned {badge.earnedDate}
                      </Badge>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                          <span>Progress</span>
                          <span>{badge.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${badge.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </RecycledPaperCard>
          </motion.div>
        </div>
      </div>
  );
}
