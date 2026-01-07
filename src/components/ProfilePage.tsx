import { useState } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Phone, Mail, Bell, Save, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { UserNavbar } from './UserNavbar';
import { Badge } from './ui/badge';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20 md:pb-8">
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="profile" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-xl text-gray-600 mb-8">Manage your account and preferences</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#3BAF69] to-[#2d9355] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-1">{profile.name}</h2>
                <Badge variant="secondary" className="mb-2">User ID: {profile.userId}</Badge>
                <p className="text-sm text-gray-600">Member since {profile.memberSince}</p>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Recycled</span>
                  <span className="text-gray-900">145 kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Donated</span>
                  <span className="text-gray-900">₹2,850</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Leaderboard Rank</span>
                  <span className="text-gray-900">#3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Badges Earned</span>
                  <span className="text-gray-900">8</span>
                </div>
              </div>

              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full mt-6"
              >
                Logout
              </Button>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-[#3BAF69] hover:bg-[#2d9355]">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
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
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
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
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card className="p-6">
              <h3 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <div className="text-gray-900 mb-1">Pickup Reminders</div>
                    <div className="text-sm text-gray-600">Get notified before scheduled pickups</div>
                  </div>
                  <Switch
                    checked={notifications.pickupReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pickupReminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <div className="text-gray-900 mb-1">Achievement Alerts</div>
                    <div className="text-sm text-gray-600">Get notified when you earn new badges</div>
                  </div>
                  <Switch
                    checked={notifications.achievementAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, achievementAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <div className="text-gray-900 mb-1">Monthly Reports</div>
                    <div className="text-sm text-gray-600">Receive monthly impact summary</div>
                  </div>
                  <Switch
                    checked={notifications.monthlyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <div className="text-gray-900 mb-1">NGO Updates</div>
                    <div className="text-sm text-gray-600">Receive updates from partner NGOs</div>
                  </div>
                  <Switch
                    checked={notifications.ngoUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, ngoUpdates: checked })}
                  />
                </div>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h3 className="text-2xl text-gray-900 mb-6">Account Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
