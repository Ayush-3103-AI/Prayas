import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, FileText, MapPin, User } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { Badge } from './ui/badge';
import { UserNavbar } from './UserNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { apiClient } from '../utils/apiClient';
import { cn } from './ui/utils';

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

      const bookingsData = await apiClient.getUserBookings(user.id);
      const bookings = (bookingsData as any)?.bookings || (Array.isArray(bookingsData) ? bookingsData : []);
      
      const transformedPickups = bookings.map((p: any) => {
        const statusMap: { [key: string]: string } = {
          'Pending': 'pending',
          'Assigned': 'assigned',
          'In Progress': 'agent-on-way',
          'Collected': 'collected',
          'Completed': 'donated',
        };
        
        const status = statusMap[p.status] || 'pending';
        const statusLabels: { [key: string]: string } = {
          'pending': 'Processing',
          'assigned': 'Processing',
          'agent-on-way': 'Processing',
          'collected': 'Processing',
          'donated': 'Verified',
        };

        const weight = p.weight || 0;
        const address = p.address || 'N/A';
        
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
          estimatedValue: `₹${(weight * 10).toFixed(0)}`,
          actualValue: p.status === 'Completed' ? `₹${(weight * 10).toFixed(0)}` : undefined,
          ngo: p.ngoPartner || 'N/A',
          hasReceipt: p.status === 'Completed',
          timeline,
        };
      });
      setPickups(transformedPickups);
    } catch (error) {
      console.error('Failed to fetch pickups:', error);
    }
  };

  useEffect(() => {
    fetchPickups();
    const interval = setInterval(fetchPickups, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'donated') {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
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

  const activePickups = pickups.filter(p => 
    ['pending', 'assigned', 'agent-on-way', 'collected'].includes(p.status)
  );
  const completedPickups = pickups.filter(p => p.status === 'donated');

  return (
      <div className="min-h-screen">
        <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="pickup-status" />
        
        <div className="md:ml-64 container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl text-[#3d2817] mb-2">Pickup Status</h1>
          <p className="text-xl text-[#2c1810] mb-8">Track your recyclable waste collections</p>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="bg-white/5 border-white/10">
              <TabsTrigger value="active" className="text-[#3d2817]/60 data-[state=active]:text-[#3d2817] data-[state=active]:bg-white/5">
                Active ({activePickups.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-[#3d2817]/60 data-[state=active]:text-[#3d2817] data-[state=active]:bg-white/5">
                Completed ({completedPickups.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {activePickups.length > 0 ? (
                activePickups.map((pickup, index) => (
                  <PickupCard key={pickup.id} pickup={pickup} index={index} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
                ))
              ) : (
                <RecycledPaperCard className="p-12 text-center">
                  <div className="text-[#3d2817]/60">No active pickups</div>
                </RecycledPaperCard>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {completedPickups.length > 0 ? (
                <RecycledPaperCard className="p-6" glowColor="emerald">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 text-[#3d2817]/60 uppercase tracking-widest text-xs font-medium">ID</th>
                        <th className="text-left py-4 px-4 text-[#3d2817]/60 uppercase tracking-widest text-xs font-medium">Date</th>
                        <th className="text-left py-4 px-4 text-[#3d2817]/60 uppercase tracking-widest text-xs font-medium">Type</th>
                        <th className="text-left py-4 px-4 text-[#3d2817]/60 uppercase tracking-widest text-xs font-medium">Weight</th>
                        <th className="text-left py-4 px-4 text-[#3d2817]/60 uppercase tracking-widest text-xs font-medium">Amount</th>
                        <th className="text-left py-4 px-4 text-[#3d2817]/60 uppercase tracking-widest text-xs font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedPickups.map((pickup, index) => (
                        <tr key={pickup.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-[#3d2817]">#{pickup.id}</td>
                          <td className="py-4 px-4 text-[#3d2817]/80">{pickup.date}</td>
                          <td className="py-4 px-4 text-[#3d2817]/80">{pickup.wasteType}</td>
                          <td className="py-4 px-4 text-[#3d2817]/80">{pickup.weight}</td>
                          <td className="py-4 px-4 text-[#3d2817]/80">{pickup.actualValue || pickup.estimatedValue}</td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(pickup.status)}>
                              {pickup.statusLabel}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </RecycledPaperCard>
              ) : (
                <RecycledPaperCard className="p-12 text-center">
                  <div className="text-[#3d2817]/60">No completed pickups</div>
                </RecycledPaperCard>
              )}
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
      <RecycledPaperCard className="p-6" glowColor="emerald">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <StatusIcon className="w-6 h-6 text-emerald-400" strokeWidth={2} />
            </div>
            <div>
              <div className="text-xl text-[#3d2817]">#{pickup.id}</div>
              <div className="text-sm text-[#3d2817]/60">{pickup.date}</div>
            </div>
          </div>
          <Badge className={getStatusColor(pickup.status)}>
            {pickup.statusLabel}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-[#3d2817]/40 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-sm text-[#3d2817]/60">Waste Details</div>
                <div className="text-[#3d2817]">{pickup.wasteType} • {pickup.weight}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#3d2817]/40 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-sm text-[#3d2817]/60">Pickup Address</div>
                <div className="text-[#3d2817]">{pickup.address}</div>
              </div>
            </div>
            {pickup.agent && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#3d2817]/40 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-sm text-[#3d2817]/60">Agent</div>
                  <div className="text-[#3d2817]">{pickup.agent}</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {pickup.timeline.map((step: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  step.completed
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-white/20 bg-white/5'
                )}>
                  {step.completed && <CheckCircle className="w-4 h-4 text-[#3d2817]" strokeWidth={2} />}
                </div>
                <div className={idx < pickup.timeline.length - 1 ? 'border-l-2 border-white/10 pl-4 pb-4' : 'pl-4'}>
                  <div className={cn(
                    step.active ? 'text-emerald-400' : step.completed ? 'text-[#3d2817]' : 'text-[#3d2817]/40'
                  )}>
                    {step.label}
                  </div>
                  <div className="text-sm text-[#3d2817]/60">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <div className="text-sm text-[#3d2817]/60">
              {pickup.actualValue ? 'Donation Amount' : 'Estimated Value'}
            </div>
            <div className="text-2xl text-[#3d2817]">
              {pickup.actualValue || pickup.estimatedValue}
            </div>
            <div className="text-sm text-[#3d2817]/60">to {pickup.ngo}</div>
          </div>
          {pickup.hasReceipt && (
            <Button variant="outline">
              <FileText className="w-5 h-5 mr-2" strokeWidth={2} />
              Download Receipt
            </Button>
          )}
        </div>
      </RecycledPaperCard>
    </motion.div>
  );
}
