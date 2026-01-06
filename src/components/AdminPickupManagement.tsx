import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, User, MapPin, Calendar, Search, Filter } from 'lucide-react';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { AdminNavbar } from './AdminNavbar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from './ui/utils';

interface AdminPickupManagementProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminPickupManagement({ onNavigate, onLogout }: AdminPickupManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPickup, setSelectedPickup] = useState<string | null>(null);

  const pickups = [
    { id: 'PK1007', userName: 'Priya Sharma', phone: '+91 98765 43210', address: '123, Green Street, Sector 42, Mumbai', wasteType: 'Plastic', weight: '6 kg', date: '2025-12-04', time: '2:00 PM - 5:00 PM', status: 'pending', statusLabel: 'Processing', agent: null, ngo: 'Green Earth Foundation' },
    { id: 'PK1006', userName: 'Rajesh Kumar', phone: '+91 98765 43211', address: '456, Blue Avenue, Sector 43, Mumbai', wasteType: 'Paper', weight: '10 kg', date: '2025-12-04', time: '2:00 PM - 5:00 PM', status: 'assigned', statusLabel: 'Processing', agent: 'Ramesh Kumar', ngo: 'Hope for Children' },
    { id: 'PK1005', userName: 'Anjali Patel', phone: '+91 98765 43212', address: '789, Yellow Road, Sector 44, Mumbai', wasteType: 'Metal', weight: '8 kg', date: '2025-12-04', time: '10:00 AM - 1:00 PM', status: 'on-the-way', statusLabel: 'Processing', agent: 'Suresh Rao', ngo: 'Clean India Initiative' },
    { id: 'PK1004', userName: 'Vikram Singh', phone: '+91 98765 43213', address: '321, Red Street, Sector 45, Mumbai', wasteType: 'E-waste', weight: '5 kg', date: '2025-12-03', time: '9:00 AM - 12:00 PM', status: 'collected', statusLabel: 'Processing', agent: 'Amit Patel', ngo: 'Animal Welfare Trust', actualWeight: '5.2 kg', donationAmount: '₹420' },
    { id: 'PK1003', userName: 'Neha Gupta', phone: '+91 98765 43214', address: '654, Pink Lane, Sector 46, Mumbai', wasteType: 'Glass', weight: '4 kg', date: '2025-12-03', time: '3:00 PM - 6:00 PM', status: 'donated', statusLabel: 'Verified', agent: 'Ramesh Kumar', ngo: 'Green Earth Foundation', actualWeight: '4.5 kg', donationAmount: '₹180' },
  ];

  const agents = [
    { id: 'A001', name: 'Ramesh Kumar' },
    { id: 'A002', name: 'Suresh Rao' },
    { id: 'A003', name: 'Amit Patel' },
    { id: 'A004', name: 'Deepak Verma' },
    { id: 'A005', name: 'Arun Mehta' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'donated') {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  };

  const handleAssignAgent = (pickupId: string, agentId: string) => {
    alert(`Assigned agent to pickup ${pickupId}`);
  };

  const filteredPickups = pickups.filter(pickup => {
    const matchesSearch = pickup.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pickup.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pickup.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
      <div className="min-h-screen">
        <AdminNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="admin-pickups" />
        
        <div className="md:ml-64 container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl text-white mb-2">Pickup Management</h1>
          <p className="text-xl text-white/60 mb-8">Manage and assign pickup requests</p>

          {/* Filters */}
          <RecycledPaperCard className="p-4 mb-6" glowColor="emerald">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                <Input
                  placeholder="Search by ID or user name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="on-the-way">On the Way</SelectItem>
                    <SelectItem value="collected">Collected</SelectItem>
                    <SelectItem value="donated">Donated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </RecycledPaperCard>

          {/* Pickups Table */}
          <RecycledPaperCard className="overflow-hidden" glowColor="emerald">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/60 uppercase tracking-widest text-xs">Pickup ID</TableHead>
                    <TableHead className="text-white/60 uppercase tracking-widest text-xs">User</TableHead>
                    <TableHead className="text-white/60 uppercase tracking-widest text-xs">Waste Details</TableHead>
                    <TableHead className="text-white/60 uppercase tracking-widest text-xs">Date & Time</TableHead>
                    <TableHead className="text-white/60 uppercase tracking-widest text-xs">Status</TableHead>
                    <TableHead className="text-white/60 uppercase tracking-widest text-xs">Agent</TableHead>
                    <TableHead className="text-white/60 uppercase tracking-widest text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPickups.map((pickup, index) => (
                    <motion.tr
                      key={pickup.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-white/40" strokeWidth={2} />
                          <span>#{pickup.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div>
                          <div className="text-white">{pickup.userName}</div>
                          <div className="text-sm text-white/60">{pickup.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div>
                          <div className="text-white">{pickup.wasteType}</div>
                          <div className="text-sm text-white/60">{pickup.weight}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div>
                          <div className="text-white">{pickup.date}</div>
                          <div className="text-sm text-white/60">{pickup.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pickup.status)}>
                          {pickup.statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {pickup.status === 'pending' ? (
                          <Select onValueChange={(value) => handleAssignAgent(pickup.id, value)}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Assign agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {agents.map((agent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="text-white">{pickup.agent}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPickup(pickup.id)}>
                          View Details
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </RecycledPaperCard>

          {/* Details Modal */}
          {selectedPickup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <RecycledPaperCard className="w-full max-w-2xl p-6" glowColor="emerald">
                <h2 className="text-2xl text-white mb-6">Pickup Details #{selectedPickup}</h2>
                {pickups.filter(p => p.id === selectedPickup).map(pickup => (
                  <div key={pickup.id} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-white/60 mb-1">User Name</div>
                        <div className="text-white">{pickup.userName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Phone</div>
                        <div className="text-white">{pickup.phone}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-white/60 mb-1">Address</div>
                        <div className="text-white">{pickup.address}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Waste Type</div>
                        <div className="text-white">{pickup.wasteType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Weight</div>
                        <div className="text-white">{pickup.weight}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">NGO Partner</div>
                        <div className="text-white">{pickup.ngo}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Status</div>
                        <Badge className={getStatusColor(pickup.status)}>{pickup.statusLabel}</Badge>
                      </div>
                      {pickup.agent && (
                        <div>
                          <div className="text-sm text-white/60 mb-1">Assigned Agent</div>
                          <div className="text-white">{pickup.agent}</div>
                        </div>
                      )}
                      {pickup.actualWeight && (
                        <div>
                          <div className="text-sm text-white/60 mb-1">Actual Weight</div>
                          <div className="text-white">{pickup.actualWeight}</div>
                        </div>
                      )}
                      {pickup.donationAmount && (
                        <div>
                          <div className="text-sm text-white/60 mb-1">Donation Amount</div>
                          <div className="text-white">{pickup.donationAmount}</div>
                        </div>
                      )}
                    </div>
                    <Button onClick={() => setSelectedPickup(null)} variant="emerald" className="w-full">
                      Close
                    </Button>
                  </div>
                ))}
              </RecycledPaperCard>
            </div>
          )}
        </div>
      </div>
  );
}
