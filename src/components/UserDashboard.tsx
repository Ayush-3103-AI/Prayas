import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Recycle, Heart, Package, Award, Plus, TrendingUp, TreePine, Activity, HandHeart } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
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

  const [carbonData, setCarbonData] = useState({ total: 0, offset: 0 });
  const [stats, setStats] = useState([
    {
      icon: Recycle,
      label: 'Total Waste Recycled',
      value: '0 kg',
      trend: '',
    },
    {
      icon: Heart,
      label: 'Total Donated',
      value: '₹0',
      trend: '',
    },
    {
      icon: Package,
      label: 'Pickups Completed',
      value: '0',
      trend: '0 pending',
    },
    {
      icon: Award,
      label: 'Badges Earned',
      value: '0',
      trend: '',
    },
  ]);
  const [badges, setBadges] = useState<any[]>([]);
  const [recentPickups, setRecentPickups] = useState<any[]>([]);
  const [livePulse, setLivePulse] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        
        const user = JSON.parse(userStr);
        if (user.id) {
          const impactData = await apiClient.getUserImpact(user.id);
          const bookingsData = await apiClient.getUserBookings(user.id);
          
          const bookings = (bookingsData as any)?.bookings || (Array.isArray(bookingsData) ? bookingsData : []);
          const activeCount = bookings.filter((b: any) => 
            ['Pending', 'Assigned', 'In Progress'].includes(b.status)
          ).length;
          
          const totalWaste = impactData.totalWaste || 0;
          const carbonOffset = totalWaste * 2.5; // Approximate CO2 offset per kg
          
          setCarbonData({ total: totalWaste, offset: carbonOffset });
          
          setStats([
            {
              icon: Recycle,
              label: 'Total Waste Recycled',
              value: `${totalWaste} kg`,
              trend: '',
            },
            {
              icon: Heart,
              label: 'Total Donated',
              value: `₹${(impactData.totalDonations || 0).toLocaleString('en-IN')}`,
              trend: '',
            },
            {
              icon: Package,
              label: 'Pickups Completed',
              value: String(bookings.filter((b: any) => b.status === 'Completed').length),
              trend: `${activeCount} pending`,
            },
            {
              icon: Award,
              label: 'Badges Earned',
              value: String(impactData.badges?.length || 0),
              trend: '',
            },
          ]);
          
          const recent = bookings.slice(0, 3).map((booking: any) => ({
            id: booking.bookingId,
            date: new Date(booking.createdAt).toLocaleDateString(),
            type: booking.wasteType,
            weight: `${booking.weight} kg`,
            status: booking.status,
            amount: `₹${(booking.weight * 10).toLocaleString('en-IN')}`,
          }));
          setRecentPickups(recent);
          setBadges(impactData.badges || []);
          
          // Live Pulse feed (simulated community actions)
          setLivePulse([
            { id: 1, action: 'Priya recycled 5kg', time: '2m ago' },
            { id: 2, action: 'Raj donated ₹500', time: '5m ago' },
            { id: 3, action: 'Anjali earned Eco Warrior badge', time: '8m ago' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const carbonPercentage = carbonData.total > 0 ? Math.min((carbonData.offset / 1000) * 100, 100) : 0;

  return (
    <div className="min-h-screen">
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="dashboard" />
      
        <div className="md:ml-64 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 blur-zone-light p-6 rounded-lg">
          <h1 className="text-4xl md:text-5xl text-[#3d2817] mb-2">Welcome, {userName}</h1>
          <p className="text-xl text-[#2c1810]">Your environmental command center</p>
        </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-6 mb-8" style={{ height: '600px' }}>
            {/* Carbon Tracker - 2x2 Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2"
            >
              <RecycledPaperCard className="h-full p-8 flex flex-col justify-between group">
                <div>
                  <h2 className="text-3xl text-[#3d2817] mb-2">Carbon Tracker</h2>
                  <p className="text-[#3d2817]/60 mb-6">Your environmental impact</p>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform group-hover:rotate-90 transition-transform duration-500" viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#6b8e6b"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - carbonPercentage / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold text-[#3d2817]">{carbonData.offset.toFixed(0)}</div>
                      <div className="text-sm text-[#3d2817]/60 uppercase tracking-wide">kg CO₂ offset</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-[#3d2817]/60">
                  {carbonData.total} kg recycled
                </div>
              </RecycledPaperCard>
            </motion.div>

            {/* Reforestation - 1x1 Gold */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <RecycledPaperCard className="h-full p-6 flex flex-col justify-between">
                <TreePine className="w-12 h-12 text-amber-400 mb-4" strokeWidth={2} />
                <div>
                  <div className="text-3xl font-bold text-[#3d2817] mb-1">12</div>
                  <div className="text-sm text-[#3d2817]/60 uppercase tracking-wide">Trees Planted</div>
                </div>
              </RecycledPaperCard>
            </motion.div>

            {/* Live Pulse - 1x2 Vertical Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="row-span-2"
            >
              <RecycledPaperCard className="h-full p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-[#6b8e6b]" strokeWidth={2} />
                  <h3 className="text-lg text-[#3d2817] uppercase tracking-wide">Live Pulse</h3>
                </div>
                <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
                  {livePulse.map((item) => (
                    <div key={item.id} className="text-sm">
                      <div className="text-[#3d2817]/80">{item.action}</div>
                      <div className="text-[#3d2817]/40 text-xs mt-1">{item.time}</div>
                    </div>
                  ))}
                </div>
              </RecycledPaperCard>
            </motion.div>

            {/* Philanthropy - 1x1 Blue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RecycledPaperCard className="h-full p-6 flex flex-col justify-between">
                <HandHeart className="w-12 h-12 text-blue-400 mb-4" strokeWidth={2} />
                <div>
                  <div className="text-3xl font-bold text-[#3d2817] mb-1">₹2,450</div>
                  <div className="text-sm text-[#3d2817]/60 uppercase tracking-wide">Donated</div>
                </div>
              </RecycledPaperCard>
            </motion.div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <RecycledPaperCard className="p-8">
                <h2 className="text-2xl text-[#3d2817] mb-4">Ready to Recycle?</h2>
                <p className="text-[#3d2817]/60 mb-6">Book your next pickup and continue making a difference</p>
                <Button
                  onClick={() => onNavigate('book-pickup')}
                  size="lg"
                  variant="emerald"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Book New Pickup
                </Button>
              </RecycledPaperCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RecycledPaperCard className="p-6">
                <h3 className="text-xl text-[#3d2817] mb-4 uppercase tracking-wide">Achievement Badges</h3>
                <div className="grid grid-cols-3 gap-3">
                  {badges.slice(0, 6).map((badge, index) => (
                    <div
                      key={index}
                      className={`text-center ${!badge.earned && 'opacity-40 grayscale'}`}
                    >
                      <div className="text-3xl mb-1">{badge.emoji}</div>
                      <div className="text-xs text-[#3d2817]/60">{badge.name}</div>
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
              </RecycledPaperCard>
            </motion.div>
          </div>

          {/* Recent Pickups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <RecycledPaperCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-[#3d2817]">Recent Pickups</h3>
                <Button onClick={() => onNavigate('pickup-status')} variant="outline">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentPickups.length > 0 ? (
                  recentPickups.map((pickup, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                        </div>
                        <div>
                          <div className="text-[#3d2817]">#{pickup.id}</div>
                          <div className="text-sm text-[#3d2817]/60">{pickup.date} • {pickup.type} • {pickup.weight}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#3d2817]">{pickup.amount}</div>
                        <Badge className="bg-[#6b8e6b]/20 text-[#6b8e6b] border-emerald-500/30">
                          {pickup.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[#3d2817]/60 py-8">No pickups yet</div>
                )}
              </div>
            </RecycledPaperCard>
          </motion.div>
        </div>
      </div>
  );
}
