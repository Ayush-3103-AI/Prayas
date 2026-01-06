import { User as UserIcon, Mail, MapPin, Award, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User } from '../../App';

interface AgentProfileProps {
  user: User;
}

export function AgentProfile({ user }: AgentProfileProps) {
  // Mock stats
  const agentStats = {
    totalCollections: 156,
    totalWeight: 847.5,
    totalDonations: 84750,
    rating: 4.8,
    completionRate: 98,
    avgResponseTime: '12 mins'
  };

  const recentCollections = [
    { date: '2025-12-02', pickups: 3, weight: 18.2, amount: 1820 },
    { date: '2025-12-01', pickups: 4, weight: 22.5, amount: 2250 },
    { date: '2025-11-30', pickups: 2, weight: 11.8, amount: 1180 },
    { date: '2025-11-29', pickups: 5, weight: 28.3, amount: 2830 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-blue-900 mb-2">Agent Profile</h1>
        <p className="text-gray-600">Your performance and account information</p>
      </div>

      {/* Profile Header */}
      <Card className="border-blue-100">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <span className="text-3xl">{user.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-blue-900 mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-1">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-900">{agentStats.rating} ⭐ Rating</span>
              </div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-gray-600 mb-1">Agent ID</p>
              <p className="text-blue-600">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-gray-600">Total Collections</p>
                  <div className="text-blue-600">{agentStats.totalCollections}</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-gray-600">Total Weight</p>
                  <div className="text-blue-600">{agentStats.totalWeight} kg</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-gray-600">Total Value</p>
                  <div className="text-blue-600">₹{agentStats.totalDonations.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-100">
              <p className="text-gray-600 mb-2">Completion Rate</p>
              <div className="text-green-600 mb-3">{agentStats.completionRate}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all" 
                  style={{ width: `${agentStats.completionRate}%` }}
                />
              </div>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-gray-600 mb-2">Avg Response Time</p>
              <div className="text-purple-600">{agentStats.avgResponseTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <UserIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-600">Full Name</p>
              <p className="text-gray-900">{user.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-600">Email Address</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-600">Service Area</p>
              <p className="text-gray-900">{user.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">Recent Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCollections.map((collection, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div>
                  <p className="text-gray-900 mb-1">{collection.date}</p>
                  <p className="text-gray-600">{collection.pickups} pickups</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600">{collection.weight} kg</p>
                  <p className="text-gray-600">₹{collection.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badge */}
      <Card className="border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700">
        <CardContent className="p-8 text-center text-white">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-white mb-2">Top Performing Agent</h3>
          <p className="text-blue-100">
            You're in the top 10% of agents this month! Keep up the excellent work.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
