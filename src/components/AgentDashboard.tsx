import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin, User, Calendar, CheckCircle, Navigation, Camera, Save } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AgentNavbar } from './AgentNavbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiClient } from '../utils/apiClient';
import { cn } from './ui/utils';

interface AgentDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AgentDashboard({ onNavigate, onLogout }: AgentDashboardProps) {
  const [selectedPickup, setSelectedPickup] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState({
    actualWeight: '',
    wasteCondition: '',
    notes: '',
  });
  const [pickups, setPickups] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({
    assigned: 0,
    completed: 0,
    totalWeight: '0 kg',
    totalDonations: '₹0',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchPickups = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const agentId = user.id;
      
      const response = await apiClient.getAgentPickups(agentId);
      const pickupsData = (response as any)?.pickups || (Array.isArray(response) ? response : []);
      
      const transformedPickups = pickupsData.map((p: any) => ({
        id: p._id || p.id,
        _id: p._id,
        bookingId: p.bookingId,
        status: p.status === 'Completed' ? 'collected' : 
                p.status === 'Assigned' || p.status === 'New' ? 'assigned' : 
                p.status === 'In Progress' ? 'on-the-way' : 'new',
        customerName: p.customerName || 'Unknown',
        address: p.address || 'N/A',
        wasteType: p.wasteType || 'Mixed',
        estimatedWeight: p.wasteType?.split(' - ')[1] || '0 kg',
        scheduledDate: p.date || new Date().toLocaleDateString(),
        scheduledTime: p.time || 'N/A',
        ngo: p.ngoPartner || 'N/A',
        canAccept: p.canAccept || false,
        isAssigned: p.isAssigned || false,
      }));
      
      const dashboardData = await apiClient.getAgentDashboard(agentId);
      const stats = dashboardData as any;
      
      setPickups(transformedPickups);
      
      if (stats) {
        setTodayStats({
          assigned: stats.assignedCount || transformedPickups.filter((p: any) => p.status === 'assigned' || p.status === 'new').length,
          completed: stats.completedCount || 0,
          totalWeight: `${stats.totalWeight || 0} kg`,
          totalDonations: `₹${stats.totalDonations || 0}`,
        });
      } else {
        const assigned = transformedPickups.filter((p: any) => p.status === 'assigned' || p.status === 'new').length;
        const completed = transformedPickups.filter((p: any) => p.status === 'collected').length;
        setTodayStats({ assigned, completed, totalWeight: '0 kg', totalDonations: '₹0' });
      }
    } catch (error: any) {
      console.error('Failed to fetch pickups:', error);
      setPickups([]);
      setTodayStats({ assigned: 0, completed: 0, totalWeight: '0 kg', totalDonations: '₹0' });
    }
  };

