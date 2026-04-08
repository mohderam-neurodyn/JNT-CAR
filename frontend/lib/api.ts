import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types for FastAPI backend
export interface FastAPIUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: FastAPIUser;
}

export interface FastAPICar {
  id: string;
  brand: string;
  model: string;
  year: number;
  daily_rate: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'electric';
  seats: number;
  description?: string;
  images?: string[];
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  is_available: boolean;
  owner_id: string;
  created_at: string;
  distance_km?: number;
}

export interface CarFormData {
  brand: string;
  model: string;
  year: number;
  daily_rate: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'electric';
  seats: number;
  description?: string;
  images?: string[];
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<FastAPIUser> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Cars API
export const carsAPI = {
  getCars: async (city?: string, limit = 20): Promise<FastAPICar[]> => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    params.append('limit', limit.toString());
    
    const response = await api.get(`/api/cars?${params}`);
    return response.data;
  },

  getCar: async (id: string): Promise<FastAPICar> => {
    const response = await api.get(`/api/cars/${id}`);
    return response.data;
  },

  getNearbyCars: async (
    lat: number, 
    lng: number, 
    radius = 10, 
    city?: string
  ): Promise<FastAPICar[]> => {
    const params = new URLSearchParams();
    params.append('lat', lat.toString());
    params.append('lng', lng.toString());
    params.append('radius', radius.toString());
    if (city) params.append('city', city);
    
    const response = await api.get(`/api/cars/nearby?${params}`);
    return response.data;
  },

  createCar: async (carData: CarFormData): Promise<FastAPICar> => {
    const response = await api.post('/api/cars', carData);
    return response.data;
  },

  updateCar: async (id: string, carData: Partial<CarFormData>): Promise<FastAPICar> => {
    const response = await api.put(`/api/cars/${id}`, carData);
    return response.data;
  },

  deleteCar: async (id: string): Promise<void> => {
    await api.delete(`/api/cars/${id}`);
  },
};

// Legacy types for compatibility with existing frontend
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

// Legacy API functions for compatibility
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

  // Cars - Updated to use FastAPI
  getCars: async (): Promise<Car[]> => {
    try {
      const fastAPICars = await carsAPI.getCars();
      // Convert FastAPI cars to legacy format for compatibility
      return fastAPICars.map(car => ({
        id: car.id,
        name: `${car.brand} ${car.model}`,
        brand: car.brand,
        category: car.fuel_type,
        transmission: car.transmission,
        fuel: car.fuel_type,
        seats: car.seats,
        price_per_day: car.daily_rate,
        pricePerDay: car.daily_rate,
        image: car.images?.[0] || '/placeholder-car.jpg',
        rating: 4.5,
        reviews: 12,
        features: [car.transmission, car.fuel_type, `${car.seats} seats`],
        available: car.is_available,
        location: car.city,
        created_at: car.created_at,
      }));
    } catch (error) {
      // Fallback to mock data if API fails
      return [];
    }
  },

  getCar: async (carId: number): Promise<Car> => {
    try {
      const fastAPICar = await carsAPI.getCar(carId.toString());
      return {
        id: fastAPICar.id,
        name: `${fastAPICar.brand} ${fastAPICar.model}`,
        brand: fastAPICar.brand,
        category: fastAPICar.fuel_type,
        transmission: fastAPICar.transmission,
        fuel: fastAPICar.fuel_type,
        seats: fastAPICar.seats,
        price_per_day: fastAPICar.daily_rate,
        pricePerDay: fastAPICar.daily_rate,
        image: fastAPICar.images?.[0] || '/placeholder-car.jpg',
        rating: 4.5,
        reviews: 12,
        features: [fastAPICar.transmission, fastAPICar.fuel_type, `${fastAPICar.seats} seats`],
        available: fastAPICar.is_available,
        location: fastAPICar.city,
        created_at: fastAPICar.created_at,
      };
    } catch (error) {
      throw error;
    }
  },

  getAvailableCars: async (
    pickupDate: string,
    dropDate: string,
    location?: string
  ): Promise<Car[]> => {
    try {
      // For now, just get all cars and filter by availability
      const fastAPICars = await carsAPI.getCars(location);
      return fastAPICars.map(car => ({
        id: car.id,
        name: `${car.brand} ${car.model}`,
        brand: car.brand,
        category: car.fuel_type,
        transmission: car.transmission,
        fuel: car.fuel_type,
        seats: car.seats,
        price_per_day: car.daily_rate,
        pricePerDay: car.daily_rate,
        image: car.images?.[0] || '/placeholder-car.jpg',
        rating: 4.5,
        reviews: 12,
        features: [car.transmission, car.fuel_type, `${car.seats} seats`],
        available: car.is_available,
        location: car.city,
        created_at: car.created_at,
      }));
    } catch (error) {
      return [];
    }
  },

  // Bookings - Keep legacy for now
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
    const response = await api.post(`/api/bookings/${bookingId}/confirm`, {});
    return response.data;
  },

  cancelBooking: async (bookingId: number): Promise<Booking> => {
    const response = await api.post(`/api/bookings/${bookingId}/cancel`, {});
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
      ...(userId && { user_id: userId.toString() }),
      ...(status && { status }),
    });
    
    const response = await api.get(`/api/bookings/?${params}`);
    return response.data;
  },
};

export default api;
