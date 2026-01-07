import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight, MapPin, Calendar, Package, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { UserNavbar } from './UserNavbar';
import { apiClient } from '../utils/apiClient';

interface BookPickupPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function BookPickupPage({ onNavigate, onLogout }: BookPickupPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    wasteType: '',
    weight: '',
    date: '',
    time: '',
    ngo: '',
    notes: '',
  });
  const [addressLoaded, setAddressLoaded] = useState(false);

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', icon: '♻️' },
    { value: 'paper', label: 'Paper', icon: '📄' },
    { value: 'metal', label: 'Metal', icon: '🔧' },
    { value: 'e-waste', label: 'E-Waste', icon: '💻' },
    { value: 'glass', label: 'Glass', icon: '🫙' },
  ];

  const [ngos, setNGOs] = useState<Array<{ value: string; label: string; focus: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id) {
            const userData: any = await apiClient.getUser(user.id);
            if (userData?.user?.address) {
              setFormData(prev => ({ ...prev, address: userData.user.address }));
              setAddressLoaded(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user address:', error);
        setAddressLoaded(true);
      }
    };

    fetchUserAddress();
  }, []);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const data = await apiClient.getNGOs();
        console.log('NGO API Response:', data);
        
        // Handle different response formats
        let ngoArray: any[] = [];
        if (Array.isArray(data)) {
          ngoArray = data;
        } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
          ngoArray = (data as any).data;
        } else if (data && typeof data === 'object' && 'ngos' in data && Array.isArray((data as any).ngos)) {
          ngoArray = (data as any).ngos;
        }
        
        if (ngoArray && ngoArray.length > 0) {
          const transformedNGOs = ngoArray.map((ngo: any) => ({
            value: ngo._id || ngo.id || ngo.value,
            label: ngo.name || ngo.label,
            focus: ngo.category || ngo.focus || 'Community Welfare',
          }));
          setNGOs(transformedNGOs);
          setError(null); // Clear any previous errors
          console.log('✅ Loaded', transformedNGOs.length, 'NGOs from backend');
        } else {
          throw new Error('No NGOs found in database. Please seed the database.');
        }
      } catch (error: any) {
        console.error('Failed to fetch NGOs:', error);
        const errorMessage = error.message || 'Unknown error';
        console.warn('Using fallback NGOs. To fix:');
        console.warn('1) Ensure backend is running on http://localhost:5000');
        console.warn('2) Seed NGOs: cd backend && node seed.js');
        console.warn('3) Check backend logs for errors');
        
        // Fallback to mock data if API fails
        setNGOs([
          { value: 'fallback1', label: 'Green Earth Foundation', focus: 'Environmental Conservation' },
          { value: 'fallback2', label: 'Hope for Children', focus: 'Child Education' },
          { value: 'fallback3', label: 'Clean India Initiative', focus: 'Waste Management' },
          { value: 'fallback4', label: 'Animal Welfare Trust', focus: 'Animal Care' },
        ]);
        setError(`⚠️ Backend connection failed: ${errorMessage}. Using demo NGOs. Please ensure backend is running and NGOs are seeded.`);
      }
    };
    fetchNGOs();
  }, []);

  const handleSubmit = async () => {
    if (!formData.ngo) {
      alert('Please select an NGO');
      return;
    }

    if (!formData.address || !formData.wasteType || !formData.weight || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.weight) <= 0) {
      alert('Weight must be greater than 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format date - ensure it's a valid date
      const pickupDate = new Date(formData.date);
      if (isNaN(pickupDate.getTime())) {
        throw new Error('Invalid date selected');
      }

      // Map waste type to backend format
      const wasteTypeMap: { [key: string]: string } = {
        'plastic': 'Plastic',
        'paper': 'Paper',
        'metal': 'Metal',
        'e-waste': 'E-Waste',
        'glass': 'Glass',
      };
      const wasteType = wasteTypeMap[formData.wasteType.toLowerCase()] || formData.wasteType;

      // Map time to backend format
      const timeMap: { [key: string]: string } = {
        '9-12': '9:00 AM - 12:00 PM',
        '12-3': '12:00 PM - 3:00 PM',
        '3-6': '3:00 PM - 6:00 PM',
        '9:00 AM - 12:00 PM': '9:00 AM - 12:00 PM',
        '12:00 PM - 3:00 PM': '12:00 PM - 3:00 PM',
        '3:00 PM - 6:00 PM': '3:00 PM - 6:00 PM',
      };
      const preferredTime = timeMap[formData.time] || formData.time;
      
      if (!timeMap[formData.time]) {
        throw new Error(`Invalid time slot: ${formData.time}`);
      }

      // Get NGO name
      const selectedNGO = ngos.find(n => n.value === formData.ngo);
      const ngoPartner = selectedNGO?.label || 'N/A';

      const bookingData = {
        address: formData.address,
        wasteType,
        weight: parseFloat(formData.weight),
        preferredDate: pickupDate.toISOString(),
        preferredTime,
        ngoPartner,
      };

      console.log('Submitting booking:', bookingData);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      console.log('Token check before booking:', token ? `Token exists (${token.substring(0, 20)}...)` : 'No token found');
      console.log('User check before booking:', userStr ? 'User found in localStorage' : 'No user found');
      
      if (!token || token === 'null' || token === 'undefined') {
        throw new Error('No authentication token. Please log in again.');
      }
      
      if (!userStr) {
        throw new Error('User session not found. Please log in again.');
      }
      
      // Validate token before making booking request
      try {
        await apiClient.verifyToken();
        console.log('✅ Token is valid');
      } catch (verifyError: any) {
        console.error('❌ Token validation failed:', verifyError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired. Please log in again.');
        onNavigate('login');
        setLoading(false);
        return;
      }
      
      try {
        const response: any = await apiClient.createBooking(bookingData);
        console.log('✅ Booking API response:', response);
        
        // Handle response structure: apiClient returns data.data, so response is { booking: {...} }
        // Backend returns: { success: true, data: { booking: {...} } }
        // apiClient extracts data.data, so response = { booking: {...} }
        const booking = response?.booking || response;
        
        if (!booking) {
          console.error('⚠️ No booking data in response:', response);
          throw new Error('Booking creation failed. No booking data received.');
        }
        
        // Store booking ID for confirmation page
        const bookingId = booking?.bookingId || booking?._id;
        if (!bookingId) {
          console.error('⚠️ Booking ID not found in response:', response);
          throw new Error('Booking created but booking ID not received. Please check your bookings.');
        }
        
        localStorage.setItem('lastBookingId', bookingId);
        console.log('✅ Booking created successfully:', bookingId);
        console.log('✅ Full booking data:', booking);
        
        // Store full booking data for confirmation page
        const bookingDataForStorage = {
          bookingId: bookingId,
          wasteType: booking.wasteType || wasteType,
          weight: booking.weight || parseFloat(formData.weight),
          preferredDate: booking.preferredDate || formData.date,
          preferredTime: booking.preferredTime || preferredTime,
          address: booking.address || formData.address,
          ngoPartner: booking.ngoPartner || ngos.find(n => n.value === formData.ngo)?.label,
          status: booking.status || 'Pending',
        };
        localStorage.setItem('lastBookingData', JSON.stringify(bookingDataForStorage));
        
        // Clear form data
        setFormData({
          address: '',
          wasteType: '',
          weight: '',
          date: '',
          time: '',
          ngo: '',
          notes: '',
        });
        setStep(1);
        
        // Navigate to confirmation page
        onNavigate('pickup-confirmation');
      } catch (apiError: any) {
        console.error('API call failed:', apiError);
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error: any) {
      console.error('Failed to book pickup:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      
      // Check if it's a token issue and redirect to login
      if (errorMessage.includes('token') || 
          errorMessage.includes('Access denied') || 
          errorMessage.includes('No authentication') || 
          errorMessage.includes('Session expired') ||
          errorMessage.includes('Invalid token') ||
          errorMessage.includes('Token expired')) {
        // Clear invalid session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired. Please log in again.');
        onNavigate('login');
      } else {
        alert(`Failed to book pickup: ${errorMessage}`);
      }
      return; // Exit early on error
    }
  };

  const steps = [
    { number: 1, label: 'Pickup Details' },
    { number: 2, label: 'Select NGO' },
    { number: 3, label: 'Confirm' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20 md:pb-8">
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="book-pickup" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl text-gray-900 mb-2">Book a Pickup</h1>
          <p className="text-xl text-gray-600 mb-8">Schedule your recyclable waste collection</p>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    step >= s.number
                      ? 'bg-[#3BAF69] border-[#3BAF69] text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step > s.number ? <Check className="w-6 h-6" /> : s.number}
                  </div>
                  <div className={`text-sm mt-2 ${step >= s.number ? 'text-[#3BAF69]' : 'text-gray-400'}`}>
                    {s.label}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-all ${
                    step > s.number ? 'bg-[#3BAF69]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Card className="p-8">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Pickup Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4" />
                    Type of Waste
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {wasteTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFormData({ ...formData, wasteType: type.value })}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          formData.wasteType === type.value
                            ? 'border-[#3BAF69] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm text-gray-900">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight">Expected Weight (approximate in kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      Preferred Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-12">9:00 AM - 12:00 PM</SelectItem>
                        <SelectItem value="12-3">12:00 PM - 3:00 PM</SelectItem>
                        <SelectItem value="3-6">3:00 PM - 6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (formData.wasteType && formData.weight && formData.date && formData.time) {
                      setStep(2);
                    } else {
                      alert('Please fill in all required fields');
                    }
                  }}
                  disabled={!formData.address || !formData.wasteType || !formData.weight || !formData.date || !formData.time || parseFloat(formData.weight) <= 0}
                  className="w-full bg-[#3BAF69] hover:bg-[#2d9355]"
                  type="button"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4" />
                    Select NGO for Donation
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    The value from your recyclables will be donated to your chosen NGO
                  </p>
                  <div className="space-y-3">
                    {ngos.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">Loading NGOs...</div>
                    ) : (
                      <>
                        {ngos.map((ngo) => (
                          <button
                            key={ngo.value}
                            onClick={() => {
                              setFormData({ ...formData, ngo: ngo.value });
                              setError(null); // Clear error when selecting NGO
                            }}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              formData.ngo === ngo.value
                                ? 'border-[#3BAF69] bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-gray-900 mb-1">{ngo.label}</div>
                            <div className="text-sm text-gray-600">{ngo.focus}</div>
                            {ngo.value.startsWith('fallback') && (
                              <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                                <span>⚠️</span>
                                <span>Demo NGO - Backend connection needed</span>
                              </div>
                            )}
                          </button>
                        ))}
                        {error && ngos.some(n => n.value.startsWith('fallback')) && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                            <div className="font-semibold mb-1">⚠️ Backend Connection Issue</div>
                            <div className="text-xs">{error}</div>
                            <div className="text-xs mt-2 font-medium">To fix this:</div>
                            <ul className="text-xs mt-1 ml-4 list-disc">
                              <li>Ensure backend server is running on http://localhost:5000</li>
                              <li>Run: <code className="bg-yellow-100 px-1 rounded">cd backend && node seed.js</code> to seed NGOs</li>
                              <li>Check browser console for detailed error messages</li>
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions for the pickup agent..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.ngo}
                    className="flex-1 bg-[#3BAF69] hover:bg-[#2d9355]"
                  >
                    Continue <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl text-gray-900">Confirm Your Booking</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Pickup Address</div>
                    <div className="text-gray-900">{formData.address}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Waste Type</div>
                      <div className="text-gray-900 capitalize">{formData.wasteType}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Weight</div>
                      <div className="text-gray-900">{formData.weight} kg</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Date</div>
                      <div className="text-gray-900">{formData.date}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Time</div>
                      <div className="text-gray-900">{formData.time}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">NGO Partner</div>
                    <div className="text-gray-900">
                      {ngos.find(n => n.value === formData.ngo)?.label}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-[#3BAF69] hover:bg-[#2d9355]"
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                  {error && (
                    <div className="text-red-600 text-sm mt-2">{error}</div>
                  )}
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