  useEffect(() => {
    fetchPickups();
    const interval = setInterval(fetchPickups, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartPickup = async (pickupId: string) => {
    try {
      const pickup = pickups.find(p => p.id === pickupId || p._id === pickupId);
      if (!pickup) {
        alert('Pickup not found');
        return;
      }

      if (!pickup.isAssigned && pickup.canAccept) {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const agentId = user.id;
        const bookingId = pickup._id || pickup.id;
        
        try {
          await apiClient.request(`/agents/${agentId}/accept-booking/${bookingId}`, { method: 'POST' });
          alert('Booking accepted! You can now start the pickup.');
          await fetchPickups();
        } catch (error: any) {
          alert(`Failed to accept booking: ${error.message || 'Unknown error'}`);
          return;
        }
      }
      
      setSelectedPickup(pickupId);
    } catch (error: any) {
      alert(`Failed to start pickup: ${error.message || 'Unknown error'}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only images (JPG, PNG, GIF) and PDF files are allowed.');
      return;
    }

    setSelectedFile(file);
    setUploadedFileUrl(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedPickup) return;

    setIsUploading(true);

    try {
      const pickup = pickups.find(p => p.id === selectedPickup || p.bookingId === selectedPickup);
      if (!pickup) {
        alert('Pickup not found');
        setIsUploading(false);
        return;
      }

      const bookingId = pickup._id || pickup.id || selectedPickup;
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/agents/pickups/${bookingId}/upload-evidence`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload file');
      }

      const result = await response.json();
      setUploadedFileUrl(result.data.fileUrl);
      alert('File uploaded successfully!');
    } catch (error: any) {
      alert(`Failed to upload file: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompletePickup = async () => {
    if (!selectedPickup) return;
    
    if (!collectionData.actualWeight || !collectionData.wasteCondition) {
      alert('Please fill in all required fields (Actual Weight and Waste Condition)');
      return;
    }

    const weight = parseFloat(collectionData.actualWeight);
    if (isNaN(weight) || weight <= 0) {
      alert('Please enter a valid weight greater than 0');
      return;
    }

    const pickup = pickups.find(p => p.id === selectedPickup || p.bookingId === selectedPickup);
    if (!pickup) {
      alert('Pickup not found');
      return;
    }

    const pickupId = pickup._id || pickup.id || selectedPickup;
    
    if (!pickupId || !collectionData.wasteCondition) {
      alert('Please select waste condition');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.completePickup(pickupId, {
        pickupId: pickupId,
        actualWeight: weight,
        wasteCondition: collectionData.wasteCondition,
        notes: collectionData.notes || '',
        photoUrls: uploadedFileUrl ? [uploadedFileUrl] : [],
      });

      alert('✅ Pickup completed successfully! Stats updated.');
      
      setSelectedPickup(null);
      setCollectionData({ actualWeight: '', wasteCondition: '', notes: '' });
      setSelectedFile(null);
      setUploadedFileUrl(null);
      
      await fetchPickups();
      setTimeout(() => { fetchPickups(); }, 1000);
    } catch (error: any) {
      alert(`Failed to complete pickup: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'on-the-way':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'collected':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-white/10 text-white/60 border-white/10';
    }
  };

  return (
      <div className="min-h-screen">
        <AgentNavbar onNavigate={onNavigate} onLogout={onLogout} />
        
        <div className="md:ml-64 container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl text-white mb-2">Agent Dashboard</h1>
          <p className="text-xl text-white/60 mb-8">Manage your assigned pickups</p>

          {/* Today's Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Assigned', value: todayStats.assigned },
              { label: 'Completed', value: todayStats.completed },
              { label: 'Total Weight', value: todayStats.totalWeight },
              { label: 'Donations', value: todayStats.totalDonations },
            ].map((stat, idx) => (
              <RecycledPaperCard key={idx} className="p-4" glowColor="emerald">
                <div className="text-sm text-[#3d2817]/70 mb-1 uppercase tracking-wide">{stat.label}</div>
                <div className="text-2xl text-[#2c1810] font-bold">{stat.value}</div>
              </RecycledPaperCard>
            ))}
          </div>

          {selectedPickup ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <RecycledPaperCard className="p-8" glowColor="emerald">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-[#2c1810] font-bold">Complete Pickup #{selectedPickup}</h2>
                  <Button onClick={() => {
                    setSelectedPickup(null);
                    setCollectionData({ actualWeight: '', wasteCondition: '', notes: '' });
                    setSelectedFile(null);
                    setUploadedFileUrl(null);
                  }} variant="outline">
                    Cancel
                  </Button>
                </div>

                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[#3d2817]/70 mb-1">Customer</div>
                      <div className="text-[#2c1810] font-semibold">
                        {pickups.find(p => p.id === selectedPickup)?.customerName}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-[#3d2817]/70 mb-1">Address</div>
                      <div className="text-[#2c1810] font-semibold">
                        {pickups.find(p => p.id === selectedPickup)?.address}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="actualWeight" className="text-[#2c1810] uppercase tracking-wide mb-4 block font-semibold">Actual Weight Collected (kg)</Label>
                    <Input
                      id="actualWeight"
                      type="number"
                      placeholder="Enter actual weight"
                      value={collectionData.actualWeight}
                      onChange={(e) => setCollectionData({ ...collectionData, actualWeight: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="wasteCondition" className="text-[#2c1810] uppercase tracking-wide mb-4 block font-semibold">Waste Condition *</Label>
                    <Select value={collectionData.wasteCondition} onValueChange={(value) => setCollectionData({ ...collectionData, wasteCondition: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXCELLENT">Excellent (Clean & Dry)</SelectItem>
                        <SelectItem value="GOOD">Good (Minor Issues)</SelectItem>
                        <SelectItem value="FAIR">Fair (Needs Processing)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-[#2c1810] uppercase tracking-wide mb-4 block font-semibold">Additional Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Any special observations..."
                      value={collectionData.notes}
                      onChange={(e) => setCollectionData({ ...collectionData, notes: e.target.value })}
                    />
                  </div>

                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                    <Camera className="w-12 h-12 text-[#3d2817]/50 mx-auto mb-3" strokeWidth={2} />
                    <div className="text-[#2c1810] mb-2 font-semibold">Upload Photo/Evidence (Optional)</div>
                    <input type="file" id="file-upload" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
                    <label htmlFor="file-upload">
                      <Button variant="outline" type="button" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-white/5 rounded-xl">
                        <p className="text-sm text-[#2c1810]">
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </p>
                        {!uploadedFileUrl && (
                          <Button type="button" onClick={handleFileUpload} disabled={isUploading} variant="emerald" size="sm" className="mt-2">
                            {isUploading ? 'Uploading...' : 'Upload File'}
                          </Button>
                        )}
                        {uploadedFileUrl && (
                          <p className="text-sm text-emerald-400 mt-2">✓ File uploaded successfully</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-[#3d2817]/60 mt-2">Accepted: JPG, PNG, GIF, PDF (Max 5MB)</p>
                  </div>

                  <Button
                    onClick={handleCompletePickup}
                    disabled={!collectionData.actualWeight || !collectionData.wasteCondition || isSubmitting}
                    variant="emerald"
                    size="lg"
                    className="w-full"
                  >
                    <Save className="w-5 h-5 mr-2" strokeWidth={2} />
                    {isSubmitting ? 'Completing...' : 'Complete Pickup'}
                  </Button>
                </div>
              </RecycledPaperCard>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {pickups.length === 0 ? (
                <RecycledPaperCard className="p-12 text-center" glowColor="emerald">
                  <Package className="w-16 h-16 text-[#3d2817]/50 mx-auto mb-4" strokeWidth={1} />
                  <h3 className="text-xl text-[#2c1810] mb-2 font-bold">No Pickups Available</h3>
                  <p className="text-[#3d2817]/70 mb-4">
                    There are no pending or assigned pickups at the moment.
                  </p>
                  <p className="text-sm text-[#3d2817]/60">
                    New bookings from users will appear here automatically.
                  </p>
                  <Button onClick={fetchPickups} variant="outline" className="mt-4">
                    Refresh
                  </Button>
                </RecycledPaperCard>
              ) : (
                pickups.map((pickup, index) => (
                  <motion.div key={pickup.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                    <RecycledPaperCard className="p-6" glowColor="emerald">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                          </div>
                          <div>
                            <div className="text-xl text-[#2c1810] font-semibold">#{pickup.id}</div>
                            <div className="text-sm text-[#3d2817]/70">
                              {pickup.scheduledDate} • {pickup.scheduledTime}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(pickup.status)}>
                          {pickup.status === 'assigned' && 'New'}
                          {pickup.status === 'on-the-way' && 'On the Way'}
                          {pickup.status === 'collected' && 'Collected'}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-[#3d2817]/50 mt-0.5" strokeWidth={2} />
                          <div>
                            <div className="text-sm text-[#3d2817]/70">Customer</div>
                            <div className="text-[#2c1810] font-semibold">{pickup.customerName}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 md:col-span-2">
                          <MapPin className="w-5 h-5 text-[#3d2817]/50 mt-0.5" strokeWidth={2} />
                          <div>
                            <div className="text-sm text-[#3d2817]/70">Address</div>
                            <div className="text-[#2c1810] font-semibold">{pickup.address}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Package className="w-5 h-5 text-[#3d2817]/50 mt-0.5" strokeWidth={2} />
                          <div>
                            <div className="text-sm text-[#3d2817]/70">Waste Details</div>
                            <div className="text-[#2c1810] font-semibold">{pickup.wasteType} • {pickup.estimatedWeight}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-[#3d2817]/50 mt-0.5" strokeWidth={2} />
                          <div>
                            <div className="text-sm text-[#3d2817]/70">NGO Partner</div>
                            <div className="text-[#2c1810] font-semibold">{pickup.ngo}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {pickup.status === 'assigned' && (
                          <>
                            <Button variant="outline" className="flex-1">
                              <Navigation className="w-4 h-4 mr-2" strokeWidth={2} />
                              Get Directions
                            </Button>
                            <Button onClick={() => handleStartPickup(pickup.id)} variant="emerald" className="flex-1">
                              Start Pickup
                            </Button>
                          </>
                        )}
                        {pickup.status === 'on-the-way' && (
                          <Button onClick={() => handleStartPickup(pickup.id)} variant="emerald" className="w-full">
                            <CheckCircle className="w-4 h-4 mr-2" strokeWidth={2} />
                            Mark as Collected
                          </Button>
                        )}
                      </div>
                    </RecycledPaperCard>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
  );
}
