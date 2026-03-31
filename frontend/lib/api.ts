import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  address: string;
  created_at: string;
  updated_at?: string;
}

export interface Car {
  id: string | number;
  name: string;
  brand: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  price_per_day?: number;
  price_per_hour?: number;
  pricePerDay?: number; // For frontend compatibility
  pricePerHour?: number; // For frontend compatibility
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  available: boolean;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  car_id: number;
  pickup_location: string;
  drop_location: string;
  pickup_date: string;
  drop_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at?: string;
  user?: User;
  car?: Car;
}

export interface BookingCreate {
  user_id: number;
  car_id: number;
  pickup_location: string;
  drop_location: string;
  pickup_date: string;
  drop_date: string;
  payment_method: string;
}

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  address: string;
}

// API Functions
export const apiClient = {
  // Users
  createUser: async (userData: UserCreate): Promise<User> => {
    const response = await api.post('/api/users/', userData);
    return response.data;
  },

  getUser: async (userId: number): Promise<User> => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  getUserBookings: async (userId: number): Promise<Booking[]> => {
    const response = await api.get(`/api/users/${userId}/bookings`);
    return response.data;
  },

  // Cars
  getCars: async (): Promise<Car[]> => {
    const response = await api.get('/api/cars/');
    return response.data;
  },

  getCar: async (carId: number): Promise<Car> => {
    const response = await api.get(`/api/cars/${carId}`);
    return response.data;
  },

  getAvailableCars: async (
    pickupDate: string,
    dropDate: string,
    location?: string
  ): Promise<Car[]> => {
    const params = new URLSearchParams({
      pickup_date: pickupDate,
      drop_date: dropDate,
    });
    
    if (location) {
      params.append('location', location);
    }
    
    const response = await api.get(`/api/cars/available?${params}`);
    return response.data;
  },

  // Bookings
  createBooking: async (bookingData: BookingCreate): Promise<Booking> => {
    const response = await api.post('/api/bookings/', bookingData);
    return response.data;
  },

  getBooking: async (bookingId: number): Promise<Booking> => {
    const response = await api.get(`/api/bookings/${bookingId}`);
    return response.data;
  },

  updateBooking: async (
    bookingId: number, 
    updateData: Partial<Booking>
  ): Promise<Booking> => {
    const response = await api.put(`/api/bookings/${bookingId}`, updateData);
    return response.data;
  },

  confirmBooking: async (bookingId: number): Promise<Booking> => {
    const response = await api.post(`/api/bookings/${bookingId}/confirm`);
    return response.data;
  },

  cancelBooking: async (bookingId: number): Promise<Booking> => {
    const response = await api.post(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },

  getBookings: async (
    userId?: number,
    status?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<Booking[]> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    
    if (userId) {
      params.append('user_id', userId.toString());
    }
    
    if (status) {
      params.append('status', status);
    }
    
    const response = await api.get(`/api/bookings/?${params}`);
    return response.data;
  },
};

export default api;
