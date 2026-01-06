import { useState } from 'react';
import { User as UserIcon, Mail, MapPin, Bell, Edit2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { User } from '../../App';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  });

  const [notifications, setNotifications] = useState({
    pickupReminders: true,
    weeklyReports: true,
    achievements: true,
    leaderboardUpdates: false,
    ngoUpdates: true,
  });

  const handleSave = () => {
    // In real app, this would save to backend
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-green-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Header */}
      <Card className="border-green-100">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <span className="text-3xl">{user.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-green-900 mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-1">{user.email}</p>
              <p className="text-gray-600">Member since June 2025</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
              <p className="text-gray-600 mb-1">User ID</p>
              <p className="text-green-600">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-green-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-900">Personal Information</CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                      address: user.address,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-green-600" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 px-3 py-2">{formData.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-green-600" />
              Email Address
            </Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 px-3 py-2">{formData.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              Address
            </Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-gray-900 px-3 py-2">{formData.address}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 mb-1">Pickup Reminders</p>
              <p className="text-gray-600">Get notified before scheduled pickups</p>
            </div>
            <Switch
              checked={notifications.pickupReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, pickupReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 mb-1">Weekly Impact Reports</p>
              <p className="text-gray-600">Receive weekly summaries of your impact</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyReports: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 mb-1">Achievement Notifications</p>
              <p className="text-gray-600">Get notified when you earn new badges</p>
            </div>
            <Switch
              checked={notifications.achievements}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, achievements: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 mb-1">Leaderboard Updates</p>
              <p className="text-gray-600">Track your position changes on leaderboard</p>
            </div>
            <Switch
              checked={notifications.leaderboardUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, leaderboardUpdates: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 mb-1">NGO Impact Stories</p>
              <p className="text-gray-600">Receive updates from partner NGOs</p>
            </div>
            <Switch
              checked={notifications.ngoUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, ngoUpdates: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-900">Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
              <p className="text-gray-600 mb-1">Account Age</p>
              <p className="text-green-600">6 months</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
              <p className="text-gray-600 mb-1">Total Pickups</p>
              <p className="text-green-600">12</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
              <p className="text-gray-600 mb-1">Badges Earned</p>
              <p className="text-green-600">4 / 8</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-900 mb-1">Delete Account</p>
              <p className="text-gray-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
