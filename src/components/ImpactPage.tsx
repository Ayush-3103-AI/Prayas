import { motion } from 'motion/react';
import { TrendingUp, Heart, Award, Leaf, Trophy, Target } from 'lucide-react';
import { Card } from './ui/card';
import { UserNavbar } from './UserNavbar';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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
    { category: 'Plastic', weight: 45, color: '#3BAF69' },
    { category: 'Paper', weight: 38, color: '#60D394' },
    { category: 'Metal', weight: 28, color: '#A8DADC' },
    { category: 'E-waste', weight: 20, color: '#457B9D' },
    { category: 'Glass', weight: 14, color: '#1D3557' },
  ];

  const badges = [
    { 
      name: 'First Pickup',
      emoji: '🌟',
      earned: true,
      description: 'Complete your first recyclable pickup',
      earnedDate: 'Jan 15, 2025'
    },
    { 
      name: 'Green Warrior',
      emoji: '🛡️',
      earned: true,
      description: 'Recycle for 30 consecutive days',
      earnedDate: 'Feb 20, 2025'
    },
    { 
      name: '50kg Recycler',
      emoji: '🏆',
      earned: true,
      description: 'Recycle 50kg of waste',
      earnedDate: 'Mar 10, 2025'
    },
    { 
      name: '100kg Recycler',
      emoji: '💎',
      earned: true,
      description: 'Recycle 100kg of waste',
      earnedDate: 'May 5, 2025'
    },
    { 
      name: 'Top Donor',
      emoji: '👑',
      earned: false,
      description: 'Donate ₹5,000 or more',
      progress: 57
    },
    { 
      name: 'Eco Champion',
      emoji: '🌍',
      earned: false,
      description: 'Recycle 200kg of waste',
      progress: 72
    },
    { 
      name: 'Streak Master',
      emoji: '🔥',
      earned: false,
      description: 'Maintain a 90-day streak',
      progress: 45
    },
    { 
      name: 'Community Leader',
      emoji: '⭐',
      earned: false,
      description: 'Refer 10 new users',
      progress: 30
    },
  ];

  const ngoImpact = [
    {
      name: 'Green Earth Foundation',
      amount: '₹1,200',
      percentage: 42,
      focus: 'Environmental Conservation',
    },
    {
      name: 'Hope for Children',
      amount: '₹850',
      percentage: 30,
      focus: 'Child Education',
    },
    {
      name: 'Clean India Initiative',
      amount: '₹500',
      percentage: 18,
      focus: 'Waste Management',
    },
    {
      name: 'Animal Welfare Trust',
      amount: '₹300',
      percentage: 10,
      focus: 'Animal Care',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20 md:pb-8">
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="impact" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-gray-900 mb-2">Your Impact</h1>
        <p className="text-xl text-gray-600 mb-8">See the difference you're making</p>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[#3BAF69] to-[#2d9355] text-white">
              <Leaf className="w-12 h-12 mb-4 opacity-80" />
              <div className="text-4xl mb-2">145 kg</div>
              <div className="text-green-100">Total Waste Recycled</div>
              <div className="text-sm text-green-100 mt-2">Equivalent to 725 plastic bottles</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white">
              <Heart className="w-12 h-12 mb-4 opacity-80" />
              <div className="text-4xl mb-2">₹2,850</div>
              <div className="text-red-100">Total Donated</div>
              <div className="text-sm text-red-100 mt-2">Supporting 4 NGOs</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <TrendingUp className="w-12 h-12 mb-4 opacity-80" />
              <div className="text-4xl mb-2">23</div>
              <div className="text-blue-100">Pickups Completed</div>
              <div className="text-sm text-blue-100 mt-2">6.3 kg average per pickup</div>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-6">Monthly Recycling Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="waste" stroke="#3BAF69" strokeWidth={3} name="Waste (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-6">Waste by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="weight" fill="#3BAF69" name="Weight (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* NGO Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="text-2xl text-gray-900 mb-6">NGO Donation Breakdown</h3>
            <div className="space-y-4">
              {ngoImpact.map((ngo, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-gray-900">{ngo.name}</div>
                      <div className="text-sm text-gray-600">{ngo.focus}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900">{ngo.amount}</div>
                      <div className="text-sm text-gray-600">{ngo.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ngo.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-[#3BAF69] h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-[#3BAF69]" />
              <h3 className="text-2xl text-gray-900">Achievement Badges</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-2 ${
                    badge.earned
                      ? 'border-[#3BAF69] bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-2 text-center">{badge.emoji}</div>
                  <div className="text-center mb-2">
                    <div className="text-gray-900 mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-600">{badge.description}</div>
                  </div>
                  {badge.earned ? (
                    <Badge className="w-full justify-center bg-[#3BAF69] text-white">
                      Earned {badge.earnedDate}
                    </Badge>
                  ) : (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-[#3BAF69] h-1.5 rounded-full"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
