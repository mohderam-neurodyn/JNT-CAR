"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, Star, Users, Fuel, Settings, Search, Heart, MapPin, Loader2, AlertCircle, Locate } from "lucide-react";
import { carsAPI, type FastAPICar } from "@/lib/api";
import { categories, transmissions, fuelTypes, locations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SearchFilters {
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  lat?: number;
  lng?: number;
  nearby?: boolean;
}

export default function CarListing() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<FastAPICar[]>([]);
  const [filteredCars, setFilteredCars] = useState<FastAPICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    // Parse URL search parameters
    const location = searchParams.get('location') || "";
    const startDate = searchParams.get('startDate') || "";
    const endDate = searchParams.get('endDate') || "";
    const startTime = searchParams.get('startTime') || "";
    const endTime = searchParams.get('endTime') || "";
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const nearby = searchParams.get('nearby');

    setSearchFilters({
      location,
      startDate,
      endDate,
      startTime,
      endTime,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      nearby: nearby === "true",
    });

    if (location) {
      setSelectedLocation(location);
    }

    loadCars();
  }, [searchParams]);

  useEffect(() => {
    filterAndSortCars();
  }, [cars, selectedCategory, selectedTransmission, selectedFuel, selectedLocation, sortBy, priceRange]);

  const loadCars = async () => {
    try {
      setLoading(true);
      let apiCars: FastAPICar[] = [];

      // Use nearby search if location coordinates are provided
      if (searchFilters.lat && searchFilters.lng && searchFilters.nearby) {
        apiCars = await carsAPI.getNearbyCars(
          searchFilters.lat,
          searchFilters.lng,
          10, // 10km radius
          searchFilters.location
        );
      } else {
        // Regular search with city filter
        apiCars = await carsAPI.getCars(searchFilters.location || undefined);
      }

      setCars(apiCars);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load cars");
      
      // Fallback to static data if API fails
      try {
        const { cars: staticCars } = await import("../../lib/data");
        setCars(staticCars as any);
      } catch (staticErr) {
        setError("Failed to load cars from both API and static data");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCars = () => {
    let filtered = cars.filter((car) => {
      // Category filter
      if (selectedCategory !== "All") {
        const carCategory = car.fuel_type === "electric" ? "Electric" : 
                           car.seats >= 7 ? "SUV" : 
                           car.brand.toLowerCase().includes("luxury") ? "Luxury" : "Sedan";
        if (carCategory !== selectedCategory) return false;
      }
      
      // Transmission filter
      if (selectedTransmission !== "All" && car.transmission !== selectedTransmission.toLowerCase()) return false;
      
      // Fuel filter
      if (selectedFuel !== "All" && car.fuel_type !== selectedFuel.toLowerCase()) return false;
      
      // Location filter
      if (selectedLocation !== "All" && car.city !== selectedLocation) return false;
      
      // Price filter
      if (car.daily_rate < priceRange[0] || car.daily_rate > priceRange[1]) return false;
      
      return true;
    });

    // Sort cars
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.daily_rate - b.daily_rate;
      if (sortBy === "price-high") return b.daily_rate - a.daily_rate;
      if (sortBy === "distance" && a.distance_km && b.distance_km) return a.distance_km - b.distance_km;
      return 0;
    });

    setFilteredCars(filtered);
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const nearbyCars = await carsAPI.getNearbyCars(
              position.coords.latitude,
              position.coords.longitude,
              10
            );
            setCars(nearbyCars);
            setSelectedLocation("Nearby");
          } catch (error) {
            setError("Failed to get nearby cars");
          }
        },
        (error) => {
          setError("Unable to get your location");
        }
      );
    } else {
      setError("Geolocation is not supported");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading available cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Summary */}
        {searchFilters.location && (
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Search:</span> {searchFilters.location}
                  {searchFilters.startDate && searchFilters.endDate && (
                    <> • {searchFilters.startDate} to {searchFilters.endDate}</>
                  )}
                </div>
                <Link href="/">
                  <Button variant="outline" size="sm">Modify Search</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modern Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Ride
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our premium collection of self-drive cars
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <span className="text-yellow-700 text-sm">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Modern Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedTransmission("All");
                      setSelectedFuel("All");
                      setSelectedLocation("All");
                      setPriceRange([0, 5000]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-semibold text-gray-900">Location</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLocationDetect}
                      className="text-blue-600 hover:text-blue-700 p-1 h-8 w-8"
                      title="Use my current location"
                    >
                      <Locate className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    >
                      <option value="All">All Locations</option>
                      <option value="Nearby">Near Me</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <Label className="font-semibold text-gray-900 mb-3 block">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="font-semibold text-gray-900 mb-3 block">Category</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transmission Filter */}
                <div className="mb-6">
                  <Label className="font-semibold text-gray-900 mb-3 block">Transmission</Label>
                  <div className="space-y-2">
                    {transmissions.map((transmission) => (
                      <label
                        key={transmission}
                        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="transmission"
                          value={transmission}
                          checked={selectedTransmission === transmission}
                          onChange={(e) => setSelectedTransmission(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{transmission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fuel Filter */}
                <div className="mb-6">
                  <Label className="font-semibold text-gray-900 mb-3 block">Fuel Type</Label>
                  <div className="space-y-2">
                    {fuelTypes.map((fuel) => (
                      <label
                        key={fuel}
                        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="fuel"
                          value={fuel}
                          checked={selectedFuel === fuel}
                          onChange={(e) => setSelectedFuel(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modern Cars Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Count Bar */}
            <Card className="border-0 shadow-sm mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-gray-600">
                    Showing <span className="font-bold text-blue-600">{filteredCars.length}</span> amazing cars
                  </p>
                  <div className="flex items-center gap-3">
                    <label className="text-gray-600 font-medium">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      {searchFilters.nearby && <option value="distance">Distance</option>}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modern Cars List */}
            {filteredCars.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600">
                    No cars match your filters. Try adjusting your criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCars.map((car) => (
                  <Card key={car.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden">
                    <div className="relative">
                      <img
                        src={car.images?.[0] || '/placeholder-car.jpg'}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">4.5</span>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      {car.distance_km && (
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <span className="text-xs font-semibold text-blue-600">
                            {car.distance_km.toFixed(1)} km away
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">{car.brand} {car.model}</h3>
                        <p className="text-white/90">{car.year} • {car.city}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{car.seats}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4" />
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel className="w-4 h-4" />
                            <span>{car.fuel_type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">₹{car.daily_rate}</div>
                          <div className="text-sm text-gray-600">per day</div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/cars/${car.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/booking/${car.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
