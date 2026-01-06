# Frontend-Backend Integration Guide

This guide helps you integrate your existing React frontend with the new backend API.

## Base Configuration

### 1. API Base URL

Create a config file in your React app:

```typescript
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 2. API Client Setup

Create an API client with authentication:

```typescript
// src/services/api.ts
import { API_BASE_URL } from '../config/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    const data = await response.json();
    return data.data || data;
  }

  // Auth methods
  async register(userData: RegisterData) {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  // User methods
  async getProfile() {
    return this.request<User>('/users/profile');
  }

  async updateProfile(updates: Partial<User>) {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getDashboard() {
    return this.request<DashboardData>('/users/dashboard');
  }

  async getImpactStats() {
    return this.request<ImpactStats>('/users/impact-stats');
  }

  // Pickup methods
  async schedulePickup(pickupData: PickupData) {
    return this.request<Pickup>('/pickups', {
      method: 'POST',
      body: JSON.stringify(pickupData),
    });
  }

  async getPickups(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<Pickup[]>(`/pickups${query}`);
  }

  async getPickupById(id: string) {
    return this.request<Pickup>(`/pickups/${id}`);
  }

  async cancelPickup(id: string) {
    return this.request<Pickup>(`/pickups/${id}`, {
      method: 'DELETE',
    });
  }

  // Donation methods
  async getDonations() {
    return this.request<Donation[]>(`/donations`);
  }

  async getDonationReceipt(receiptId: string) {
    return this.request<Donation>(`/donations/receipt/${receiptId}`);
  }

  // NGO methods
  async getNGOs(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<NGO[]>(`/ngos${query}`);
  }

  async getNGOById(id: string) {
    return this.request<NGO>(`/ngos/${id}`);
  }

  // Leaderboard methods
  async getLeaderboard(period: string = 'all-time', community?: string) {
    const query = community 
      ? `?period=${period}&community=${community}`
      : `?period=${period}`;
    return this.request<LeaderboardEntry[]>(`/leaderboard/global${query}`);
  }

  async getCommunityLeaderboard(community: string, period: string = 'monthly') {
    return this.request<LeaderboardEntry[]>(
      `/leaderboard/community?community=${community}&period=${period}`
    );
  }

  // Badge methods
  async getBadges() {
    return this.request<Badge[]>(`/badges`);
  }

  async getUserBadges(userId: string) {
    return this.request<Badge[]>(`/badges/user/${userId}`);
  }
}

export const apiClient = new ApiClient();
```

## Type Definitions

```typescript
// src/types/api.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'agent' | 'admin' | 'ngo';
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  totalPickups: number;
  totalRecycledKg: number;
  totalDonatedAmount: number;
  totalCO2Saved: number;
  badges: Array<{
    badgeId: Badge;
    earnedAt: string;
  }>;
}

export interface Pickup {
  _id: string;
  userId: string;
  agentId?: string;
  pickupDate: string;
  timeSlot: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  materials: Array<{
    type: 'paper' | 'plastic' | 'metal' | 'glass' | 'electronics' | 'mixed';
    estimatedWeight: number;
    actualWeight?: number;
    value?: number;
  }>;
  selectedNGO: string | NGO;
  status: 'scheduled' | 'assigned' | 'in-progress' | 'collected' | 'completed' | 'cancelled';
  totalEstimatedValue: number;
  totalActualValue?: number;
  totalWeight: number;
  createdAt: string;
}

export interface Donation {
  _id: string;
  pickupId: string;
  userId: string;
  ngoId: string | NGO;
  amount: number;
  csrMatchAmount: number;
  totalAmount: number;
  receiptId: string;
  status: string;
  transactionDate: string;
  createdAt: string;
}

export interface NGO {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  category: string;
  verified: boolean;
  totalDonationsReceived: number;
  impactStories?: Array<{
    title: string;
    description: string;
    image?: string;
    date: string;
  }>;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: string;
    threshold: number;
  };
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface LeaderboardEntry {
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
    totalRecycledKg: number;
    totalDonatedAmount: number;
  };
  metrics: {
    totalPickups: number;
    totalWeight: number;
    totalDonations: number;
    totalCO2Saved: number;
    impactScore: number;
  };
  rank: number;
  community: string;
}

