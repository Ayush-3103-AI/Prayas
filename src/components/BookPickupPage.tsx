import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight, MapPin, Calendar, Package, Heart, Recycle } from 'lucide-react';
import { Button } from './ui/button';
import { RecycledPaperCard } from './ui/RecycledPaperCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { UserNavbar } from './UserNavbar';
import { apiClient } from '../utils/apiClient';
import { cn } from './ui/utils';

interface BookPickupPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function BookPickupPage({ onNavigate, onLogout }: BookPickupPageProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    wasteType: '',
    weight: '',
    date: '',
    time: '',
    ngo: '',
    notes: '',
  });
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', icon: Recycle, color: 'emerald' },
    { value: 'paper', label: 'Paper', icon: Package, color: 'blue' },
    { value: 'metal', label: 'Metal', icon: Package, color: 'gold' },
    { value: 'e-waste', label: 'E-Waste', icon: Package, color: 'emerald' },
  ];

  const [ngos, setNGOs] = useState<Array<{ value: string; label: string; focus: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate next 7 days for date selector
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id) {
            const userData = await apiClient.getUser(user.id);
            if (userData.user.address) {
              setFormData(prev => ({ ...prev, address: userData.user.address }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user address:', error);
      }
    };
    fetchUserAddress();
  }, []);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const data = await apiClient.getNGOs();
        if (data && data.length > 0) {
          const transformedNGOs = data.map((ngo: any) => ({
            value: ngo._id || ngo.id,
            label: ngo.name,
            focus: ngo.category || ngo.focus || 'Community Welfare',
          }));
          setNGOs(transformedNGOs);
        } else {
          setNGOs([
            { value: 'fallback1', label: 'Green Earth Foundation', focus: 'Environmental Conservation' },
            { value: 'fallback2', label: 'Hope for Children', focus: 'Child Education' },
            { value: 'fallback3', label: 'Clean India Initiative', focus: 'Waste Management' },
            { value: 'fallback4', label: 'Animal Welfare Trust', focus: 'Animal Care' },
          ]);
        }
      } catch (error: any) {
        setNGOs([
          { value: 'fallback1', label: 'Green Earth Foundation', focus: 'Environmental Conservation' },
          { value: 'fallback2', label: 'Hope for Children', focus: 'Child Education' },
          { value: 'fallback3', label: 'Clean India Initiative', focus: 'Waste Management' },
          { value: 'fallback4', label: 'Animal Welfare Trust', focus: 'Animal Care' },
        ]);
      }
    };
    fetchNGOs();
  }, []);

  const calculateCO2 = () => {
    const weight = parseFloat(formData.weight) || 0;
    return (weight * 2.5).toFixed(1);
  };

  const calculateDonation = () => {
    const weight = parseFloat(formData.weight) || 0;
    return (weight * 10).toLocaleString('en-IN');
  };

  const handleMaterialClick = (value: string) => {
    setSelectedMaterials(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
    if (!formData.wasteType) {
      setFormData(prev => ({ ...prev, wasteType: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.ngo || !formData.address || !formData.wasteType || !formData.weight || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pickupDate = new Date(formData.date);
      const wasteTypeMap: { [key: string]: string } = {
        'plastic': 'Plastic',
        'paper': 'Paper',
        'metal': 'Metal',
        'e-waste': 'E-Waste',
      };
      const wasteType = wasteTypeMap[formData.wasteType.toLowerCase()] || formData.wasteType;
      const timeMap: { [key: string]: string } = {
        '9-12': '9:00 AM - 12:00 PM',
        '12-3': '12:00 PM - 3:00 PM',
        '3-6': '3:00 PM - 6:00 PM',
      };
      const preferredTime = timeMap[formData.time] || formData.time;
      const selectedNGO = ngos.find(n => n.value === formData.ngo);

      const bookingData = {
        address: formData.address,
        wasteType,
        weight: parseFloat(formData.weight),
        preferredDate: pickupDate.toISOString(),
        preferredTime,
        ngoPartner: selectedNGO?.label || 'N/A',
      };

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token. Please log in again.');
      }
      await apiClient.createBooking(bookingData);
      setShowConfirmation(true);
    } catch (error: any) {
      setError(error.message || 'Failed to book pickup');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
        <div className="min-h-screen">
          <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="book-pickup" />
          <div className="md:ml-64 container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <RecycledPaperCard className="p-8 text-center" glowColor="emerald">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-[#6b8e6b]" strokeWidth={2.5} />
                </motion.div>
                <h1 className="text-3xl text-[#3d2817] mb-4">Pickup Booked Successfully!</h1>
                <p className="text-xl text-[#3d2817]/60 mb-6">
                  Your pickup has been scheduled. An agent will be assigned shortly.
                </p>
                <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[#3d2817]/60 mb-1">Tracking Number</div>
                      <div className="text-[#3d2817]">PK{Math.floor(1000 + Math.random() * 9000)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#3d2817]/60 mb-1">Waste Type</div>
                      <div className="text-[#3d2817] capitalize">{formData.wasteType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#3d2817]/60 mb-1">Scheduled Date</div>
                      <div className="text-[#3d2817]">{formData.date}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#3d2817]/60 mb-1">Time Slot</div>
                      <div className="text-[#3d2817]">{formData.time}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => onNavigate('pickup-status')} variant="emerald">
                    Track Pickup
                  </Button>
                  <Button onClick={() => onNavigate('dashboard')} variant="outline">
                    Go to Dashboard
                  </Button>
                </div>
              </RecycledPaperCard>
            </motion.div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="book-pickup" />
        
        <div className="md:ml-64 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl text-[#3d2817] mb-2">Book a Pickup</h1>
            <p className="text-xl text-[#2c1810]">Schedule your recyclable waste collection</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Input Section (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Material Cards Grid */}
              <RecycledPaperCard className="p-6">
                  <Label className="flex items-center gap-2 mb-4 text-[#3d2817] uppercase tracking-wide">
                  <Package className="w-5 h-5" strokeWidth={2} />
                  Select Materials
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {wasteTypes.map((type) => {
                    const isSelected = selectedMaterials.includes(type.value);
                    return (
                      <button
                        key={type.value}
                        onClick={() => handleMaterialClick(type.value)}
                        className={cn(
                          "p-6 rounded-xl border-2 transition-all text-center relative overflow-hidden",
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-white/10 bg-white/5 grayscale hover:grayscale-0"
                        )}
                      >
                        <type.icon className={cn(
                          "w-12 h-12 mx-auto mb-3 transition-all",
                          isSelected ? "text-[#6b8e6b]" : "text-[#3d2817]/40"
                        )} strokeWidth={2} />
                        <div className={cn(
                          "text-sm font-medium uppercase tracking-wide transition-all",
                          isSelected ? "text-[#3d2817]" : "text-[#3d2817]/40"
                        )}>
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </RecycledPaperCard>

              {/* Address */}
              <RecycledPaperCard className="p-6">
                <Label htmlFor="address" className="flex items-center gap-2 mb-4 text-[#3d2817] uppercase tracking-wide">
                  <MapPin className="w-5 h-5" strokeWidth={2} />
                  Pickup Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="bg-white/5 border-white/10 text-[#3d2817] placeholder:text-[#3d2817]/40"
                />
              </RecycledPaperCard>

              {/* Weight */}
              <RecycledPaperCard className="p-6">
                <Label htmlFor="weight" className="text-[#3d2817] uppercase tracking-wide mb-4 block">
                  Expected Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </RecycledPaperCard>

              {/* Date Selector - Horizontal Scroll */}
              <RecycledPaperCard className="p-6">
                  <Label className="flex items-center gap-2 mb-4 text-[#3d2817] uppercase tracking-wide">
                  <Calendar className="w-5 h-5" strokeWidth={2} />
                  Select Date
                </Label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {dates.map((date) => {
                    const dateObj = new Date(date);
                    const isSelected = selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setFormData(prev => ({ ...prev, date }));
                        }}
                        className={cn(
                          "flex-shrink-0 px-6 py-3 rounded-full border-2 transition-all whitespace-nowrap",
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10 text-[#3d2817]"
                            : "border-white/10 bg-white/5 text-[#3d2817]/60 hover:border-white/20"
                        )}
                      >
                        <div className="text-xs uppercase tracking-wide">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-sm font-medium">{dateObj.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </RecycledPaperCard>

              {/* Time Slot */}
              <RecycledPaperCard className="p-6">
                <Label htmlFor="time" className="text-[#3d2817] uppercase tracking-wide mb-4 block">
                  Preferred Time
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {['9-12', '12-3', '3-6'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData(prev => ({ ...prev, time }))}
                      className={cn(
                        "px-4 py-3 rounded-full border-2 transition-all text-sm",
                        formData.time === time
                          ? "border-emerald-500 bg-emerald-500/10 text-[#3d2817]"
                          : "border-white/10 bg-white/5 text-[#3d2817]/60 hover:border-white/20"
                      )}
                    >
                      {time === '9-12' ? '9 AM - 12 PM' : time === '12-3' ? '12 PM - 3 PM' : '3 PM - 6 PM'}
                    </button>
                  ))}
                </div>
              </RecycledPaperCard>

              {/* NGO Selection Grid */}
              <RecycledPaperCard className="p-6">
                  <Label className="flex items-center gap-2 mb-4 text-[#3d2817] uppercase tracking-wide">
                  <Heart className="w-5 h-5" strokeWidth={2} />
                  Select NGO
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {ngos.map((ngo) => (
                    <button
                      key={ngo.value}
                      onClick={() => setFormData({ ...formData, ngo: ngo.value })}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        formData.ngo === ngo.value
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <div className={cn(
                        "font-medium mb-1",
                        formData.ngo === ngo.value ? "text-[#3d2817]" : "text-[#3d2817]/80"
                      )}>
                        {ngo.label}
                      </div>
                      <div className="text-xs text-[#3d2817]/60">{ngo.focus}</div>
                    </button>
                  ))}
                </div>
              </RecycledPaperCard>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.address || !formData.wasteType || !formData.weight || !formData.date || !formData.time || !formData.ngo}
                variant="emerald"
                size="lg"
                className="w-full"
              >
                {loading ? 'Booking...' : 'Confirm Booking'} <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Right: Manifest Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <RecycledPaperCard className="p-6 sticky top-8" glowColor="emerald">
                <h3 className="text-xl text-[#3d2817] mb-6 uppercase tracking-wide">Manifest</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1">Materials</div>
                    <div className="text-[#3d2817]">
                      {selectedMaterials.length > 0 
                        ? selectedMaterials.map(v => wasteTypes.find(t => t.value === v)?.label).join(', ')
                        : 'None selected'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1">Weight</div>
                    <div className="text-[#3d2817]">{formData.weight || '0'} kg</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1">Date</div>
                    <div className="text-[#3d2817]">{formData.date || 'Not selected'}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1">NGO</div>
                    <div className="text-[#3d2817]">
                      {ngos.find(n => n.value === formData.ngo)?.label || 'Not selected'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-[#3d2817]/60">Estimated CO₂ Offset</div>
                    <div className="text-2xl font-bold text-[#6b8e6b]">{calculateCO2()} kg</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-[#3d2817]/60">Donation Value</div>
                    <div className="text-2xl font-bold text-[#6b8e6b]">₹{calculateDonation()}</div>
                  </div>
                </div>
              </RecycledPaperCard>
            </div>
          </div>
        </div>
      </div>
  );
}
