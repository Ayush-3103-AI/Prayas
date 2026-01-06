import { useState, useEffect } from 'react';
import { Search, Filter, Eye, UserPlus, MapPin, Package, User as UserIcon, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { apiClient } from '../../utils/apiClient';

interface Pickup {
  id: string;
  trackingNumber: string;
  date: string;
  time: string;
  userName: string;
  address: string;
  wasteType: string;
  weight: number;
  status: 'pending' | 'assigned' | 'on-the-way' | 'collected' | 'donated';
  agentId?: string;
  agentName?: string;
  ngo: string;
  amount?: number;
}

const agents = [
  { id: 'A001', name: 'Rajesh Kumar', zone: 'North Delhi' },
  { id: 'A002', name: 'Vikram Patel', zone: 'South Delhi' },
  { id: 'A003', name: 'Amit Singh', zone: 'East Delhi' },
  { id: 'A004', name: 'Suresh Rao', zone: 'West Delhi' },
];

export function PickupManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Mock data
  const [pickups, setPickups] = useState<Pickup[]>([
    {
      id: '1',
      trackingNumber: 'PR20251203',
      date: '2025-12-03',
      time: 'Morning (9 AM - 12 PM)',
      userName: 'Priya Sharma',
      address: '123, Green Park, New Delhi, 110016',
      wasteType: 'Plastic',
      weight: 5.0,
      status: 'pending',
      ngo: 'Education for All Foundation'
    },
    {
      id: '2',
      trackingNumber: 'PR20251203',
      date: '2025-12-03',
      time: 'Afternoon (12 PM - 3 PM)',
      userName: 'Amit Verma',
      address: '456, Eco Colony, New Delhi, 110017',
      wasteType: 'Paper',
      weight: 3.5,
      status: 'assigned',
      agentId: 'A001',
      agentName: 'Rajesh Kumar',
      ngo: 'Green Earth Initiative'
    },
    {
      id: '3',
      trackingNumber: 'PR20251202',
      date: '2025-12-02',
      time: 'Evening (3 PM - 6 PM)',
      userName: 'Sneha Gupta',
      address: '789, Sustainable Street, New Delhi, 110018',
      wasteType: 'Metal',
      weight: 6.5,
      status: 'collected',
      agentId: 'A002',
      agentName: 'Vikram Patel',
      ngo: 'Health & Wellness Trust',
      amount: 650
    },
    {
      id: '4',
      trackingNumber: 'PR20251201',
      date: '2025-12-01',
      time: 'Morning (9 AM - 12 PM)',
      userName: 'Kavya Singh',
      address: '321, Nature Avenue, New Delhi, 110019',
      wasteType: 'E-Waste',
      weight: 2.8,
      status: 'donated',
      agentId: 'A003',
      agentName: 'Amit Singh',
      ngo: 'Child Welfare Society',
      amount: 280
    },
  ]);

  const fetchPickups = async () => {
    try {
      const data = await apiClient.getAllPickups(statusFilter !== 'all' ? statusFilter : undefined);
      const transformedPickups = data.map((p: any) => ({
        id: p._id || p.id,
        trackingNumber: p._id?.slice(-8) || p.id?.slice(-8) || 'N/A',
        date: new Date(p.pickupDate).toISOString().split('T')[0],
        time: p.timeSlot || 'N/A',
        userName: p.userId?.name || 'Unknown',
        address: `${p.address?.street || ''}, ${p.address?.city || ''}, ${p.address?.state || ''} ${p.address?.pincode || ''}`,
        wasteType: p.materials?.[0]?.type || 'Mixed',
        weight: p.materials?.[0]?.actualWeight || p.materials?.[0]?.estimatedWeight || 0,
        status: (p.status === 'completed' || p.status === 'collected' ? 'collected' : 
                 p.status === 'assigned' ? 'assigned' : 
                 p.status === 'in-progress' ? 'on-the-way' : 
                 p.status === 'scheduled' ? 'pending' : 'donated') as any,
        agentId: p.agentId?._id || p.agentId,
        agentName: p.agentId?.name,
        ngo: p.selectedNGO?.name || 'N/A',
        amount: p.totalActualValue || p.totalEstimatedValue,
      }));
      setPickups(transformedPickups);
    } catch (error) {
      console.error('Failed to fetch pickups:', error);
      // Keep existing mock data if API fails
    }
  };

  useEffect(() => {
    fetchPickups();
    // Refresh every 3 seconds for better sync across portals
    const interval = setInterval(fetchPickups, 3000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const assignAgent = async (pickupId: string, agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      try {
        await apiClient.assignAgentToPickup(pickupId, agentId);
        setPickups(pickups.map(p => 
          p.id === pickupId 
            ? { ...p, status: 'assigned' as const, agentId: agent.id, agentName: agent.name }
            : p
        ));
        fetchPickups(); // Refresh data
      } catch (error: any) {
        console.error('Failed to assign agent:', error);
        alert(`Failed to assign agent: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'on-the-way':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'collected':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'donated':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredPickups = pickups.filter(pickup => {
    const matchesSearch = 
      pickup.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pickup.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pickup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewDetails = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setViewDetailsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-purple-900 mb-2">Pickup Management</h1>
        <p className="text-gray-600">Manage and assign pickups to agents</p>
      </div>

      {/* Filters and Search */}
      <Card className="border-purple-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by tracking number, user name, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="on-the-way">On The Way</SelectItem>
                <SelectItem value="collected">Collected</SelectItem>
                <SelectItem value="donated">Donated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="border-purple-100">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 mb-1">Total</p>
            <div className="text-purple-600">{pickups.length}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-100">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 mb-1">Pending</p>
            <div className="text-yellow-600">{pickups.filter(p => p.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-100">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 mb-1">Assigned</p>
            <div className="text-blue-600">{pickups.filter(p => p.status === 'assigned').length}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-100">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 mb-1">Collected</p>
            <div className="text-orange-600">{pickups.filter(p => p.status === 'collected').length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-4 text-center">
            <p className="text-gray-600 mb-1">Completed</p>
            <div className="text-green-600">{pickups.filter(p => p.status === 'donated').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pickups Table */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-purple-900">All Pickups ({filteredPickups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPickups.map((pickup) => (
              <div
                key={pickup.id}
                className="p-6 bg-white rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-gray-900">{pickup.trackingNumber}</p>
                      <Badge className={`${getStatusColor(pickup.status)} border capitalize`}>
                        {pickup.status}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 flex items-center gap-2 mb-1">
                          <UserIcon className="w-4 h-4" />
                          User
                        </p>
                        <p className="text-gray-900">{pickup.userName}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" />
                          Location
                        </p>
                        <p className="text-gray-900">{pickup.address.substring(0, 30)}...</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4" />
                          Waste Details
                        </p>
                        <p className="text-gray-900">{pickup.wasteType} • {pickup.weight} kg</p>
                        <p className="text-gray-600">{pickup.date}</p>
                      </div>
                    </div>

                    {pickup.agentName && (
                      <div className="mt-3 p-2 bg-blue-50 rounded inline-flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-900">Agent: {pickup.agentName}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDetails(pickup)}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {pickup.status === 'pending' && (
                      <Select onValueChange={(value) => assignAgent(pickup.id, value)}>
                        <SelectTrigger className="w-full">
                          <UserPlus className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Assign Agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name} ({agent.zone})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredPickups.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No pickups found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No pickups have been scheduled yet'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pickup Details</DialogTitle>
            <DialogDescription>
              Tracking Number: {selectedPickup?.trackingNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPickup && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-1">Status</p>
                    <Badge className={`${getStatusColor(selectedPickup.status)} border capitalize`}>
                      {selectedPickup.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-1">User Information</p>
                    <p className="text-gray-900">{selectedPickup.userName}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-1">Pickup Address</p>
                    <p className="text-gray-900">{selectedPickup.address}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-1">Schedule</p>
                    <p className="text-gray-900">{selectedPickup.date}</p>
                    <p className="text-gray-600">{selectedPickup.time}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 mb-1">Waste Details</p>
                    <p className="text-gray-900">{selectedPickup.wasteType}</p>
                    <p className="text-gray-600">{selectedPickup.weight} kg</p>
                  </div>
                  
                  {selectedPickup.agentName && (
                    <div>
                      <p className="text-gray-600 mb-1">Assigned Agent</p>
                      <p className="text-gray-900">{selectedPickup.agentName}</p>
                      <p className="text-gray-600">{selectedPickup.agentId}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-gray-600 mb-1">Beneficiary NGO</p>
                    <p className="text-gray-900">{selectedPickup.ngo}</p>
                    {selectedPickup.amount && (
                      <p className="text-green-600">₹{selectedPickup.amount}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
