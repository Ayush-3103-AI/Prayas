import { useState, useEffect } from 'react';
import { MapPin, Package, Upload, CheckCircle2, Navigation, Clock, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { User } from '../../App';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { apiClient } from '../../utils/apiClient';

interface AgentHomeProps {
  user: User;
}

type PickupStatus = 'assigned' | 'on-the-way' | 'reached' | 'collected';

interface AssignedPickup {
  id: string;
  trackingNumber: string;
  date: string;
  timeSlot: string;
  wasteType: string;
  expectedWeight: number;
  actualWeight?: number;
  status: PickupStatus;
  userName: string;
  address: string;
  ngo: string;
  notes?: string;
}

export function AgentHome({ user }: AgentHomeProps) {
  const [selectedPickup, setSelectedPickup] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState({
    weight: '',
    notes: ''
  });

  // Mock data
  const [pickups, setPickups] = useState<AssignedPickup[]>([
    {
      id: '1',
      trackingNumber: 'PR20251203',
      date: '2025-12-03',
      timeSlot: 'Morning (9 AM - 12 PM)',
      wasteType: 'Plastic',
      expectedWeight: 5.0,
      status: 'assigned',
      userName: 'Priya Sharma',
      address: '123, Green Park, New Delhi, 110016',
      ngo: 'Education for All Foundation',
      notes: 'Please call before arriving'
    },
    {
      id: '2',
      trackingNumber: 'PR20251203',
      date: '2025-12-03',
      timeSlot: 'Afternoon (12 PM - 3 PM)',
      wasteType: 'Paper',
      expectedWeight: 3.5,
      status: 'assigned',
      userName: 'Amit Verma',
      address: '456, Eco Colony, New Delhi, 110017',
      ngo: 'Green Earth Initiative'
    },
    {
      id: '3',
      trackingNumber: 'PR20251202',
      date: '2025-12-02',
      timeSlot: 'Evening (3 PM - 6 PM)',
      wasteType: 'Metal',
      expectedWeight: 7.2,
      actualWeight: 8.5,
      status: 'collected',
      userName: 'Sneha Gupta',
      address: '789, Sustainable Street, New Delhi, 110018',
      ngo: 'Health & Wellness Trust'
    },
  ]);

  const activePickups = pickups.filter(p => p.status !== 'collected');
  const completedPickups = pickups.filter(p => p.status === 'collected');

  const todayStats = {
    total: activePickups.length,
    completed: pickups.filter(p => p.status === 'collected' && p.date === '2025-12-02').length,
    pending: activePickups.length,
    totalWeight: pickups.reduce((sum, p) => sum + (p.actualWeight || 0), 0)
  };

  const updatePickupStatus = (pickupId: string, newStatus: PickupStatus) => {
    setPickups(pickups.map(p => 
      p.id === pickupId ? { ...p, status: newStatus } : p
    ));
  };

  const completeCollection = async (pickupId: string) => {
    if (!collectionData.weight) {
      alert('Please enter the collected weight');
      return;
    }

    try {
      // Get the pickup to find material type
      const pickup = pickups.find(p => p.id === pickupId);
      if (!pickup) {
        alert('Pickup not found');
        return;
      }

      // Update status to 'collected' first with materials array
      await apiClient.updatePickupStatus(pickupId, 'collected', {
        materials: [{
          type: pickup.wasteType.toLowerCase(),
          actualWeight: parseFloat(collectionData.weight),
          estimatedWeight: pickup.expectedWeight,
        }]
      });

      // Then complete the pickup
      await apiClient.updatePickupStatus(pickupId, 'completed');

      // Update local state
      setPickups(pickups.map(p => 
        p.id === pickupId 
          ? { 
              ...p, 
              status: 'collected' as PickupStatus, 
              actualWeight: parseFloat(collectionData.weight) 
            } 
          : p
      ));
      
      setSelectedPickup(null);
      setCollectionData({ weight: '', notes: '' });
      
      // Refresh pickups from API
      fetchPickups();
    } catch (error: any) {
      console.error('Failed to complete pickup:', error);
      alert(`Failed to complete pickup: ${error.message || 'Unknown error'}`);
    }
  };

  const fetchPickups = async () => {
    try {
      const data = await apiClient.getAgentPickups();
      // Transform API data to component format
      const transformedPickups = data.map((p: any) => ({
        id: p._id || p.id,
        trackingNumber: p._id?.slice(-8) || p.id?.slice(-8) || 'N/A',
        date: new Date(p.pickupDate).toISOString().split('T')[0],
        timeSlot: p.timeSlot || 'N/A',
        wasteType: p.materials?.[0]?.type || 'Mixed',
        expectedWeight: p.materials?.[0]?.estimatedWeight || 0,
        actualWeight: p.materials?.[0]?.actualWeight,
        status: (p.status === 'completed' || p.status === 'collected' ? 'collected' : 
                 p.status === 'assigned' ? 'assigned' : 
                 p.status === 'in-progress' ? 'on-the-way' : 'reached') as PickupStatus,
        userName: p.userId?.name || 'Unknown',
        address: `${p.address?.street || ''}, ${p.address?.city || ''}, ${p.address?.state || ''} ${p.address?.pincode || ''}`,
        ngo: p.selectedNGO?.name || 'N/A',
        notes: p.notes || ''
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
  }, []);

  const getStatusColor = (status: PickupStatus) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'on-the-way':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'reached':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'collected':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getStatusLabel = (status: PickupStatus) => {
    switch (status) {
      case 'assigned':
        return 'Assigned';
      case 'on-the-way':
        return 'On The Way';
      case 'reached':
        return 'Reached Location';
      case 'collected':
        return 'Collected';
    }
  };

  const PickupCard = ({ pickup }: { pickup: AssignedPickup }) => {
    const isExpanded = selectedPickup === pickup.id;

    return (
      <Card className="border-blue-100 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-gray-900">{pickup.trackingNumber}</p>
                <Badge className={`${getStatusColor(pickup.status)} border`}>
                  {getStatusLabel(pickup.status)}
                </Badge>
              </div>
              <p className="text-gray-600">{pickup.date} • {pickup.timeSlot}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="text-gray-900">{pickup.userName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600">Pickup Location</p>
                  <p className="text-gray-900">{pickup.address}</p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(pickup.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    <Navigation className="w-4 h-4" />
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600">Waste Details</p>
                  <p className="text-gray-900">{pickup.wasteType}</p>
                  <p className="text-gray-600">
                    Expected: {pickup.expectedWeight} kg
                    {pickup.actualWeight && ` • Collected: ${pickup.actualWeight} kg`}
                  </p>
                </div>
              </div>

              {pickup.notes && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-gray-600 mb-1">⚠️ Special Instructions</p>
                  <p className="text-gray-900">{pickup.notes}</p>
                </div>
              )}
            </div>
          </div>

          {pickup.status !== 'collected' && (
            <>
              {!isExpanded ? (
                <div className="flex gap-2">
                  {pickup.status === 'assigned' && (
                    <Button
                      onClick={() => updatePickupStatus(pickup.id, 'on-the-way')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Start Journey
                    </Button>
                  )}
                  {pickup.status === 'on-the-way' && (
                    <Button
                      onClick={() => updatePickupStatus(pickup.id, 'reached')}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Mark as Reached
                    </Button>
                  )}
                  {pickup.status === 'reached' && (
                    <Button
                      onClick={() => setSelectedPickup(pickup.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Complete Collection
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h3 className="text-gray-900">Complete Collection</h3>
                  
                  <div>
                    <Label htmlFor="weight">Actual Weight Collected (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={collectionData.weight}
                      onChange={(e) => setCollectionData({ ...collectionData, weight: e.target.value })}
                      placeholder="e.g., 5.5"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Collection Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={collectionData.notes}
                      onChange={(e) => setCollectionData({ ...collectionData, notes: e.target.value })}
                      placeholder="Any additional notes about the collection..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPickup(null);
                        setCollectionData({ weight: '', notes: '' });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => completeCollection(pickup.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-blue-900 mb-2">My Assigned Pickups</h1>
        <p className="text-gray-600">Manage your collection schedule</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-1">Pending Today</p>
            <div className="text-blue-600">{todayStats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-gray-600 mb-1">Completed</p>
            <div className="text-green-600">{todayStats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-10 h-10 text-purple-600" />
            </div>
            <p className="text-gray-600 mb-1">Total Weight</p>
            <div className="text-purple-600">{todayStats.totalWeight} kg</div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-10 h-10 text-orange-600" />
            </div>
            <p className="text-gray-600 mb-1">Total Pickups</p>
            <div className="text-orange-600">{todayStats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pickups List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="active">
            Active ({activePickups.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedPickups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activePickups.length > 0 ? (
            activePickups.map((pickup) => (
              <PickupCard key={pickup.id} pickup={pickup} />
            ))
          ) : (
            <Card className="border-blue-100">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No Active Pickups</h3>
                <p className="text-gray-600">
                  You don't have any assigned pickups at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedPickups.length > 0 ? (
            completedPickups.map((pickup) => (
              <PickupCard key={pickup.id} pickup={pickup} />
            ))
          ) : (
            <Card className="border-blue-100">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No Completed Pickups</h3>
                <p className="text-gray-600">
                  Completed pickups will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
