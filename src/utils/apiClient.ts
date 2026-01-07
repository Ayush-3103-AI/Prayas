// API Client for frontend-backend communication
// Default to port 5000 (backend default), but allow override via .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log API URL on load for debugging
console.log('API Base URL:', API_BASE_URL);

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  count?: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Token found, adding to request headers for:', endpoint);
    } else {
      console.error('⚠️ No authentication token found for endpoint:', endpoint);
      console.error('⚠️ localStorage token:', localStorage.getItem('token'));
      throw new Error('Access denied. No token provided. Please log in again.');
    }

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('API Request:', url, options.method || 'GET');
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        const errorMessage = errorData.error || errorData.message || errorData.msg || 
                           `HTTP error! status: ${response.status}`;
        console.error('API Error:', errorMessage, errorData);
        
        // Handle token expiration specifically
        if (response.status === 401 || errorMessage.includes('token') || errorMessage.includes('Token expired') || errorMessage.includes('Invalid token') || errorMessage.includes('Access denied')) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        
        throw new Error(errorMessage);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        // Handle token expiration in response
        if (data.error && (data.error.includes('token') || data.error.includes('Token expired') || data.error.includes('Invalid token') || data.error.includes('Access denied'))) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(data.error || 'Request failed');
      }

      return data.data;
    } catch (error: any) {
      console.error('API request failed:', error);
      // If it's a network error, provide more helpful message
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error(`Cannot connect to backend API. Please ensure the backend is running on ${this.baseURL.replace('/api', '')}`);
      }
      throw error;
    }
  }

  // Pickup methods
  async schedulePickup(pickupData: any) {
    return this.request('/pickups', {
      method: 'POST',
      body: JSON.stringify(pickupData),
    });
  }

  async getPickups(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/pickups${query}`);
  }

  async getPickupById(id: string) {
    return this.request(`/pickups/${id}`);
  }

  async updatePickupStatus(id: string, status: string, data?: any) {
    return this.request(`/pickups/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...data }),
    });
  }

  async cancelPickup(id: string) {
    return this.request(`/pickups/${id}`, {
      method: 'DELETE',
    });
  }

  // Agent methods - Note: This method is deprecated, use getAgentPickups(agentId) instead
  // Kept for backward compatibility but should use Booking API
  async getAgentPickupsOld(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/pickups/agent/assigned${query}`);
  }

  // Admin methods
  async getAdminStats() {
    return this.request('/admin/stats/overview');
  }

  async getAllPickups(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/admin/pickups${query}`);
  }

  async assignAgentToPickup(pickupId: string, agentId: string) {
    return this.request(`/admin/pickups/${pickupId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ agentId }),
    });
  }

  // NGO methods
  async getNGOs() {
    // NGO endpoint is public, so always use authRequest (no token required)
    try {
      return this.authRequest('/ngos');
    } catch (error) {
      console.error('Failed to fetch NGOs from backend:', error);
      throw error; // Let the component handle the error and show fallback
    }
  }

  // Authentication methods (don't require token)
  private async authRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('API Request:', url, options.method || 'GET');
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        const errorMessage = errorData.error || errorData.message || errorData.msg || 
                           `HTTP error! status: ${response.status}`;
        console.error('API Error:', errorMessage, errorData);
        throw new Error(errorMessage);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return data.data;
    } catch (error: any) {
      console.error('API request failed:', error);
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error(`Cannot connect to backend API. Please ensure the backend is running on ${this.baseURL.replace('/api', '')}`);
      }
      throw error;
    }
  }

  async userRegister(userData: { name: string; email: string; phone: string; address: string; password: string }) {
    return this.authRequest('/auth/user-register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async userLogin(email: string, password: string) {
    return this.authRequest('/auth/user-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async agentLogin(agentId: string, password: string) {
    return this.authRequest('/auth/agent-login', {
      method: 'POST',
      body: JSON.stringify({ agentId, password }),
    });
  }

  async adminLogin(adminId: string, password: string) {
    return this.authRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ adminId, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // User methods
  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateUser(userId: string, userData: { name?: string; address?: string }) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserBookings(userId: string) {
    return this.request(`/users/${userId}/bookings`);
  }

  async getUserImpact(userId: string) {
    return this.request(`/users/${userId}/impact`);
  }

  // Booking methods
  async createBooking(bookingData: {
    address: string;
    wasteType: string;
    weight: number;
    preferredDate: string;
    preferredTime: string;
    ngoPartner?: string;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBooking(bookingId: string) {
    return this.request(`/bookings/${bookingId}`);
  }

  async getAllBookings(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/bookings${query}`);
  }

  async updateBookingStatus(bookingId: string, status: string, agentId?: string) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, agentId }),
    });
  }

  async updateBookingStatusByAgent(bookingId: string, status: string) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Agent methods
  async registerAgent(agentData: { name: string; email: string; phone: string; agentId: string; password: string }) {
    return this.request('/agents/register', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async getAgentDashboard(agentId: string) {
    return this.request(`/agents/${agentId}/dashboard`);
  }

  async getAgentPickups(agentId: string) {
    return this.request(`/agents/${agentId}/pickups`);
  }

  async acceptBooking(agentId: string, bookingId: string) {
    return this.request(`/agents/${agentId}/accept-booking/${bookingId}`, {
      method: 'POST',
    });
  }

  async completePickup(pickupId: string, data: {
    actualWeight: number;
    wasteCondition: string;
    notes?: string;
    photoUrls?: string[];
  }) {
    return this.request(`/agents/pickups/${pickupId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin methods
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminPickups(status?: string, date?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/admin/pickups${query}`);
  }

  async getAdminAgents() {
    return this.request('/admin/agents');
  }

  async assignAgent(bookingId: string, agentId: string) {
    return this.request('/admin/assign', {
      method: 'POST',
      body: JSON.stringify({ bookingId, agentId }),
    });
  }

  async generateReport(format: 'json' | 'csv' | 'pdf' = 'json', startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    params.append('format', format);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (format === 'pdf') {
      // For PDF, we need to handle binary response
      const token = localStorage.getItem('token');
      const url = `${this.baseURL}/admin/report?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `prayas-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      return { success: true, message: 'Report downloaded successfully' };
    }
    
    return this.request(`/admin/report?${params.toString()}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

