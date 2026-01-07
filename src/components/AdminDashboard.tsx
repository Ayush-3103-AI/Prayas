import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, CheckCircle, Clock, Heart, TrendingUp, Users, Truck, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AdminNavbar } from './AdminNavbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { apiClient } from '../utils/apiClient';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState([
    { icon: Package, label: 'Total Pickups Today', value: '0', trend: '', color: 'bg-blue-100 text-blue-600' },
    { icon: CheckCircle, label: 'Completed Today', value: '0', trend: '', color: 'bg-green-100 text-green-600' },
    { icon: Clock, label: 'Pending Assignment', value: '0', trend: '', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Heart, label: 'Total Donations', value: '₹0', trend: '', color: 'bg-red-100 text-red-600' },
  ]);
  const [recentPickups, setRecentPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const data = await apiClient.getAdminDashboard();
      console.log('Admin dashboard data:', data);
      
      // Handle both direct data and nested data structure
      const statsData = (data as any)?.data || data;
      
      setStats([
        { icon: Package, label: 'Total Pickups Today', value: String(statsData.totalPickupsToday || statsData.totalPickups || 0), trend: '', color: 'bg-blue-100 text-blue-600' },
        { icon: CheckCircle, label: 'Completed Today', value: String(statsData.completedToday || statsData.completed || 0), trend: '', color: 'bg-green-100 text-green-600' },
        { icon: Clock, label: 'Pending Assignment', value: String(statsData.pendingAssignment || statsData.pending || 0), trend: '', color: 'bg-yellow-100 text-yellow-600' },
        { icon: Heart, label: 'Total Donations', value: `₹${(statsData.totalDonations || 0).toLocaleString('en-IN')}`, trend: '', color: 'bg-red-100 text-red-600' },
      ]);
      
      if (statsData.recentPickups) {
        setRecentPickups(statsData.recentPickups);
      }
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 3 seconds to see real-time updates from all users and agents
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startDate = firstDayOfMonth.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      // Generate CSV report
      await apiClient.generateReport('csv', startDate, endDate);
      
      // Trigger download
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams();
      params.append('format', 'csv');
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      
      const response = await fetch(`${API_BASE_URL}/admin/report?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `prayas-report-${today.toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      alert('Report downloaded successfully!');
    } catch (error: any) {
      console.error('Failed to download report:', error);
      alert(`Failed to download report: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // Generate recent activity from recent pickups
  const recentActivity = (recentPickups.length > 0 ? recentPickups.slice(0, 5) : []).map((pickup: any) => {
    const user = pickup.userId;
    const agent = pickup.agentId;
    const timeAgo = pickup.updatedAt ? getTimeAgo(new Date(pickup.updatedAt)) : 'Just now';
    
    if (pickup.status === 'Completed') {
      return {
        type: 'agent',
        message: `Agent ${agent?.name || 'Unknown'} completed pickup ${pickup.bookingId}`,
        time: timeAgo,
      };
    } else if (pickup.status === 'Assigned') {
      return {
        type: 'agent',
        message: `Agent ${agent?.name || 'Unknown'} assigned to pickup ${pickup.bookingId}`,
        time: timeAgo,
      };
    } else {
      return {
        type: 'pickup',
        message: `New pickup request from ${user?.name || 'Unknown'}`,
        time: timeAgo,
      };
    }
  });

  const wasteData = [
    { category: 'Plastic', value: 450, color: '#3BAF69' },
    { category: 'Paper', value: 380, color: '#60D394' },
    { category: 'Metal', value: 280, color: '#A8DADC' },
    { category: 'E-waste', value: 200, color: '#457B9D' },
    { category: 'Glass', value: 140, color: '#1D3557' },
  ];

  const weeklyData = [
    { day: 'Mon', pickups: 32, donations: 4800 },
    { day: 'Tue', pickups: 28, donations: 4200 },
    { day: 'Wed', pickups: 35, donations: 5250 },
    { day: 'Thu', pickups: 30, donations: 4500 },
    { day: 'Fri', pickups: 38, donations: 5700 },
    { day: 'Sat', pickups: 42, donations: 6300 },
    { day: 'Sun', pickups: 25, donations: 3750 },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AdminNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="admin-dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-xl text-gray-600">Overview of platform operations</p>
          </div>
          <Button
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
            className="bg-[#3BAF69] hover:bg-[#2d9355]"
          >
            <Download className="w-5 h-5 mr-2" />
            {isGeneratingReport ? 'Generating...' : 'Download Report'}
          </Button>
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
                  <div className="text-sm text-green-600">{stat.trend}</div>
                </div>
                <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-6">Weekly Pickup Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="pickups" fill="#3BAF69" name="Pickups" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-6">Waste Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.value}kg`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wasteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats and Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Total Users</span>
                  </div>
                  <span className="text-gray-900">3,428</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Active Agents</span>
                  </div>
                  <span className="text-gray-900">42</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Partner NGOs</span>
                  </div>
                  <span className="text-gray-900">15</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Growth Rate</span>
                  </div>
                  <span className="text-green-600">+24%</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h3 className="text-xl text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'pickup' ? 'bg-blue-100' :
                      activity.type === 'agent' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      {activity.type === 'pickup' && <Package className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'agent' && <Truck className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'donation' && <Heart className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900">{activity.message}</div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
