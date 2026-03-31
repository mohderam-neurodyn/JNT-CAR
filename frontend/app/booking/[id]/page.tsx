"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  ChevronLeft, 
  CreditCard, 
  Wallet, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Home, 
  FileText, 
  Shield, 
  Star, 
  Users, 
  Fuel, 
  Settings, 
  Heart,
  Calendar,
  MapPin,
  AlertCircle,
  Loader2
} from "lucide-react";
import { type Car } from "../../../lib/data";
import { apiClient, type User as UserType, type Booking } from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Booking() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [carLoading, setCarLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [bookingData, setBookingData] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    dropDate: "",
    paymentMethod: "card",
  });

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
  });

  const [createdUser, setCreatedUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Load car data
    const loadCar = async () => {
      try {
        const carId = params.id as string;
        // Try to get from backend API first
        try {
          const apiCar = await apiClient.getCar(parseInt(carId));
          setCar({
            ...apiCar,
            id: apiCar.id.toString(),
            pricePerDay: apiCar.price_per_day || 0,
            pricePerHour: apiCar.price_per_hour || 0,
            features: apiCar.features,
            available: apiCar.available,
          });
        } catch (apiError) {
          // Fallback to static data
          const { cars } = await import("../../../lib/data");
          const staticCar = cars.find((c: Car) => c.id === carId);
          if (staticCar) {
            setCar(staticCar);
          } else {
            setError("Car not found");
          }
        }
      } catch (err) {
        setError("Failed to load car information");
      } finally {
        setCarLoading(false);
      }
    };

    loadCar();
  }, [params.id]);

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkAvailability = async () => {
    if (!car || !bookingData.pickupDate || !bookingData.dropDate) return false;

    try {
      const availableCars = await apiClient.getAvailableCars(
        bookingData.pickupDate,
        bookingData.dropDate,
        car.location
      );
      return availableCars.some(c => c.id.toString() === car.id);
    } catch (err) {
      // If API fails, assume available
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (step === 1) {
        // Validate dates and locations
        if (!bookingData.pickupLocation || !bookingData.dropLocation) {
          setError("Please enter pickup and drop locations");
          setLoading(false);
          return;
        }

        if (!bookingData.pickupDate || !bookingData.dropDate) {
          setError("Please select pickup and drop dates");
          setLoading(false);
          return;
        }

        const pickupDate = new Date(bookingData.pickupDate);
        const dropDate = new Date(bookingData.dropDate);

        if (dropDate <= pickupDate) {
          setError("Drop date must be after pickup date");
          setLoading(false);
          return;
        }

        // Check availability
        const isAvailable = await checkAvailability();
        if (!isAvailable) {
          setError("This car is not available for the selected dates");
          setLoading(false);
          return;
        }

        setStep(2);
      } else if (step === 2) {
        // Validate user data
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        // Create or get user
        try {
          let user = createdUser;
          if (!user) {
            user = await apiClient.createUser({
              first_name: userData.firstName,
              last_name: userData.lastName,
              email: userData.email,
              phone: userData.phone,
              license_number: userData.licenseNumber,
              address: userData.address,
            });
            setCreatedUser(user);
          }
          setStep(3);
        } catch (err: any) {
          if (err.response?.data?.detail?.includes("Email already registered")) {
            // Try to get existing user (in a real app, you'd have login)
            setError("Email already registered. Please use a different email or login.");
          } else {
            setError("Failed to create user account");
          }
          setLoading(false);
          return;
        }
      } else if (step === 3) {
        // Create booking
        if (!car || !createdUser) {
          setError("Missing required information");
          setLoading(false);
          return;
        }

        const booking = await apiClient.createBooking({
          user_id: createdUser.id,
          car_id: parseInt(car.id),
          pickup_location: bookingData.pickupLocation,
          drop_location: bookingData.dropLocation,
          pickup_date: bookingData.pickupDate,
          drop_date: bookingData.dropDate,
          payment_method: bookingData.paymentMethod,
        });

        setCreatedBooking(booking);
        setBookingComplete(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to process booking");
    } finally {
      setLoading(false);
    }
  };

  if (carLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading car information...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The car you're looking for doesn't exist or has been removed."}</p>
            <Link href="/cars">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                Browse All Cars
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (bookingComplete && createdBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 text-lg mb-2">
                Your booking for <span className="font-semibold text-blue-600">{car.name}</span> has been confirmed.
              </p>
              <p className="text-gray-600 mb-8">
                Booking ID: <span className="font-bold text-blue-600">#{createdBooking.id}</span>
              </p>
              
              <Card className="bg-blue-50 border-0 mb-8">
                <CardContent className="p-6 text-left">
                  <h3 className="font-bold text-gray-900 mb-4">Booking Details:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup:</span>
                      <span className="font-medium">{createdBooking.pickup_location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop:</span>
                      <span className="font-medium">{createdBooking.drop_location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup Date:</span>
                      <span className="font-medium">{new Date(createdBooking.pickup_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop Date:</span>
                      <span className="font-medium">{new Date(createdBooking.drop_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-blue-600">₹{createdBooking.total_amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-0 mb-8">
                <CardContent className="p-6 text-left">
                  <h3 className="font-bold text-gray-900 mb-4">Next Steps:</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>You will receive a confirmation email shortly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Bring your driving license and ID proof at pickup</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Our team will contact you 24 hours before pickup</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/account">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                    View My Bookings
                  </Button>
                </Link>
                <Link href="/cars">
                  <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                    Browse More Cars
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Car Details
        </Button>

        {/* Progress Steps */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              {[
                { step: 1, label: "Dates & Location", icon: Calendar },
                { step: 2, label: "Personal Info", icon: UserIcon },
                { step: 3, label: "Payment", icon: CreditCard }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step >= item.step
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium transition-colors ${
                    step >= item.step ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {item.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 transition-colors ${
                      step > item.step ? "bg-blue-600" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Car Summary Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl sticky top-24">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-t-2xl">
                  <h3 className="text-white text-xl font-bold">{car.name}</h3>
                  <p className="text-white/90">{car.brand}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{car.rating}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{car.pricePerDay}
                    <span className="text-sm text-gray-600 font-normal">/day</span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    <span>{car.fuel}</span>
                  </div>
                </div>

                {bookingData.pickupDate && bookingData.dropDate && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-sm text-gray-600 mb-2">Estimated Total:</div>
                    <div className="text-xl font-bold text-blue-600">
                      ₹{Math.ceil((new Date(bookingData.dropDate).getTime() - new Date(bookingData.pickupDate).getTime()) / (1000 * 60 * 60 * 24) * car.pricePerDay)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-6">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl font-bold text-gray-900">Select Dates & Locations</CardTitle>
                        <p className="text-gray-600">Choose your pickup/drop locations and rental dates</p>
                      </CardHeader>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="inline w-4 h-4 mr-2" />
                            Pickup Location
                          </label>
                          <input
                            type="text"
                            name="pickupLocation"
                            value={bookingData.pickupLocation}
                            onChange={handleBookingInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter pickup location"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="inline w-4 h-4 mr-2" />
                            Drop Location
                          </label>
                          <input
                            type="text"
                            name="dropLocation"
                            value={bookingData.dropLocation}
                            onChange={handleBookingInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter drop location"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline w-4 h-4 mr-2" />
                            Pickup Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            name="pickupDate"
                            value={bookingData.pickupDate}
                            onChange={handleBookingInputChange}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline w-4 h-4 mr-2" />
                            Drop Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            name="dropDate"
                            value={bookingData.dropDate}
                            onChange={handleBookingInputChange}
                            required
                            min={bookingData.pickupDate || new Date().toISOString().slice(0, 16)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl font-bold text-gray-900">Personal Information</CardTitle>
                        <p className="text-gray-600">Please provide your information for the booking</p>
                      </CardHeader>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="firstName"
                              value={userData.firstName}
                              onChange={handleUserInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="Enter first name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleUserInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter last name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={userData.email}
                              onChange={handleUserInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={userData.phone}
                              onChange={handleUserInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            License Number
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="licenseNumber"
                              value={userData.licenseNumber}
                              onChange={handleUserInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="DL-12-2023-0012345"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <div className="relative">
                            <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              name="address"
                              value={userData.address}
                              onChange={handleUserInputChange}
                              rows={3}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                              placeholder="Enter your complete address"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl font-bold text-gray-900">Payment Method</CardTitle>
                        <p className="text-gray-600">Select your preferred payment method</p>
                      </CardHeader>

                      <div className="space-y-4">
                        {[
                          { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Pay with Visa, Mastercard, or RuPay" },
                          { id: "wallet", name: "Digital Wallet", icon: Wallet, description: "Pay with UPI, Paytm, or other wallets" }
                        ].map((method) => (
                          <label
                            key={method.id}
                            className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={bookingData.paymentMethod === method.id}
                              onChange={handleBookingInputChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <method.icon className="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>

                      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Secure Payment</h4>
                              <p className="text-sm text-gray-600">
                                Your payment information is encrypted and secure. 
                                We never store your card details on our servers.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        className="px-8 py-3 rounded-xl font-semibold"
                        disabled={loading}
                      >
                        Previous
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        step === 3 ? "Complete Booking" : "Continue"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
