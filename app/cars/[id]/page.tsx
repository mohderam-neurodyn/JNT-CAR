"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  Users, 
  Fuel, 
  Settings, 
  MapPin, 
  Calendar, 
  Shield, 
  Heart,
  ChevronLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  Phone,
  Mail
} from "lucide-react";
import { carsAPI, type FastAPICar } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CarDetails() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<FastAPICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDates, setSelectedDates] = useState({
    pickup: "",
    return: ""
  });

  useEffect(() => {
    loadCar();
  }, [params.id]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const carId = params.id as string;
      
      // Try to get from backend API first
      try {
        const apiCar = await carsAPI.getCar(carId);
        setCar(apiCar);
      } catch (apiError) {
        // Fallback to static data
        const { cars } = await import("../../../lib/data");
        const staticCar = cars.find((c: any) => c.id === carId);
        if (staticCar) {
          setCar(staticCar as any);
        } else {
          setError("Car not found");
        }
      }
    } catch (err) {
      setError("Failed to load car information");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedDates.pickup || !selectedDates.return) {
      setError("Please select pickup and return dates");
      return;
    }
    
    // Pass dates to booking page
    const queryParams = new URLSearchParams({
      pickup: selectedDates.pickup,
      return: selectedDates.return,
    });
    router.push(`/booking/${car?.id}?${queryParams.toString()}`);
  };

  const handleDateChange = (field: 'pickup' | 'return', value: string) => {
    setSelectedDates(prev => ({
      ...prev,
      [field]: value
    }));
    setError(""); // Clear error when dates are selected
  };

  const calculateTotal = () => {
    if (!selectedDates.pickup || !selectedDates.return || !car) return 0;
    
    const pickup = new Date(selectedDates.pickup);
    const returnDate = new Date(selectedDates.return);
    const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return 0;
    
    return days * car.daily_rate;
  };

  const calculateDays = () => {
    if (!selectedDates.pickup || !selectedDates.return) return 0;
    
    const pickup = new Date(selectedDates.pickup);
    const returnDate = new Date(selectedDates.return);
    return Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading car details...</p>
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

  const totalPrice = calculateTotal();
  const totalDays = calculateDays();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Cars
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Car Details */}
          <div className="lg:col-span-2">
            {/* Main Image Gallery */}
            <Card className="border-0 shadow-xl overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={car.images?.[0] || '/placeholder-car.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                {car.is_available && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">Available</Badge>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h1 className="text-white text-3xl font-bold mb-2">{car.brand} {car.model}</h1>
                  <p className="text-white/90 text-lg">{car.year} • {car.city}</p>
                </div>
              </div>
              
              {/* Additional Images */}
              {car.images && car.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {car.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${car.brand} ${car.model} ${index + 2}`}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="border-0 shadow-xl mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this vehicle</h2>
                <p className="text-gray-700 leading-relaxed">
                  {car.description || `Experience the comfort and reliability of the ${car.brand} ${car.model}. This well-maintained vehicle offers a perfect blend of performance, efficiency, and style for your journey. Whether you're planning a city trip or a long-distance adventure, this car provides the ideal solution for your transportation needs.`}
                </p>
              </CardContent>
            </Card>

            {/* Features & Specifications */}
            <Card className="border-0 shadow-xl mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Specifications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Seating Capacity</div>
                        <div className="text-gray-600">{car.seats} Seats</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Settings className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Transmission</div>
                        <div className="text-gray-600 capitalize">{car.transmission}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Fuel className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Fuel Type</div>
                        <div className="text-gray-600 capitalize">{car.fuel_type}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Location</div>
                        <div className="text-gray-600">{car.address}, {car.city}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Year</div>
                        <div className="text-gray-600">{car.year}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Rating</div>
                        <div className="text-gray-600">4.5 out of 5</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 mb-4">Standard Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Central Locking', 'Music System'].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Contact */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pickup Location</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{car.address}</h3>
                      <p className="text-gray-600 mb-4">{car.city}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>support@jntcar.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl sticky top-24">
              <div className="relative">
                <img
                  src={car.images?.[0] || '/placeholder-car.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-t-2xl">
                  <h3 className="text-white text-xl font-bold">{car.brand} {car.model}</h3>
                  <p className="text-white/90">{car.year}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">4.5</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{car.daily_rate}
                    <span className="text-sm text-gray-600 font-normal">/day</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700 text-xs">{error}</span>
                  </div>
                )}
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Pickup Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={selectedDates.pickup}
                      onChange={(e) => handleDateChange('pickup', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Return Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={selectedDates.return}
                      onChange={(e) => handleDateChange('return', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min={selectedDates.pickup || new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  {totalDays > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Daily Rate:</span>
                          <span className="font-semibold">₹{car.daily_rate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Rental Days:</span>
                          <span className="font-semibold">{totalDays}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-semibold">Total Amount:</span>
                            <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleBookNow}
                  disabled={!car.is_available}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  {car.is_available ? 'Book Now' : 'Not Available'}
                </Button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Why Book With Us?</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Best price guarantee</li>
                        <li>• 24/7 customer support</li>
                        <li>• Free cancellation up to 24h</li>
                        <li>• Comprehensive insurance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Instant confirmation</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Book now and receive instant confirmation with all booking details
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
