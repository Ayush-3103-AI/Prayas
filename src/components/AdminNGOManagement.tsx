import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Plus, Edit, Trash2, Download, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { AdminNavbar } from './AdminNavbar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface AdminNGOManagementProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminNGOManagement({ onNavigate, onLogout }: AdminNGOManagementProps) {
  const [showAddNGO, setShowAddNGO] = useState(false);
  const [newNGO, setNewNGO] = useState({
    name: '',
    focus: '',
    description: '',
    contact: '',
    email: '',
  });

  const ngos = [
    {
      id: 'NGO001',
      name: 'Green Earth Foundation',
      focus: 'Environmental Conservation',
      description: 'Dedicated to preserving natural resources and promoting sustainable living.',
      contact: '+91 98765 11111',
      email: 'contact@greenearthfoundation.org',
      totalDonations: '₹84,500',
      activePickups: 142,
      status: 'active',
    },
    {
      id: 'NGO002',
      name: 'Hope for Children',
      focus: 'Child Education',
      description: 'Providing quality education and support to underprivileged children.',
      contact: '+91 98765 22222',
      email: 'info@hopeforchildren.org',
      totalDonations: '₹62,300',
      activePickups: 98,
      status: 'active',
    },
    {
      id: 'NGO003',
      name: 'Clean India Initiative',
      focus: 'Waste Management',
      description: 'Working towards a cleaner India through innovative waste management solutions.',
      contact: '+91 98765 33333',
      email: 'hello@cleanindia.org',
      totalDonations: '₹45,800',
      activePickups: 76,
      status: 'active',
    },
    {
      id: 'NGO004',
      name: 'Animal Welfare Trust',
      focus: 'Animal Care',
      description: 'Rescuing and rehabilitating stray and injured animals.',
      contact: '+91 98765 44444',
      email: 'support@animalwelfare.org',
      totalDonations: '₹28,900',
      activePickups: 54,
      status: 'active',
    },
  ];

  const handleAddNGO = () => {
    alert('NGO added successfully!');
    setShowAddNGO(false);
    setNewNGO({ name: '', focus: '', description: '', contact: '', email: '' });
  };

  const downloadReport = () => {
    alert('Downloading donation report...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AdminNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="admin-ngos" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-gray-900 mb-2">NGO Management</h1>
            <p className="text-xl text-gray-600">Manage partner NGOs and track donations</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={downloadReport} variant="outline">
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            <Button onClick={() => setShowAddNGO(true)} className="bg-[#3BAF69] hover:bg-[#2d9355]">
              <Plus className="w-5 h-5 mr-2" />
              Add NGO
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Total NGOs</div>
            <div className="text-3xl text-gray-900">{ngos.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Total Donations</div>
            <div className="text-3xl text-gray-900">₹2,21,500</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Active Pickups</div>
            <div className="text-3xl text-gray-900">370</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Growth</div>
            <div className="text-3xl text-green-600 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              +18%
            </div>
          </Card>
        </div>

        {/* NGO List */}
        <div className="grid md:grid-cols-2 gap-6">
          {ngos.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900">{ngo.name}</h3>
                      <p className="text-sm text-gray-600">{ngo.focus}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>

                <p className="text-gray-600 mb-4">{ngo.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Donations</div>
                    <div className="text-xl text-gray-900">{ngo.totalDonations}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Active Pickups</div>
                    <div className="text-xl text-gray-900">{ngo.activePickups}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Contact:</span>
                    <span className="text-gray-900">{ngo.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{ngo.email}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add NGO Modal */}
        {showAddNGO && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl p-8">
              <h2 className="text-2xl text-gray-900 mb-6">Add New NGO Partner</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="ngo-name">NGO Name</Label>
                  <Input
                    id="ngo-name"
                    placeholder="Enter NGO name"
                    value={newNGO.name}
                    onChange={(e) => setNewNGO({ ...newNGO, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="ngo-focus">Focus Area</Label>
                  <Input
                    id="ngo-focus"
                    placeholder="e.g., Child Education, Environmental Conservation"
                    value={newNGO.focus}
                    onChange={(e) => setNewNGO({ ...newNGO, focus: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="ngo-description">Description</Label>
                  <Textarea
                    id="ngo-description"
                    placeholder="Brief description of the NGO's work"
                    value={newNGO.description}
                    onChange={(e) => setNewNGO({ ...newNGO, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ngo-contact">Contact Number</Label>
                    <Input
                      id="ngo-contact"
                      placeholder="+91 98765 43210"
                      value={newNGO.contact}
                      onChange={(e) => setNewNGO({ ...newNGO, contact: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ngo-email">Email Address</Label>
                    <Input
                      id="ngo-email"
                      type="email"
                      placeholder="contact@ngo.org"
                      value={newNGO.email}
                      onChange={(e) => setNewNGO({ ...newNGO, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setShowAddNGO(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNGO}
                  disabled={!newNGO.name || !newNGO.focus || !newNGO.contact || !newNGO.email}
                  className="flex-1 bg-[#3BAF69] hover:bg-[#2d9355]"
                >
                  Add NGO
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
