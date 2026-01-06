import { User, MapPin, Mail, Bell, Shield, CreditCard, Edit2, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { useState } from 'react';

interface ProfilePageProps {
  userName: string;
  userId: string;
}

export default function ProfilePage({ userName, userId }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userName,
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    address: '123 Green Street, Apartment 4B, Mumbai, Maharashtra 400001',
  });

  const [notifications, setNotifications] = useState({
    pickupReminders: true,
    impactUpdates: true,
    ngoStories: true,
    leaderboardUpdates: false,
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, would save to backend
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#3BAF69] to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-gray-900 mb-2">{formData.name}</div>
            <div className="text-gray-600 mb-1">{userId}</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-[#3BAF69] rounded-full">Active Member</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full">3 Badges</span>
            </div>
          </div>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={isEditing ? 'bg-[#3BAF69] hover:bg-[#2d9755]' : ''}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-gray-900 mb-6">Personal Information</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Default Pickup Address
            </label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-[#3BAF69]" />
          <h2 className="text-gray-900">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-gray-900 mb-1">Pickup Reminders</div>
              <div className="text-gray-600">Get notified before scheduled pickups</div>
            </div>
            <Switch
              checked={notifications.pickupReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, pickupReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-gray-900 mb-1">Impact Updates</div>
              <div className="text-gray-600">Monthly summary of your environmental impact</div>
            </div>
            <Switch
              checked={notifications.impactUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, impactUpdates: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-gray-900 mb-1">NGO Stories</div>
              <div className="text-gray-600">Updates on how your donations are being used</div>
            </div>
            <Switch
              checked={notifications.ngoStories}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, ngoStories: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-gray-900 mb-1">Leaderboard Updates</div>
              <div className="text-gray-600">Get notified about rank changes</div>
            </div>
            <Switch
              checked={notifications.leaderboardUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, leaderboardUpdates: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-gray-900 mb-6">Account Statistics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-gray-600 mb-1">Member Since</div>
            <div className="text-gray-900">June 15, 2024</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-gray-600 mb-1">Total Pickups</div>
            <div className="text-gray-900">12 Completed</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-gray-600 mb-1">Preferred NGO</div>
            <div className="text-gray-900">GreenEarth Foundation</div>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-[#3BAF69]" />
          <h2 className="text-gray-900">Security & Privacy</h2>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-3" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <CreditCard className="w-4 h-4 mr-3" />
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
