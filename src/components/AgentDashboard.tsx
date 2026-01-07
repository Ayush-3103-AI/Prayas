import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin, User, Calendar, CheckCircle, Navigation, Camera, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AgentNavbar } from './AgentNavbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiClient } from '../utils/apiClient';

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
      if (!userStr) {
        console.error('No user found in localStorage');
        return;
      }
      
      const user = JSON.parse(userStr);
      const agentId = user.id;
      
      console.log('Fetching pickups for agent:', agentId);
      
      // Fetch pickups data - API returns { pickups: [...] }
      const response = await apiClient.getAgentPickups(agentId);
      console.log('Pickups response:', response);
      
      // Extract pickups array from response
      const pickupsData = (response as any)?.pickups || (Array.isArray(response) ? response : []);
      console.log('Pickups data:', pickupsData);
      
      if (pickupsData.length === 0) {
        console.log('No pickups found. This could mean:');
        console.log('1. No bookings have been created yet');
        console.log('2. All bookings are assigned to other agents');
        console.log('3. Backend query is not returning pending bookings');
      }
      
      // Transform pickups from Booking model structure
      const transformedPickups = pickupsData.map((p: any) => ({
        id: p._id || p.id, // Use MongoDB _id as the primary ID
        _id: p._id, // Keep _id for API calls
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
      
      // Also fetch dashboard stats
      const dashboardData = await apiClient.getAgentDashboard(agentId);
      console.log('Dashboard data:', dashboardData);
      
      setPickups(transformedPickups);
      
      // Update stats from dashboard data - handle nested data structure
      const stats = dashboardData as any;
      if (stats) {
        setTodayStats({
          assigned: stats.assignedCount || transformedPickups.filter((p: any) => p.status === 'assigned' || p.status === 'new').length,
          completed: stats.completedCount || 0,
          totalWeight: `${stats.totalWeight || 0} kg`,
          totalDonations: `₹${stats.totalDonations || 0}`,
        });
      } else {
        // Calculate stats from pickups if dashboard data not available
        const assigned = transformedPickups.filter((p: any) => p.status === 'assigned' || p.status === 'new').length;
        const completed = transformedPickups.filter((p: any) => p.status === 'collected').length;
        setTodayStats({
          assigned,
          completed,
          totalWeight: '0 kg',
          totalDonations: '₹0',
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch pickups:', error);
      console.error('Error details:', {
        message: error.message,
        agentId: user?.id,
        user: user,
      });
      
      // Don't show mock data - show empty state instead
      setPickups([]);
      setTodayStats({
        assigned: 0,
        completed: 0,
        totalWeight: '0 kg',
        totalDonations: '₹0',
      });
      
      // Show error message to user
      alert(`Failed to load pickups: ${error.message || 'Unknown error'}. Please check console for details.`);
    }
  };

  useEffect(() => {
    fetchPickups();
    // Refresh every 3 seconds for real-time synchronization across all dashboards
    // This ensures agent sees new pickups immediately and updates are reflected
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

      // If not assigned, accept the booking first
      if (!pickup.isAssigned && pickup.canAccept) {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const agentId = user.id;
        const bookingId = pickup._id || pickup.id;
        
        try {
          await apiClient.request(`/agents/${agentId}/accept-booking/${bookingId}`, {
            method: 'POST',
          });
          alert('Booking accepted! You can now start the pickup.');
          await fetchPickups(); // Refresh to get updated status
        } catch (error: any) {
          console.error('Failed to accept booking:', error);
          alert(`Failed to accept booking: ${error.message || 'Unknown error'}`);
          return;
        }
      }
      
      setSelectedPickup(pickupId);
    } catch (error: any) {
      console.error('Failed to start pickup:', error);
      alert(`Failed to start pickup: ${error.message || 'Unknown error'}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
      console.error('Failed to upload file:', error);
      alert(`Failed to upload file: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompletePickup = async () => {
    if (!selectedPickup) return;
    
    // Safety check: Validate required fields
    if (!collectionData.actualWeight || !collectionData.wasteCondition) {
      alert('Please fill in all required fields (Actual Weight and Waste Condition)');
      return;
    }

    // Validate weight is a positive number
    const weight = parseFloat(collectionData.actualWeight);
    if (isNaN(weight) || weight <= 0) {
      alert('Please enter a valid weight greater than 0');
      return;
    }

    // Get the pickup to find booking ID
    const pickup = pickups.find(p => p.id === selectedPickup || p.bookingId === selectedPickup);
    if (!pickup) {
      alert('Pickup not found');
      return;
    }

    // Use the _id from the database (MongoDB ObjectId)
    const pickupId = pickup._id || pickup.id || selectedPickup;
    
    // Safety check: Ensure pickupId exists before submitting
    if (!pickupId || !collectionData.wasteCondition) {
      alert('Please select waste condition');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Completing pickup with ID:', pickupId, 'Pickup data:', pickup);

      // Complete the pickup using the correct endpoint
      // Always send pickupId in the payload
      const result = await apiClient.completePickup(pickupId, {
        pickupId: pickupId, // Always include pickupId
        actualWeight: weight,
        wasteCondition: collectionData.wasteCondition, // Now sends EXCELLENT, GOOD, or FAIR
        notes: collectionData.notes || '',
        photoUrls: uploadedFileUrl ? [uploadedFileUrl] : [],
      });

      console.log('Pickup completion result:', result);
      
      // Show success message with toast notification
      alert('✅ Pickup completed successfully! Stats updated.');
      
      // Reset form immediately
      setSelectedPickup(null);
      setCollectionData({ actualWeight: '', wasteCondition: '', notes: '' });
      setSelectedFile(null);
      setUploadedFileUrl(null);
      
      // Refresh data immediately to show updated stats
      await fetchPickups();
      
      // Force a second refresh after 1 second to ensure all dashboards sync
      setTimeout(() => {
        fetchPickups();
      }, 1000);
    } catch (error: any) {
      console.error('Failed to complete pickup:', error);
      alert(`Failed to complete pickup: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-700';
      case 'on-the-way':
        return 'bg-purple-100 text-purple-700';
      case 'collected':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AgentNavbar onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-gray-900 mb-2">Agent Dashboard</h1>
        <p className="text-xl text-gray-600 mb-8">Manage your assigned pickups</p>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Assigned</div>
            <div className="text-2xl text-gray-900">{todayStats.assigned}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl text-gray-900">{todayStats.completed}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Weight</div>
            <div className="text-2xl text-gray-900">{todayStats.totalWeight}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Donations</div>
            <div className="text-2xl text-gray-900">{todayStats.totalDonations}</div>
          </Card>
        </div>

        {selectedPickup ? (
          // Collection Form
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Complete Pickup #{selectedPickup}</h2>
                <Button 
                  onClick={() => {
                    setSelectedPickup(null);
                    setCollectionData({ actualWeight: '', wasteCondition: '', notes: '' });
                    setSelectedFile(null);
                    setUploadedFileUrl(null);
                  }} 
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>

              {/* Customer Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Customer</div>
                    <div className="text-gray-900">
                      {pickups.find(p => p.id === selectedPickup)?.customerName}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-600 mb-1">Address</div>
                    <div className="text-gray-900">
                      {pickups.find(p => p.id === selectedPickup)?.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collection Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="actualWeight">Actual Weight Collected (kg)</Label>
                  <Input
                    id="actualWeight"
                    type="number"
                    placeholder="Enter actual weight"
                    value={collectionData.actualWeight}
                    onChange={(e) => setCollectionData({ ...collectionData, actualWeight: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="wasteCondition">Waste Condition *</Label>
                  <Select
                    value={collectionData.wasteCondition}
                    onValueChange={(value) => setCollectionData({ ...collectionData, wasteCondition: value })}
                  >
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
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Any special observations..."
                    value={collectionData.notes}
                    onChange={(e) => setCollectionData({ ...collectionData, notes: e.target.value })}
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <div className="text-gray-600 mb-2">Upload Photo/Evidence (Optional)</div>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" type="button" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </p>
                      {!uploadedFileUrl && (
                        <Button
                          type="button"
                          onClick={handleFileUpload}
                          disabled={isUploading}
                          className="mt-2 bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          {isUploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                      )}
                      {uploadedFileUrl && (
                        <p className="text-sm text-green-600 mt-2">✓ File uploaded successfully</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Accepted: JPG, PNG, GIF, PDF (Max 5MB)</p>
                </div>

                <Button
                  onClick={handleCompletePickup}
                  disabled={!collectionData.actualWeight || !collectionData.wasteCondition || isSubmitting}
                  className="w-full bg-[#3BAF69] hover:bg-[#2d9355] disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Completing...' : 'Complete Pickup'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          // Pickup List
          <div className="space-y-4">
            {pickups.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">No Pickups Available</h3>
                <p className="text-gray-600 mb-4">
                  There are no pending or assigned pickups at the moment.
                </p>
                <p className="text-sm text-gray-500">
                  New bookings from users will appear here automatically.
                </p>
                <Button
                  onClick={fetchPickups}
                  variant="outline"
                  className="mt-4"
                >
                  Refresh
                </Button>
              </Card>
            ) : (
              pickups.map((pickup, index) => (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#3BAF69]" />
                      </div>
                      <div>
                        <div className="text-xl text-gray-900">#{pickup.id}</div>
                        <div className="text-sm text-gray-600">
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
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Customer</div>
                        <div className="text-gray-900">{pickup.customerName}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Address</div>
                        <div className="text-gray-900">{pickup.address}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">Waste Details</div>
                        <div className="text-gray-900">{pickup.wasteType} • {pickup.estimatedWeight}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">NGO Partner</div>
                        <div className="text-gray-900">{pickup.ngo}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {pickup.status === 'assigned' && (
                      <>
                        <Button variant="outline" className="flex-1">
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                        <Button
                          onClick={() => handleStartPickup(pickup.id)}
                          className="flex-1 bg-[#3BAF69] hover:bg-[#2d9355]"
                        >
                          Start Pickup
                        </Button>
                      </>
                    )}
                    {pickup.status === 'on-the-way' && (
                      <Button
                        onClick={() => handleStartPickup(pickup.id)}
                        className="w-full bg-[#3BAF69] hover:bg-[#2d9355]"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Collected
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
