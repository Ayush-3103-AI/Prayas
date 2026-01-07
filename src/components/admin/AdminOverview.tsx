import { Package, CheckCircle2, Clock, Heart, TrendingUp, Users, Recycle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function AdminOverview() {
  // Mock data
  const todayStats = {
    totalPickups: 147,
    completed: 89,
    pending: 34,
    inProgress: 24,
    totalDonations: 14870,
    activeUsers: 2547,
    activeAgents: 45,
    totalWaste: 847.5
  };

  const weeklyData = [
    { day: 'Mon', pickups: 32, donations: 3200, waste: 152 },
    { day: 'Tue', pickups: 28, donations: 2800, waste: 134 },
    { day: 'Wed', pickups: 35, donations: 3500, waste: 168 },
    { day: 'Thu', pickups: 30, donations: 3000, waste: 145 },
    { day: 'Fri', pickups: 38, donations: 3800, waste: 178 },
    { day: 'Sat', pickups: 42, donations: 4200, waste: 198 },
    { day: 'Sun', pickups: 25, donations: 2500, waste: 122 },
  ];

  const wasteTypeData = [
    { type: 'Plastic', value: 324, color: '#8B5CF6' },
    { type: 'Paper', value: 298, color: '#A78BFA' },
    { type: 'Metal', value: 156, color: '#C4B5FD' },
    { type: 'E-Waste', value: 69.5, color: '#DDD6FE' },
  ];

  const ngoDistribution = [
    { name: 'Education for All', amount: 4200, percentage: 28 },
    { name: 'Green Earth Initiative', amount: 3850, percentage: 26 },
    { name: 'Health & Wellness', amount: 3320, percentage: 22 },
    { name: 'Child Welfare', amount: 2100, percentage: 14 },
    { name: 'Others', amount: 1400, percentage: 10 },
  ];

  const recentPickups = [
    { id: 'PR20251203', user: 'Priya Sharma', agent: 'Rajesh Kumar', status: 'In Progress', weight: '5.2 kg' },
    { id: 'PR20251202', user: 'Amit Verma', agent: 'Vikram Patel', status: 'Completed', weight: '3.8 kg' },
    { id: 'PR20251201', user: 'Sneha Gupta', agent: 'Rajesh Kumar', status: 'Completed', weight: '6.5 kg' },
    { id: 'PR20251130', user: 'Kavya Singh', agent: 'Amit Singh', status: 'Completed', weight: '4.2 kg' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-purple-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 mb-1">Total Pickups Today</p>
            <div className="text-purple-600">{todayStats.totalPickups}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Completed</p>
            <div className="text-green-600">{todayStats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Pending Assignment</p>
            <div className="text-orange-600">{todayStats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 mb-1">Total Donations</p>
            <div className="text-purple-600">₹{todayStats.totalDonations.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <p className="text-gray-600 mb-1">Active Users</p>
            <div className="text-purple-600">{todayStats.activeUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600 mb-1">Active Agents</p>
            <div className="text-blue-600">{todayStats.activeAgents}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <Recycle className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600 mb-1">Total Waste Today</p>
            <div className="text-green-600">{todayStats.totalWaste} kg</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <Package className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <p className="text-gray-600 mb-1">In Progress</p>
            <div className="text-orange-600">{todayStats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Pickups Trend */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-900">Weekly Pickup Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#3d2817" tick={{ fill: '#3d2817' }} />
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
                  dataKey="pickups" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Pickups"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Waste Type Distribution */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-900">Waste Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} className="[&_.recharts-pie-label-text]:fill-[#3d2817] [&_.recharts-pie-label-text]:font-medium">
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, value }) => `${type}: ${value}kg`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Donations */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-purple-900">Weekly Donation Value</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#3d2817" tick={{ fill: '#3d2817' }} />
              <YAxis stroke="#3d2817" tick={{ fill: '#3d2817' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #d1d5db',
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="donations" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Donations (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* NGO Distribution */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-900">NGO Donation Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ngoDistribution.map((ngo, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">{ngo.name}</p>
                    <p className="text-purple-600">₹{ngo.amount.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all" 
                      style={{ width: `${ngo.percentage}%` }}
                    />
                  </div>
                  <p className="text-gray-600 mt-1">{ngo.percentage}% of total</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Pickups */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-900">Recent Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPickups.map((pickup) => (
                <div 
                  key={pickup.id}
                  className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">{pickup.id}</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      pickup.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {pickup.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">User</p>
                      <p className="text-gray-900">{pickup.user}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Agent</p>
                      <p className="text-gray-900">{pickup.agent}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{pickup.weight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
