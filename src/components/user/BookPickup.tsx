import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Calendar, MapPin, Trash2, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface BookPickupProps {
  setView: (view: string) => void;
}

export default function BookPickup({ setView }: BookPickupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    wasteType: '',
    estimatedWeight: '',
    address: '123 Green Street, Mumbai, Maharashtra 400001',
    preferredDate: '',
    preferredTime: '',
    ngo: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', icon: '♻️' },
    { value: 'paper', label: 'Paper', icon: '📄' },
    { value: 'metal', label: 'Metal', icon: '🔩' },
    { value: 'ewaste', label: 'E-Waste', icon: '💻' },
    { value: 'mixed', label: 'Mixed', icon: '📦' },
  ];

  const ngos = [
    { value: 'greenearth', label: 'GreenEarth Foundation' },
    { value: 'cleanindia', label: 'Clean India Mission' },
    { value: 'ecowarriors', label: 'EcoWarriors' },
    { value: 'savetomorrow', label: 'Save Tomorrow' },
  ];

  const handleSubmit = () => {
    const tracking = `PK-${Date.now().toString().slice(-8)}`;
    setTrackingNumber(tracking);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto pb-20 lg:pb-8">
        <div className="bg-white p-8 rounded-2xl border shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#3BAF69]" />
          </div>
          <h1 className="text-gray-900 mb-4">Pickup Booked Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your pickup has been scheduled. Our agent will arrive at your location on the selected date and time.
          </p>
          
          <div className="bg-green-50 p-6 rounded-xl border border-green-200 mb-6">
            <div className="text-gray-900 mb-2">Tracking Number</div>
            <div className="text-[#3BAF69]">{trackingNumber}</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Waste Type</div>
              <div className="text-gray-900">{wasteTypes.find(w => w.value === formData.wasteType)?.label}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Estimated Weight</div>
              <div className="text-gray-900">{formData.estimatedWeight} kg</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Pickup Date</div>
              <div className="text-gray-900">{formData.preferredDate}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600 mb-1">Pickup Time</div>
              <div className="text-gray-900">{formData.preferredTime}</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button className="bg-[#3BAF69] hover:bg-[#2d9755]" onClick={() => setView('status')}>
              Track Status
            </Button>
            <Button variant="outline" onClick={() => setView('home')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  s <= step ? 'bg-[#3BAF69] text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-[#3BAF69]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Waste Details</span>
          <span>Schedule</span>
          <span>NGO Selection</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        {/* Step 1: Waste Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Waste Details</h2>
              <p className="text-gray-600">Tell us what you'd like to recycle</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-3">Type of Waste</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {wasteTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, wasteType: type.value })}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.wasteType === type.value
                        ? 'border-[#3BAF69] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="weight" className="block text-gray-700 mb-2">
                Estimated Weight (in kg)
              </label>
              <Input
                id="weight"
                type="number"
                value={formData.estimatedWeight}
                onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value })}
                placeholder="e.g., 5"
                min="0.5"
                step="0.5"
              />
              <p className="text-gray-500 mt-2">Approximate weight is fine</p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any specific instructions..."
                rows={3}
              />
            </div>

            <Button
              className="w-full bg-[#3BAF69] hover:bg-[#2d9755]"
              onClick={() => setStep(2)}
              disabled={!formData.wasteType || !formData.estimatedWeight}
            >
              Next: Schedule Pickup <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Schedule Pickup</h2>
              <p className="text-gray-600">Choose your preferred date and time</p>
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Pickup Address
              </label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Date
              </label>
              <Input
                id="date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-gray-700 mb-2">
                Preferred Time Slot
              </label>
              <Select value={formData.preferredTime} onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9am-12pm">9:00 AM - 12:00 PM</SelectItem>
                  <SelectItem value="12pm-3pm">12:00 PM - 3:00 PM</SelectItem>
                  <SelectItem value="3pm-6pm">3:00 PM - 6:00 PM</SelectItem>
                  <SelectItem value="6pm-9pm">6:00 PM - 9:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                className="flex-1 bg-[#3BAF69] hover:bg-[#2d9755]"
                onClick={() => setStep(3)}
                disabled={!formData.preferredDate || !formData.preferredTime}
              >
                Next: Select NGO <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: NGO Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Choose NGO</h2>
              <p className="text-gray-600">Select where your donation should go</p>
            </div>

            <div className="space-y-3">
              {ngos.map((ngo) => (
                <button
                  key={ngo.value}
                  onClick={() => setFormData({ ...formData, ngo: ngo.value })}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    formData.ngo === ngo.value
                      ? 'border-[#3BAF69] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#3BAF69]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900">{ngo.label}</div>
                    <div className="text-gray-600">Supporting community welfare</div>
                  </div>
                  {formData.ngo === ngo.value && (
                    <Check className="w-6 h-6 text-[#3BAF69]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700">
                The monetary value of your recyclable waste will be automatically donated to your selected NGO.
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                className="flex-1 bg-[#3BAF69] hover:bg-[#2d9755]"
                onClick={handleSubmit}
                disabled={!formData.ngo}
              >
                Confirm Booking <Check className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
