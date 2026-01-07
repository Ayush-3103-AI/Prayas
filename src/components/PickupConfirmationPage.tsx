import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Package, Calendar, Clock, MapPin, Heart, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { UserNavbar } from './UserNavbar';
import { apiClient } from '../utils/apiClient';

interface PickupConfirmationPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface BookingData {
  bookingId?: string;
  trackingNumber?: string;
  wasteType?: string;
  weight?: number;
  preferredDate?: string;
  preferredTime?: string;
  address?: string;
  ngoPartner?: string;
  status?: string;
  co2Offset?: number;
  donationValue?: number;
}

export function PickupConfirmationPage({ onNavigate, onLogout }: PickupConfirmationPageProps) {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        // First, try to get booking data from localStorage (faster)
        const storedBookingData = localStorage.getItem('lastBookingData');
        if (storedBookingData) {
          try {
            const data = JSON.parse(storedBookingData);
            setBookingData({
              bookingId: data.bookingId,
              trackingNumber: data.bookingId,
              wasteType: data.wasteType,
              weight: data.weight,
              preferredDate: data.preferredDate,
              preferredTime: data.preferredTime,
              address: data.address,
              ngoPartner: data.ngoPartner,
              status: data.status,
              co2Offset: (data.weight || 0) * 2.5,
              donationValue: (data.weight || 0) * 10,
            });
            setLoading(false);
            // Clear stored data after using it
            localStorage.removeItem('lastBookingData');
            return;
          } catch (err) {
            console.error('Failed to parse stored booking data:', err);
          }
        }
        
        // Get booking ID from localStorage
        const bookingId = localStorage.getItem('lastBookingId');
        
        if (!bookingId) {
          // Try to get from URL params or fallback to latest booking
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.id) {
              // Fetch user's latest booking
              const bookings: any = await apiClient.getUserBookings(user.id);
              const bookingsArray = bookings?.bookings || (Array.isArray(bookings) ? bookings : []);
              if (bookingsArray.length > 0) {
                const latestBooking = bookingsArray[0];
                setBookingData({
                  bookingId: latestBooking.bookingId || latestBooking._id,
                  trackingNumber: latestBooking.bookingId,
                  wasteType: latestBooking.wasteType,
                  weight: latestBooking.weight,
                  preferredDate: latestBooking.preferredDate,
                  preferredTime: latestBooking.preferredTime,
                  address: latestBooking.address,
                  ngoPartner: latestBooking.ngoPartner,
                  status: latestBooking.status,
                  co2Offset: (latestBooking.weight || 0) * 2.5, // Approximate CO2 offset per kg
                  donationValue: (latestBooking.weight || 0) * 10, // ₹10 per kg
                });
              }
            }
          }
        } else {
          // Fetch booking by ID
          try {
            const booking: any = await apiClient.getBooking(bookingId);
            const bookingDetails = booking?.booking || booking;
            setBookingData({
              bookingId: bookingDetails.bookingId || bookingDetails._id,
              trackingNumber: bookingDetails.bookingId,
              wasteType: bookingDetails.wasteType,
              weight: bookingDetails.weight,
              preferredDate: bookingDetails.preferredDate,
              preferredTime: bookingDetails.preferredTime,
              address: bookingDetails.address,
              ngoPartner: bookingDetails.ngoPartner,
              status: bookingDetails.status,
              co2Offset: (bookingDetails.weight || 0) * 2.5,
              donationValue: (bookingDetails.weight || 0) * 10,
            });
          } catch (err: any) {
            console.error('Failed to fetch booking by ID:', err);
            // Fallback to getting latest booking
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const user = JSON.parse(userStr);
              if (user.id) {
                const bookings: any = await apiClient.getUserBookings(user.id);
                const bookingsArray = bookings?.bookings || (Array.isArray(bookings) ? bookings : []);
                if (bookingsArray.length > 0) {
                  const latestBooking = bookingsArray[0];
                  setBookingData({
                    bookingId: latestBooking.bookingId || latestBooking._id,
                    trackingNumber: latestBooking.bookingId,
                    wasteType: latestBooking.wasteType,
                    weight: latestBooking.weight,
                    preferredDate: latestBooking.preferredDate,
                    preferredTime: latestBooking.preferredTime,
                    address: latestBooking.address,
                    ngoPartner: latestBooking.ngoPartner,
                    status: latestBooking.status,
                    co2Offset: (latestBooking.weight || 0) * 2.5,
                    donationValue: (latestBooking.weight || 0) * 10,
                  });
                }
              }
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch booking data:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  const trackingNumber = bookingData?.bookingId || bookingData?.trackingNumber || 'N/A';

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5dc' }}>
        <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="book-pickup" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b8e6b] mx-auto mb-4"></div>
            <p className="text-[#3d2817]">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5dc' }}>
        <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="book-pickup" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-8">
            <p className="text-red-600 mb-4">{error || 'Booking details not found'}</p>
            <Button onClick={() => onNavigate('dashboard')} variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5dc' }}>
      <UserNavbar onNavigate={onNavigate} onLogout={onLogout} activePage="book-pickup" />
      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-8 md:p-12 bg-white/90 shadow-lg border-2 border-[#6b8e6b]/20">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Check className="w-12 h-12 text-[#6b8e6b]" strokeWidth={2.5} />
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl text-[#3d2817] mb-4 text-center font-bold">
              Booking Confirmed! ✅
            </h1>
            <p className="text-xl text-[#3d2817]/60 mb-8 text-center">
              Your pickup has been scheduled successfully. Booking ID: <strong>{trackingNumber}</strong>. An agent will be assigned shortly.
            </p>

            {/* Booking Details Card */}
            <div className="bg-white/5 rounded-xl p-6 md:p-8 mb-8 border-2 border-[#d4c5b0]">
              <h2 className="text-2xl text-[#3d2817] mb-6 font-semibold">Booking Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tracking Number */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1 uppercase tracking-wide">Tracking Number</div>
                    <div className="text-xl text-[#3d2817] font-semibold">{trackingNumber}</div>
                  </div>
                </div>

                {/* Waste Type */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1 uppercase tracking-wide">Waste Type</div>
                    <div className="text-xl text-[#3d2817] font-semibold capitalize">
                      {bookingData?.wasteType || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Scheduled Date */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1 uppercase tracking-wide">Scheduled Date</div>
                    <div className="text-xl text-[#3d2817] font-semibold">
                      {bookingData?.preferredDate ? new Date(bookingData.preferredDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Time Slot */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-[#3d2817]/60 mb-1 uppercase tracking-wide">Time Slot</div>
                    <div className="text-xl text-[#3d2817] font-semibold">
                      {bookingData?.preferredTime || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#3d2817]/60 mb-1 uppercase tracking-wide">Pickup Address</div>
                    <div className="text-lg text-[#3d2817] font-semibold">
                      {bookingData?.address || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* NGO */}
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="w-12 h-12 bg-[#6b8e6b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#6b8e6b]" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#3d2817]/60 mb-1 uppercase tracking-wide">NGO Partner</div>
                    <div className="text-lg text-[#3d2817] font-semibold">
                      {bookingData?.ngoPartner || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="p-6 text-center bg-green-50/50 border border-[#6b8e6b]/30">
                <TrendingUp className="w-8 h-8 text-[#6b8e6b] mx-auto mb-3" strokeWidth={2} />
                <div className="text-sm text-[#3d2817]/60 mb-2 uppercase tracking-wide">Estimated CO₂ Offset</div>
                <div className="text-3xl font-bold text-[#6b8e6b]">
                  {bookingData?.co2Offset?.toFixed(1) || '0'} kg
                </div>
              </Card>

              <Card className="p-6 text-center bg-green-50/50 border border-[#6b8e6b]/30">
                <Heart className="w-8 h-8 text-[#6b8e6b] mx-auto mb-3" strokeWidth={2} />
                <div className="text-sm text-[#3d2817]/60 mb-2 uppercase tracking-wide">Donation Value</div>
                <div className="text-3xl font-bold text-[#6b8e6b]">
                  ₹{bookingData?.donationValue?.toLocaleString('en-IN') || '0'}
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => onNavigate('pickup-status')} 
                variant="emerald"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                Track Pickup Status
              </Button>
              <Button 
                onClick={() => onNavigate('dashboard')} 
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
        </div>
      </main>
    </div>
  );
}

