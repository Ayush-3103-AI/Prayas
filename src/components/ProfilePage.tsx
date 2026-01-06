import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Mail, Bell, Save, Edit, Award, Settings, Download, Trash2, Key } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { UserNavbar } from './UserNavbar';
import { Badge } from './ui/badge';
import { apiClient } from '../utils/apiClient';
import { cn } from './ui/utils';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    userId: '',
    memberSince: '',
  });
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);

  const [notifications, setNotifications] = useState({
    pickupReminders: true,
    achievementAlerts: true,
    monthlyReports: true,
    ngoUpdates: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id) {
            const userData = await apiClient.getUser(user.id);
            setProfile({
              name: userData.user.name,
              email: userData.user.email,
              address: userData.user.address || '',
              userId: user.id,
              memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            });
            
            // Fetch badges
            const impactData = await apiClient.getUserImpact(user.id);
            setBadges(impactData.badges || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        await apiClient.updateUser(user.id, {
          name: profile.name,
          address: profile.address,
        });
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error: any) {
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  // All available badges (some locked)
  const allBadges = [
    { id: 1, name: 'First Pickup', emoji: '🎯', earned: badges.some(b => b.name === 'First Pickup') },
    { id: 2, name: '10kg Recycled', emoji: '♻️', earned: badges.some(b => b.name === '10kg Recycled') },
    { id: 3, name: 'Eco Warrior', emoji: '🌱', earned: badges.some(b => b.name === 'Eco Warrior') },
    { id: 4, name: '50kg Milestone', emoji: '⭐', earned: badges.some(b => b.name === '50kg Milestone') },
    { id: 5, name: 'Community Leader', emoji: '👑', earned: badges.some(b => b.name === 'Community Leader') },
    { id: 6, name: '100kg Hero', emoji: '🏆', earned: badges.some(b => b.name === '100kg Hero') },
    { id: 7, name: 'Carbon Neutral', emoji: '🌍', earned: badges.some(b => b.name === 'Carbon Neutral') },
    { id: 8, name: 'Philanthropist', emoji: '💚', earned: badges.some(b => b.name === 'Philanthropist') },
  ];

  return (
      <div className="min-h-screen">
        <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="profile" />
        
        <div className="md:ml-64 container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl text-white mb-2">Profile</h1>
          <p className="text-xl text-white/60 mb-8">Manage your account and preferences</p>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Header with Avatar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <RecycledPaperCard className="p-8" glowColor="emerald">
                <div className="flex items-center gap-6">
                  {/* Large Avatar with Glowing Border */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-full blur-xl opacity-50 animate-pulse-slow" />
                    <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-400/50">
                      <User className="w-16 h-16 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-3xl text-white mb-2">{profile.name || 'User'}</h2>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-2">
                      User ID: {profile.userId || 'N/A'}
                    </Badge>
                    <p className="text-white/60">Member since {profile.memberSince}</p>
                  </div>
                </div>
              </RecycledPaperCard>

              {/* Trophy Cabinet */}
              <RecycledPaperCard className="p-6 mt-6" glowColor="gold">
                <h3 className="text-2xl text-white mb-6 uppercase tracking-wide flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" strokeWidth={2} />
                  Trophy Cabinet
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {allBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={cn(
                        "text-center p-4 rounded-xl transition-all",
                        badge.earned
                          ? "bg-amber-500/10 border border-amber-500/30"
                          : "bg-white/5 border border-white/10 opacity-40 grayscale"
                      )}
                    >
                      <div className="text-4xl mb-2">{badge.emoji}</div>
                      <div className={cn(
                        "text-xs uppercase tracking-wide",
                        badge.earned ? "text-amber-400" : "text-white/40"
                      )}>
                        {badge.name}
                      </div>
                      {badge.earned && (
                        <div className="mt-2 text-xs text-amber-400">✓ Unlocked</div>
                      )}
                    </div>
                  ))}
                </div>
              </RecycledPaperCard>

              {/* Personal Information */}
              <RecycledPaperCard className="p-6 mt-6" glowColor="emerald">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl text-white">Personal Information</h3>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button onClick={handleSave} variant="emerald" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-white/80 uppercase tracking-wide">
                      <User className="w-4 h-4" strokeWidth={2} />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-white/80 uppercase tracking-wide">
                      <Mail className="w-4 h-4" strokeWidth={2} />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2 mb-2 text-white/80 uppercase tracking-wide">
                      <MapPin className="w-4 h-4" strokeWidth={2} />
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </RecycledPaperCard>

              {/* Notification Preferences */}
              <RecycledPaperCard className="p-6 mt-6" glowColor="emerald">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6" strokeWidth={2} />
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {[
                    { key: 'pickupReminders', label: 'Pickup Reminders', desc: 'Get notified before scheduled pickups' },
                    { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Get notified when you earn new badges' },
                    { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Receive monthly impact summary' },
                    { key: 'ngoUpdates', label: 'NGO Updates', desc: 'Receive updates from partner NGOs' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <div className="text-white mb-1">{item.label}</div>
                        <div className="text-sm text-white/60">{item.desc}</div>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                      />
                    </div>
                  ))}
                </div>
              </RecycledPaperCard>
            </motion.div>

            {/* Stats Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <RecycledPaperCard className="p-6" glowColor="emerald">
                <h3 className="text-xl text-white mb-6 uppercase tracking-wide">Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span className="text-white/60">Total Recycled</span>
                    <span className="text-white font-semibold">145 kg</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span className="text-white/60">Total Donated</span>
                    <span className="text-white font-semibold">₹2,850</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span className="text-white/60">Leaderboard Rank</span>
                    <span className="text-white font-semibold">#3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Badges Earned</span>
                    <span className="text-white font-semibold">{badges.length}</span>
                  </div>
                </div>
              </RecycledPaperCard>

              {/* Account Management */}
              <RecycledPaperCard className="p-6" glowColor="emerald">
                <h3 className="text-xl text-white mb-6 uppercase tracking-wide flex items-center gap-2">
                  <Settings className="w-5 h-5" strokeWidth={2} />
                  Account
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-white/80 hover:text-white">
                    <Key className="w-4 h-4 mr-2" strokeWidth={2} />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white/80 hover:text-white">
                    <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                    Download My Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={onLogout}
                  >
                    <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                    Logout
                  </Button>
                </div>
              </RecycledPaperCard>
            </motion.div>
          </div>
        </div>
      </div>
  );
}
