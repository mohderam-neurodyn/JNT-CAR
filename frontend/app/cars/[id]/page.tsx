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
  AlertCircle
} from "lucide-react";
import { apiClient, type Car } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CarDetails() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
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
        const apiCar = await apiClient.getCar(parseInt(carId));
        setCar({
          ...apiCar,
          id: apiCar.id.toString(),
          pricePerDay: apiCar.price_per_day,
          pricePerHour: apiCar.price_per_hour,
        });
      } catch (apiError) {
        // Fallback to static data
        const { cars } = await import("@/lib/data");
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
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    router.push(`/booking/${car?.id}`);
  };

  const handleDateChange = (field: 'pickup' | 'return', value: string) => {
    setSelectedDates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    if (!selectedDates.pickup || !selectedDates.return || !car) return 0;
    
    const pickup = new Date(selectedDates.pickup);
    const returnDate = new Date(selectedDates.return);
    const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    const price = car.pricePerDay || car.price_per_day || 0;
    
    return days * price;
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
            <Card className="border-0 shadow-xl overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h1 className="text-white text-3xl font-bold mb-2">{car.name}</h1>
                  <p className="text-white/90 text-lg">{car.brand} • {car.category}</p>
                </div>
              </div>
            </Card>

            {/* Features */}
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
                        <div className="text-gray-600">{car.transmission}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Fuel className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Fuel Type</div>
                        <div className="text-gray-600">{car.fuel}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Location</div>
                        <div className="text-gray-600">{car.location}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 mb-4">Car Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold text-gray-900">{car.rating}</span>
                  </div>
                  <div className="text-gray-600">({car.reviews} reviews)</div>
                </div>
                
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Join our satisfied customers and experience the best car rental service</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
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
                    ₹{car.pricePerDay || car.price_per_day}
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

                  {totalPrice > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Estimated Total:</span>
                        <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  Book Now
                </Button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Why Book With Us?</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Best price guarantee</li>
                        <li>• 24/7 customer support</li>
                        <li>• Free cancellation</li>
                        <li>• Comprehensive insurance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
