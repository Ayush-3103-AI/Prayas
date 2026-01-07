import { TrendingUp, Heart, Award, Leaf, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User } from '../../App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DonationImpactProps {
  user: User;
}

export function DonationImpact({ user }: DonationImpactProps) {
  // Mock data
  const monthlyData = [
    { month: 'Jun', waste: 8.5, donation: 850 },
    { month: 'Jul', waste: 6.2, donation: 620 },
    { month: 'Aug', waste: 9.8, donation: 980 },
    { month: 'Sep', waste: 7.3, donation: 730 },
    { month: 'Oct', waste: 11.2, donation: 1120 },
    { month: 'Nov', waste: 4.5, donation: 450 },
  ];

  const wasteBreakdown = [
    { type: 'Plastic', value: 18, color: '#3BAF69' },
    { type: 'Paper', value: 15, color: '#60D394' },
    { type: 'Metal', value: 10, color: '#AAD576' },
    { type: 'E-Waste', value: 4.5, color: '#FFD97D' },
  ];

  const allBadges = [
    { 
      id: 1, 
      name: 'First Pickup', 
      icon: '🎉', 
      description: 'Complete your first pickup',
      earned: true,
      earnedDate: '2025-06-15'
    },
    { 
      id: 2, 
      name: '10kg Recycler', 
      icon: '♻️', 
      description: 'Recycle 10kg of waste',
      earned: true,
      earnedDate: '2025-07-22'
    },
    { 
      id: 3, 
      name: 'Eco Warrior', 
      icon: '🌟', 
      description: 'Complete 5 pickups',
      earned: true,
      earnedDate: '2025-08-10'
    },
    { 
      id: 4, 
      name: 'Monthly Hero', 
      icon: '⭐', 
      description: 'Complete 4 pickups in a month',
      earned: true,
      earnedDate: '2025-10-31'
    },
    { 
      id: 5, 
      name: '50kg Champion', 
      icon: '🏆', 
      description: 'Recycle 50kg of waste',
      earned: false,
      progress: '95%'
    },
    { 
      id: 6, 
      name: 'Donation Hero', 
      icon: '💚', 
      description: 'Donate ₹5,000 to NGOs',
      earned: false,
      progress: '95%'
    },
    { 
      id: 7, 
      name: 'Plastic Warrior', 
      icon: '🥤', 
      description: 'Recycle 20kg of plastic',
      earned: false,
      progress: '90%'
    },
    { 
      id: 8, 
      name: 'E-Waste Expert', 
      icon: '💻', 
      description: 'Recycle 10kg of e-waste',
      earned: false,
      progress: '45%'
    },
  ];

  const ngoImpact = [
    {
      name: 'Education for All Foundation',
      amount: 1200,
      impact: 'Funded 3 months of education for 2 children'
    },
    {
      name: 'Green Earth Initiative',
      amount: 1520,
      impact: 'Planted 152 trees in urban areas'
    },
    {
      name: 'Health & Wellness Trust',
      amount: 980,
      impact: 'Provided health checkups for 10 families'
    },
    {
      name: 'Child Welfare Society',
      amount: 1050,
      impact: 'Supported nutritious meals for 50 children'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-green-900 mb-2">Your Impact Dashboard</h1>
        <p className="text-gray-600">See the difference you're making</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 mb-1">Total Recycled</p>
            <div className="text-green-600">47.5 kg</div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 mb-1">Total Donated</p>
            <div className="text-green-600">₹4,750</div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">CO₂ Saved</p>
            <div className="text-green-600">95 kg</div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Badges Earned</p>
            <div className="text-green-600">4 / 8</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-900">Monthly Recycling Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#3d2817" tick={{ fill: '#3d2817' }} />
                <YAxis stroke="#3d2817" tick={{ fill: '#3d2817' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="waste" 
                  stroke="#3BAF69" 
                  strokeWidth={3}
                  name="Waste (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Waste Type Breakdown */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-900">Waste Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300} className="[&_.recharts-pie-label-text]:fill-[#3d2817] [&_.recharts-pie-label-text]:font-medium">
                <PieChart>
                  <Pie
                    data={wasteBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, value }) => `${type}: ${value}kg`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wasteBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Donations */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900">Monthly Donation Value</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#3d2817" tick={{ fill: '#3d2817' }} />
              <YAxis stroke="#3d2817" tick={{ fill: '#3d2817' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="donation" fill="#3BAF69" radius={[8, 8, 0, 0]} name="Donation (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* NGO Impact Stories */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900">NGO Impact Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ngoImpact.map((ngo, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-gray-900">{ngo.name}</p>
                  <p className="text-green-600">₹{ngo.amount.toLocaleString()}</p>
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-green-600" />
                  {ngo.impact}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges & Achievements */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900">Badges & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-6 rounded-lg border-2 text-center transition-all ${
                  badge.earned
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <p className={`mb-2 ${badge.earned ? 'text-green-900' : 'text-gray-700'}`}>
                  {badge.name}
                </p>
                <p className="text-gray-600 mb-3">{badge.description}</p>
                {badge.earned ? (
                  <>
                    <Badge className="bg-green-600 hover:bg-green-700 mb-2">Earned</Badge>
                    <p className="text-gray-500 mt-2">{badge.earnedDate}</p>
                  </>
                ) : (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all" 
                        style={{ width: badge.progress }}
                      />
                    </div>
                    <p className="text-gray-600">{badge.progress} complete</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="border-green-100 bg-gradient-to-r from-green-600 to-green-700">
        <CardContent className="p-8 text-white">
          <h2 className="text-white mb-6">Your Environmental Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-white mb-2">95 kg</div>
              <p className="text-green-100">CO₂ Emissions Prevented</p>
              <p className="text-green-100 mt-2">Equivalent to 425 km of car travel</p>
            </div>
            <div>
              <div className="text-white mb-2">142 L</div>
              <p className="text-green-100">Water Saved</p>
              <p className="text-green-100 mt-2">Enough for 28 people for a day</p>
            </div>
            <div>
              <div className="text-white mb-2">0.8 trees</div>
              <p className="text-green-100">Trees Worth of Paper Saved</p>
              <p className="text-green-100 mt-2">Keep forests growing!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
