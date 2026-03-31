"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  Car,
  AlertCircle,
  Loader2
} from "lucide-react";
import { apiClient, type Booking, type User as UserType } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Account() {
  const [user, setUser] = useState<UserType | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // In a real app, you'd get user ID from auth context
    // For demo, we'll use a hardcoded user or create one
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // For demo purposes, create/get a demo user
      let demoUser: UserType;
      try {
        demoUser = await apiClient.getUser(1); // Try to get existing user
      } catch {
        // Create demo user if doesn't exist
        demoUser = await apiClient.createUser({
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "+919876543210",
          license_number: "DL-01-2023-0012345",
          address: "123 Main St, Delhi, India"
        });
      }
      
      setUser(demoUser);
      
      // Load user's bookings
      const userBookings = await apiClient.getUserBookings(demoUser.id);
      setBookings(userBookings);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      await apiClient.cancelBooking(bookingId);
      // Refresh bookings
      if (user) {
        const userBookings = await apiClient.getUserBookings(user.id);
        setBookings(userBookings);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to cancel booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile and bookings</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">{user.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span>{user.license_number}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Link href="/cars">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                          Book New Car
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Your Bookings
                  </div>
                  <span className="text-sm text-gray-600">
                    {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">You haven't made any bookings yet. Book your first car to get started!</p>
                    <Link href="/cars">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                        Browse Cars
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {booking.car?.name || 'Car Booking'}
                              </h3>
                              <p className="text-gray-600">
                                Booking ID: #{booking.id}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">
                                  <strong>Pickup:</strong> {booking.pickup_location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">
                                  <strong>Drop:</strong> {booking.drop_location}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">
                                  <strong>Pickup:</strong> {new Date(booking.pickup_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">
                                  <strong>Drop:</strong> {new Date(booking.drop_date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">₹{booking.total_amount}</div>
                              <div className="text-sm text-gray-600">Total Amount</div>
                            </div>
                            <div className="flex gap-2">
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelBooking(booking.id)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Cancel
                                </Button>
                              )}
                              <Link href={`/booking/${booking.car_id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