export interface DashboardData {
  user: {
    name: string;
    totalPickups: number;
    totalRecycledKg: number;
    totalDonatedAmount: number;
    totalCO2Saved: number;
    impactScore: number;
  };
  recentPickups: Pickup[];
  recentDonations: Donation[];
}

export interface ImpactStats {
  totalPickups: number;
  totalRecycledKg: number;
  totalDonatedAmount: number;
  totalCO2Saved: number;
  impactScore: number;
  badges: number;
}
```

## Example Usage in React Components

### Login Component

```typescript
// src/components/LoginModal.tsx
import { apiClient } from '../services/api';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await apiClient.login(email, password);
    // Update user state
    setUser(response.user);
    // Navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    // Show error message
  }
};
```

### Dashboard Component

```typescript
// src/components/UserDashboard.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import type { DashboardData } from '../types/api';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiClient.getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!dashboardData) return <div>No data</div>;

  return (
    <div>
      <h1>Welcome, {dashboardData.user.name}!</h1>
      <div>
        <p>Total Pickups: {dashboardData.user.totalPickups}</p>
        <p>Total Recycled: {dashboardData.user.totalRecycledKg} kg</p>
        <p>Total Donated: ₹{dashboardData.user.totalDonatedAmount}</p>
        <p>CO2 Saved: {dashboardData.user.totalCO2Saved} kg</p>
        <p>Impact Score: {dashboardData.user.impactScore}</p>
      </div>
      {/* Render recent pickups and donations */}
    </div>
  );
};
```

### Schedule Pickup Component

```typescript
// src/components/BookPickup.tsx
import { apiClient } from '../services/api';
import type { NGO } from '../types/api';

const BookPickup = () => {
  const [ngos, setNGOs] = useState<NGO[]>([]);

  useEffect(() => {
    const fetchNGOs = async () => {
      const data = await apiClient.getNGOs();
      setNGOs(data);
    };
    fetchNGOs();
  }, []);

  const handleSubmit = async (formData: PickupFormData) => {
    try {
      const pickup = await apiClient.schedulePickup({
        pickupDate: formData.date,
        timeSlot: formData.timeSlot,
        address: formData.address,
        materials: formData.materials,
        selectedNGO: formData.selectedNGO,
      });
      
      // Show success message
      // Navigate to pickup status page
    } catch (error) {
      console.error('Failed to schedule pickup:', error);
    }
  };

  // Render form...
};
```

## Environment Variables

Add to your `.env` file in the React app root:

```env
VITE_API_URL=http://localhost:5000/api
```

## Error Handling

Create an error handler:

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: Error) => {
  if (error.message.includes('401') || error.message.includes('token')) {
    // Token expired or invalid
    localStorage.removeItem('token');
    // Redirect to login
    window.location.href = '/login';
  }
  
  // Show user-friendly error message
  return error.message || 'An error occurred';
};
```

## Authentication Flow

1. User logs in → Store token in localStorage
2. Include token in all API requests
3. If token expires → Redirect to login
4. On logout → Remove token from localStorage

## CORS Configuration

Ensure your backend `.env` has the correct frontend URL:

```env
FRONTEND_URL=http://localhost:5173
```

This allows your React app (running on port 5173 with Vite) to make API requests.

## Testing Integration

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Test login flow
4. Test API calls from browser DevTools Network tab
5. Verify data appears correctly in UI

## Common Issues

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly

### 401 Unauthorized
- Check if token is being sent in headers
- Verify token hasn't expired
- Re-login to get new token

### 404 Not Found
- Verify API base URL is correct
- Check endpoint paths match backend routes

### Network Errors
- Ensure backend is running
- Check backend port (default: 5000)
- Verify no firewall blocking requests

