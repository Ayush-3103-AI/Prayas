import { Package, Clock, CheckCircle, Truck, Download, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useState } from 'react';

type PickupStatus = 'pending' | 'assigned' | 'on-the-way' | 'collected' | 'donated';

interface Pickup {
  id: string;
  trackingNumber: string;
  date: string;
  wasteType: string;
  weight: number | null;
  status: PickupStatus;
  agentName?: string;
  ngo: string;
  donationAmount: number | null;
  scheduledDate: string;
  scheduledTime: string;
}

export default function PickupStatus() {
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);

  const pickups: Pickup[] = [
    {
      id: '1',
      trackingNumber: 'PK-20241128',
      date: '2024-11-28',
      wasteType: 'Plastic',
      weight: 5.2,
      status: 'donated',
      agentName: 'Rajesh Kumar',
      ngo: 'GreenEarth Foundation',
      donationAmount: 260,
      scheduledDate: '2024-11-28',
      scheduledTime: '9am-12pm',
    },
    {
      id: '2',
      trackingNumber: 'PK-20241125',
      date: '2024-11-25',
      wasteType: 'Paper',
      weight: 3.5,
      status: 'collected',
      agentName: 'Amit Sharma',
      ngo: 'Clean India Mission',
      donationAmount: 180,
      scheduledDate: '2024-11-25',
      scheduledTime: '12pm-3pm',
    },
    {
      id: '3',
      trackingNumber: 'PK-20241202',
      date: '2024-12-02',
      wasteType: 'E-Waste',
      weight: null,
      status: 'on-the-way',
      agentName: 'Vikram Singh',
      ngo: 'EcoWarriors',
      donationAmount: null,
      scheduledDate: '2024-12-02',
      scheduledTime: '3pm-6pm',
    },
    {
      id: '4',
      trackingNumber: 'PK-20241205',
      date: '2024-12-05',
      wasteType: 'Mixed',
      weight: null,
      status: 'assigned',
      agentName: 'Suresh Patel',
      ngo: 'Save Tomorrow',
      donationAmount: null,
      scheduledDate: '2024-12-05',
      scheduledTime: '9am-12pm',
    },
    {
      id: '5',
      trackingNumber: 'PK-20241208',
      date: '2024-12-08',
      wasteType: 'Metal',
      weight: null,
      status: 'pending',
      ngo: 'GreenEarth Foundation',
      donationAmount: null,
      scheduledDate: '2024-12-08',
      scheduledTime: '12pm-3pm',
    },
  ];

  const getStatusBadge = (status: PickupStatus) => {
    const config = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      assigned: { label: 'Assigned', variant: 'default' as const },
      'on-the-way': { label: 'On the Way', variant: 'default' as const },
      collected: { label: 'Collected', variant: 'default' as const },
      donated: { label: 'Donated', variant: 'default' as const },
    };
    return config[status];
  };

  const getStatusIcon = (status: PickupStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'assigned':
        return <Package className="w-5 h-5" />;
      case 'on-the-way':
        return <Truck className="w-5 h-5" />;
      case 'collected':
      case 'donated':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: PickupStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      case 'assigned':
        return 'bg-blue-100 text-blue-600';
      case 'on-the-way':
        return 'bg-purple-100 text-purple-600';
      case 'collected':
        return 'bg-green-100 text-[#3BAF69]';
      case 'donated':
        return 'bg-green-100 text-[#3BAF69]';
    }
  };

  const downloadReceipt = (pickup: Pickup) => {
    alert(`Downloading receipt for ${pickup.trackingNumber}`);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="text-gray-900 mb-2">My Pickups</h1>
        <p className="text-gray-600">Track all your recycling pickups</p>
      </div>

      {/* Pickup Cards */}
      <div className="space-y-4">
        {pickups.map((pickup) => (
          <div key={pickup.id} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(pickup.status)}`}>
                  {getStatusIcon(pickup.status)}
                </div>
                <div>
                  <div className="text-gray-900 mb-1">{pickup.trackingNumber}</div>
                  <div className="text-gray-600">{pickup.wasteType}</div>
                </div>
              </div>
              <Badge className={`${
                pickup.status === 'donated' ? 'bg-[#3BAF69]' :
                pickup.status === 'collected' ? 'bg-green-500' :
                pickup.status === 'on-the-way' ? 'bg-purple-500' :
                pickup.status === 'assigned' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}>
                {getStatusBadge(pickup.status).label}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-600 mb-1">Scheduled Date</div>
                <div className="text-gray-900">{pickup.scheduledDate}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-600 mb-1">Time Slot</div>
                <div className="text-gray-900">{pickup.scheduledTime}</div>
              </div>
              {pickup.weight && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600 mb-1">Weight Collected</div>
                  <div className="text-gray-900">{pickup.weight} kg</div>
                </div>
              )}
              {pickup.agentName && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600 mb-1">Agent</div>
                  <div className="text-gray-900">{pickup.agentName}</div>
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-600 mb-1">NGO</div>
                <div className="text-gray-900">{pickup.ngo}</div>
              </div>
              {pickup.donationAmount && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-gray-600 mb-1">Donation Amount</div>
                  <div className="text-[#3BAF69]">₹{pickup.donationAmount}</div>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="mb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['pending', 'assigned', 'on-the-way', 'collected', 'donated'].map((s, index) => {
                  const statusIndex = ['pending', 'assigned', 'on-the-way', 'collected', 'donated'].indexOf(pickup.status);
                  const currentIndex = ['pending', 'assigned', 'on-the-way', 'collected', 'donated'].indexOf(s);
                  const isActive = currentIndex <= statusIndex;
                  
                  return (
                    <div key={s} className="flex items-center">
                      <div
                        className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                          isActive ? 'bg-[#3BAF69] text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                      </div>
                      {index < 4 && (
                        <div className={`w-8 h-0.5 ${isActive ? 'bg-[#3BAF69]' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPickup(pickup)}>
                <Eye className="w-4 h-4 mr-2" /> View Details
              </Button>
              {pickup.status === 'donated' && (
                <Button variant="outline" size="sm" onClick={() => downloadReceipt(pickup)}>
                  <Download className="w-4 h-4 mr-2" /> Download Receipt
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal (simplified inline version) */}
      {selectedPickup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPickup(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-gray-900 mb-4">Pickup Details</h2>
            <div className="space-y-3">
              <div>
                <div className="text-gray-600">Tracking Number</div>
                <div className="text-gray-900">{selectedPickup.trackingNumber}</div>
              </div>
              <div>
                <div className="text-gray-600">Status</div>
                <div className="text-gray-900 capitalize">{selectedPickup.status.replace('-', ' ')}</div>
              </div>
              <div>
                <div className="text-gray-600">Waste Type</div>
                <div className="text-gray-900">{selectedPickup.wasteType}</div>
              </div>
              {selectedPickup.weight && (
                <div>
                  <div className="text-gray-600">Weight</div>
                  <div className="text-gray-900">{selectedPickup.weight} kg</div>
                </div>
              )}
              {selectedPickup.donationAmount && (
                <div>
                  <div className="text-gray-600">Donation Amount</div>
                  <div className="text-[#3BAF69]">₹{selectedPickup.donationAmount}</div>
                </div>
              )}
            </div>
            <Button className="w-full mt-6" onClick={() => setSelectedPickup(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
