import axios from 'axios';

export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extract detailed error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let detail = 'An unexpected error occurred';
    let hint = '';

    if (error.response?.data) {
      detail = error.response.data.detail || detail;
      hint = error.response.data.hint ? `\n\n💡 HINT: ${error.response.data.hint}` : '';
    } else if (error.message) {
      detail = error.message;
    }

    return Promise.reject(new Error(detail + hint));
  }
);

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, role } = response.data;
    localStorage.setItem('authToken', access_token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);

    return { token: access_token, role };
  },
  register: async (email: string, password: string, fullName: string, role: string) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      full_name: fullName,
      role,
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  },
};

// Donor APIs
export const donorAPI = {
  uploadFood: async (formData: FormData) => {
    const email = localStorage.getItem('userEmail');
    if (email) formData.append('donor_email', email);
    const response = await api.post(`/food/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getDonationHistory: async () => {
    const email = localStorage.getItem('userEmail');
    const response = await api.get(`/food/history/${email}`);
    return { donations: response.data };
  },
  deleteDonation: async (itemId: string) => {
    const email = localStorage.getItem('userEmail');
    const response = await api.delete(`/food/${itemId}?donor_email=${email}`);
    return response.data;
  },
  getAnalytics: async () => {
    const email = localStorage.getItem('userEmail');
    const response = await api.get(`/analytics/donor/${email}`);
    return response.data;
  },
};

// NGO APIs
export const ngoAPI = {
  getIncomingRequests: async () => {
    const response = await api.get('/ngo/requests');
    return { requests: response.data };
  },
  acceptDonation: async (donationId: string) => {
    const email = localStorage.getItem('userEmail');
    const response = await api.post(`/ngo/accept/${donationId}?ngo_email=${email}`);
    return response.data;
  },
  getDeliveryTracking: async () => {
    const email = localStorage.getItem('userEmail');
    const response = await api.get(`/food/history/${email}`);
    return { deliveries: response.data };
  },
  getAnalytics: async () => {
    const email = localStorage.getItem('userEmail');
    const response = await api.get(`/analytics/ngo/${email}`);
    return response.data;
  },
};

// Farm APIs
export const farmAPI = {
  getIncomingRequests: async () => {
    const response = await api.get('/farm/requests');
    return { requests: response.data };
  },
  acceptRequest: async (requestId: string) => {
    const email = localStorage.getItem('userEmail');
    const response = await api.post(`/farm/accept/${requestId}?farm_email=${email}`);
    return response.data;
  },
  getCompostTracking: async () => {
    const email = localStorage.getItem('userEmail');
    const response = await api.get(`/food/history/${email}`);
    return { items: response.data };
  },
  getAnalytics: async () => {
    const email = localStorage.getItem('userEmail');
    const response = await api.get(`/analytics/farm/${email}`);
    return response.data;
  },
};

export default api;