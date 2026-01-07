import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Recycle, Heart, Package, Award, Plus, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { UserNavbar } from './UserNavbar';
import { Badge } from './ui/badge';
import { apiClient } from '../utils/apiClient';

interface UserDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function UserDashboard({ onNavigate, onLogout }: UserDashboardProps) {
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.name || 'User');
          
          // Fetch full user data from API
          if (user.id) {
            const userData = await apiClient.getUser(user.id);
            setUserName(userData.user.name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [stats, setStats] = useState([
    {
      icon: Recycle,
      label: 'Total Waste Recycled',
      value: '0 kg',
      trend: '',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Heart,
      label: 'Total Donated',
      value: '₹0',
      trend: '',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Package,
      label: 'Pickups Completed',
      value: '0',
      trend: '0 pending',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Award,
      label: 'Badges Earned',
      value: '0',
      trend: '',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ]);
  const [badges, setBadges] = useState<any[]>([]);
  const [recentPickups, setRecentPickups] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        
        const user = JSON.parse(userStr);
        if (user.id) {
          // Fetch user impact data
          const impactData = await apiClient.getUserImpact(user.id);
          console.log('User impact data:', impactData);
          
          // Fetch user bookings
          const bookingsData: any = await apiClient.getUserBookings(user.id);
          console.log('User bookings data:', bookingsData);
          
          // Extract bookings array - handle both { bookings: [...] } and { data: { bookings: [...] } }
          const bookings = (bookingsData as any)?.bookings || 
                          (bookingsData as any)?.data?.bookings || 
                          (Array.isArray(bookingsData) ? bookingsData : []);
          
          // Calculate active pickups from bookings (Pending, Assigned, In Progress)
          const activeCount = bookings.filter((b: any) => 
            ['Pending', 'Assigned', 'In Progress'].includes(b.status)
          ).length;
          
          // Update stats
          setStats([
            {
              icon: Recycle,
              label: 'Total Waste Recycled',
              value: `${impactData.totalWaste || 0} kg`,
              trend: '',
              color: 'bg-green-100 text-green-600',
            },
            {
              icon: Heart,
              label: 'Total Donated',
              value: `₹${(impactData.totalDonations || 0).toLocaleString('en-IN')}`,
              trend: '',
              color: 'bg-red-100 text-red-600',
            },
            {
              icon: Package,
              label: 'Pickups Completed',
              value: String(bookings.filter((b: any) => b.status === 'Completed').length),
              trend: `${activeCount} pending`,
              color: 'bg-blue-100 text-blue-600',
            },
            {
              icon: Award,
              label: 'Badges Earned',
              value: String(impactData.badges?.length || 0),
              trend: '',
              color: 'bg-yellow-100 text-yellow-600',
            },
          ]);
          
          // Update recent pickups
          const recent = bookings.slice(0, 3).map((booking: any) => ({
            id: booking.bookingId,
            date: new Date(booking.createdAt).toLocaleDateString(),
            type: booking.wasteType,
            weight: `${booking.weight} kg`,
            status: booking.status,
            amount: `₹${(booking.weight * 10).toLocaleString('en-IN')}`,
          }));
          setRecentPickups(recent);
          
          // Update badges
          setBadges(impactData.badges || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    
    fetchDashboardData();
    
    // Poll for updates every 3 seconds to reflect real-time changes
    // This ensures user dashboard updates when agent completes pickup
    const interval = setInterval(fetchDashboardData, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Welcome {userName}! 👋</h1>
          <p className="text-xl text-gray-600">Here's your recycling impact summary</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Action */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-gradient-to-r from-[#3BAF69] to-[#2d9355] text-white">
              <h2 className="text-2xl mb-4">Ready to recycle?</h2>
              <p className="text-green-100 mb-6">Book your next pickup and continue making a difference</p>
              <Button
                onClick={() => onNavigate('book-pickup')}
                size="lg"
                variant="secondary"
                className="bg-white text-[#3BAF69] hover:bg-green-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Book New Pickup
              </Button>
            </Card>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-4">Achievement Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`text-center ${!badge.earned && 'opacity-40 grayscale'}`}
                  >
                    <div className="text-3xl mb-1">{badge.emoji}</div>
                    <div className="text-xs text-gray-600">{badge.name}</div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => onNavigate('impact')}
                variant="outline"
                className="w-full mt-4"
              >
                View All
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Recent Pickups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-gray-900">Recent Pickups</h3>
              <Button onClick={() => onNavigate('pickup-status')} variant="outline">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentPickups.map((pickup, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-gray-900">#{pickup.id}</div>
                      <div className="text-sm text-gray-600">{pickup.date} • {pickup.type} • {pickup.weight}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900">{pickup.amount}</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {pickup.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
