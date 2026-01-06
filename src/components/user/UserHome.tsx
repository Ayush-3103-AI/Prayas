import { Recycle, Heart, Package, Award, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface UserHomeProps {
  userName: string;
  userId: string;
  setView: (view: string) => void;
}

export default function UserHome({ userName, userId, setView }: UserHomeProps) {
  const badges = [
    { id: 1, name: 'First Pickup', icon: '🎯', earned: true },
    { id: 2, name: '10kg Recycled', icon: '♻️', earned: true },
    { id: 3, name: 'Eco Warrior', icon: '🌱', earned: true },
    { id: 4, name: '50kg Milestone', icon: '⭐', earned: false },
    { id: 5, name: 'Community Leader', icon: '👑', earned: false },
  ];

  const recentActivity = [
    { id: 1, date: '2024-11-28', action: 'Pickup completed', amount: '₹250', status: 'success' },
    { id: 2, date: '2024-11-25', action: 'Donation made to Clean India', amount: '₹180', status: 'success' },
    { id: 3, date: '2024-11-20', action: 'Pickup scheduled', amount: '-', status: 'pending' },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-gray-900 mb-2">Welcome back, {userName}!</h1>
        <p className="text-gray-600">Here's your impact summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#3BAF69] rounded-xl flex items-center justify-center">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#3BAF69] text-xs bg-white px-2 py-1 rounded-full">+5kg</span>
          </div>
          <div className="text-gray-900 mb-1">32.5 kg</div>
          <p className="text-gray-600">Total Recycled</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-500 text-xs bg-white px-2 py-1 rounded-full">+₹250</span>
          </div>
          <div className="text-gray-900 mb-1">₹1,840</div>
          <p className="text-gray-600">Total Donated</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">12</div>
          <p className="text-gray-600">Pickups Done</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">3 Badges</div>
          <p className="text-gray-600">Achievements</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-[#3BAF69]" />
            </div>
            <div className="flex-1">
              <div className="text-gray-900 mb-2">Ready to Recycle?</div>
              <p className="text-gray-600 mb-4">Schedule your next pickup and make an impact</p>
              <Button className="bg-[#3BAF69] hover:bg-[#2d9755]" onClick={() => setView('book')}>
                Book Pickup <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-gray-900 mb-2">View Your Impact</div>
              <p className="text-gray-600 mb-4">See detailed breakdown of your contributions</p>
              <Button variant="outline" onClick={() => setView('impact')}>
                View Impact <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Your Badges</h2>
          <button className="text-[#3BAF69] hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`text-center p-4 rounded-xl border transition-all ${
                badge.earned
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="text-gray-900">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Recent Activity</h2>
          <button onClick={() => setView('status')} className="text-[#3BAF69] hover:underline">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.status === 'success'
                      ? 'bg-green-100 text-[#3BAF69]'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-gray-900">{activity.action}</div>
                  <div className="text-gray-600">{activity.date}</div>
                </div>
              </div>
              <div className="text-gray-900">{activity.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl text-white">
        <h2 className="text-white mb-4">Your Environmental Impact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-white mb-1">145 kg</div>
            <p className="text-green-100">CO₂ Saved</p>
          </div>
          <div>
            <div className="text-white mb-1">8 Trees</div>
            <p className="text-green-100">Equivalent Planted</p>
          </div>
          <div>
            <div className="text-white mb-1">420 L</div>
            <p className="text-green-100">Water Saved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
