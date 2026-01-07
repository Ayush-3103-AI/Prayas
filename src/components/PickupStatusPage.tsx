import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, FileText, MapPin, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { UserNavbar } from './UserNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { apiClient } from '../utils/apiClient';

interface PickupStatusPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function PickupStatusPage({ onNavigate, onLogout }: PickupStatusPageProps) {
  const [pickups, setPickups] = useState<any[]>([]);

  const fetchPickups = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      if (!user.id) return;

      // Fetch user bookings instead of pickups
      const bookingsData: any = await apiClient.getUserBookings(user.id);
      console.log('PickupStatus - bookings data:', bookingsData);
      // Extract bookings array - handle both { bookings: [...] } and { data: { bookings: [...] } }
      const bookings = (bookingsData as any)?.bookings || 
                      (bookingsData as any)?.data?.bookings || 
                      (Array.isArray(bookingsData) ? bookingsData : []);
      
      const transformedPickups = bookings.map((p: any) => {
        // Map booking statuses to display statuses
        const statusMap: { [key: string]: string } = {
          'Pending': 'pending',
          'Assigned': 'assigned',
          'In Progress': 'agent-on-way',
          'Collected': 'collected',
          'Completed': 'donated',
        };
        
        const status = statusMap[p.status] || 'pending';
        const statusLabels: { [key: string]: string } = {
          'pending': 'Pending Assignment',
          'assigned': 'Assigned',
          'agent-on-way': 'Agent on the way',
          'collected': 'Collected',
          'donated': 'Donated',
        };

        const weight = p.weight || 0;
        const address = p.address || 'N/A';
        
        // Build timeline based on status
        const timeline = [];
        timeline.push({ label: 'Booking Confirmed', time: new Date(p.createdAt).toLocaleTimeString(), completed: true });
        
        if (p.status !== 'Pending') {
          timeline.push({ label: 'Agent Assigned', time: p.updatedAt ? new Date(p.updatedAt).toLocaleTimeString() : 'N/A', completed: true });
        }
        
        if (['In Progress', 'Collected', 'Completed'].includes(p.status)) {
          timeline.push({ label: 'Agent on the way', time: 'N/A', completed: true });
        }
        
        if (['Collected', 'Completed'].includes(p.status)) {
          timeline.push({ label: 'Waste Collected', time: p.updatedAt ? new Date(p.updatedAt).toLocaleTimeString() : 'N/A', completed: true });
        }
        
        if (p.status === 'Completed') {
          timeline.push({ label: 'Donated to NGO', time: p.updatedAt ? new Date(p.updatedAt).toLocaleTimeString() : 'N/A', completed: true, active: true });
        } else {
          timeline.push({ label: p.status === 'Collected' ? 'Donated to NGO' : 'Donation', time: 'Pending', completed: false });
        }

        return {
          id: p.bookingId || p._id || p.id,
          date: new Date(p.preferredDate || p.createdAt).toLocaleDateString(),
          wasteType: p.wasteType || 'Mixed',
          weight: `${weight} kg`,
          status,
          statusLabel: statusLabels[status],
          agent: p.agentId?.name || 'Not assigned',
          address,
          estimatedValue: `₹${(weight * 10).toFixed(0)}`, // Estimate
          actualValue: p.status === 'Completed' ? `₹${(weight * 10).toFixed(0)}` : undefined,
          ngo: p.ngoPartner || 'N/A',
          hasReceipt: p.status === 'Completed',
          timeline,
        };
      });
      setPickups(transformedPickups);
    } catch (error) {
      console.error('Failed to fetch pickups:', error);
      // Fallback to mock data
      setPickups([
        {
          id: 'PK1005',
          date: 'Today, 2:30 PM',
          wasteType: 'Plastic',
          weight: '6 kg',
          status: 'agent-on-way',
          statusLabel: 'Agent on the way',
          agent: 'Ramesh Kumar',
          address: '123, Green Street, Sector 42',
          estimatedValue: '₹90',
          ngo: 'Green Earth Foundation',
          timeline: [
            { label: 'Booking Confirmed', time: '1:45 PM', completed: true },
            { label: 'Agent Assigned', time: '2:00 PM', completed: true },
            { label: 'Agent on the way', time: '2:30 PM', completed: true, active: true },
            { label: 'Waste Collected', time: 'Pending', completed: false },
            { label: 'Donated to NGO', time: 'Pending', completed: false },
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    fetchPickups();
    // Refresh every 3 seconds to sync with agent actions in real-time
    // When agent completes pickup, user sees status change immediately
    const interval = setInterval(fetchPickups, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'agent-on-way':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'collected':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'donated':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'agent-on-way':
        return Truck;
      case 'collected':
        return Package;
      case 'donated':
        return CheckCircle;
      default:
        return Package;
    }
  };

  // Active pickups: Pending, Assigned, In Progress, Collected (but not yet Completed/Donated)
  const activePickups = pickups.filter(p => 
    ['pending', 'assigned', 'agent-on-way', 'collected'].includes(p.status)
  );
  // Completed pickups: Completed/Donated status
  const completedPickups = pickups.filter(p => p.status === 'donated');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20 md:pb-8">
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="pickup-status" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-gray-900 mb-2">Pickup Status</h1>
        <p className="text-xl text-gray-600 mb-8">Track your recyclable waste collections</p>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active ({activePickups.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedPickups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activePickups.map((pickup, index) => (
              <PickupCard key={pickup.id} pickup={pickup} index={index} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedPickups.map((pickup, index) => (
              <PickupCard key={pickup.id} pickup={pickup} index={index} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PickupCard({ pickup, index, getStatusColor, getStatusIcon }: any) {
  const StatusIcon = getStatusIcon(pickup.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(pickup.status).replace('border', 'bg')}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl text-gray-900">#{pickup.id}</div>
              <div className="text-sm text-gray-600">{pickup.date}</div>
            </div>
          </div>
          <Badge className={getStatusColor(pickup.status)}>
            {pickup.statusLabel}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600">Waste Details</div>
                <div className="text-gray-900">{pickup.wasteType} • {pickup.weight}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600">Pickup Address</div>
                <div className="text-gray-900">{pickup.address}</div>
              </div>
            </div>
            {pickup.agent && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Agent</div>
                  <div className="text-gray-900">{pickup.agent}</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {pickup.timeline.map((step: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  step.completed
                    ? 'border-[#3BAF69] bg-[#3BAF69]'
                    : 'border-gray-300 bg-white'
                }`}>
                  {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div className={idx < pickup.timeline.length - 1 ? 'border-l-2 border-gray-200 pl-4 pb-4' : 'pl-4'}>
                  <div className={`${step.active ? 'text-[#3BAF69]' : step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </div>
                  <div className="text-sm text-gray-600">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="text-sm text-gray-600">
              {pickup.actualValue ? 'Donation Amount' : 'Estimated Value'}
            </div>
            <div className="text-2xl text-gray-900">
              {pickup.actualValue || pickup.estimatedValue}
            </div>
            <div className="text-sm text-gray-600">to {pickup.ngo}</div>
          </div>
          {pickup.hasReceipt && (
            <Button variant="outline">
              <FileText className="w-5 h-5 mr-2" />
              Download Receipt
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
