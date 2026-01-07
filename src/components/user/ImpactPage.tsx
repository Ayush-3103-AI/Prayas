import { Heart, TrendingUp, Award, Leaf, Droplets, TreePine } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ImpactPage() {
  const monthlyData = [
    { month: 'Jun', donated: 120, recycled: 4.5 },
    { month: 'Jul', donated: 180, recycled: 6.2 },
    { month: 'Aug', donated: 240, recycled: 8.1 },
    { month: 'Sep', donated: 310, recycled: 10.3 },
    { month: 'Oct', donated: 420, recycled: 14.8 },
    { month: 'Nov', donated: 570, recycled: 18.6 },
  ];

  const wasteBreakdown = [
    { type: 'Plastic', weight: 12.5, color: '#3BAF69' },
    { type: 'Paper', weight: 8.3, color: '#60A5FA' },
    { type: 'Metal', weight: 6.7, color: '#A78BFA' },
    { type: 'E-Waste', weight: 5.0, color: '#F59E0B' },
  ];

  const badges = [
    { id: 1, name: 'First Pickup', description: 'Completed your first recycling pickup', icon: '🎯', date: '2024-06-15' },
    { id: 2, name: '10kg Recycled', description: 'Recycled 10 kilograms of waste', icon: '♻️', date: '2024-07-22' },
    { id: 3, name: 'Eco Warrior', description: '5 consecutive monthly pickups', icon: '🌱', date: '2024-10-30' },
  ];

  const ngoStories = [
    {
      id: 1,
      ngo: 'GreenEarth Foundation',
      amount: 850,
      story: 'Your donations helped us plant 45 trees in urban areas and conduct 3 environmental awareness workshops.',
      impact: '45 trees planted',
    },
    {
      id: 2,
      ngo: 'Clean India Mission',
      amount: 620,
      story: 'Supported cleaning drives in 2 neighborhoods and provided recycling training to 50 households.',
      impact: '2 neighborhoods cleaned',
    },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div>
        <h1 className="text-gray-900 mb-2">Your Impact Dashboard</h1>
        <p className="text-gray-600">See the difference you're making</p>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#3BAF69] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">32.5 kg</div>
          <p className="text-gray-600 mb-3">Total Recycled</p>
          <div className="text-[#3BAF69]">↑ 5kg this month</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">₹1,840</div>
          <p className="text-gray-600 mb-3">Total Donated</p>
          <div className="text-blue-600">₹250 this month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">3 Badges</div>
          <p className="text-gray-600 mb-3">Achievements Earned</p>
          <div className="text-purple-600">Next: 50kg Milestone</div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-gray-900 mb-6">Monthly Donation Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#3d2817" tick={{ fill: '#3d2817' }} />
            <YAxis stroke="#3d2817" tick={{ fill: '#3d2817' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line type="monotone" dataKey="donated" stroke="#3BAF69" strokeWidth={3} dot={{ fill: '#3BAF69', r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Waste Type Breakdown */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-gray-900 mb-6">Waste Type Breakdown</h2>
        <div className="space-y-4">
          {wasteBreakdown.map((item) => (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-900">{item.type}</span>
                <span className="text-gray-900">{item.weight} kg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${(item.weight / 32.5) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl text-white">
        <h2 className="text-white mb-6">Environmental Impact Equivalent</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="text-white mb-2">145 kg CO₂</div>
            <p className="text-green-100">Carbon Emissions Saved</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div className="text-white mb-2">8 Trees</div>
            <p className="text-green-100">Equivalent Planted</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div className="text-white mb-2">420 Liters</div>
            <p className="text-green-100">Water Conserved</p>
          </div>
        </div>
      </div>

      {/* NGO Impact Stories */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-gray-900 mb-6">How Your Donations Helped</h2>
        <div className="space-y-4">
          {ngoStories.map((story) => (
            <div key={story.id} className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#3BAF69] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">{story.ngo}</div>
                  <div className="text-[#3BAF69]">₹{story.amount} donated</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{story.story}</p>
              <div className="inline-block px-4 py-2 bg-white rounded-lg border">
                <span className="text-gray-900">{story.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-gray-900 mb-6">Your Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-5xl mb-3 text-center">{badge.icon}</div>
              <div className="text-gray-900 text-center mb-2">{badge.name}</div>
              <p className="text-gray-600 text-center mb-3">{badge.description}</p>
              <div className="text-[#3BAF69] text-center">Earned: {badge.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
