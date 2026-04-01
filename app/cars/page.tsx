"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, Star, Users, Fuel, Settings, Search, Heart, MapPin, Loader2, AlertCircle } from "lucide-react";
import { apiClient, type Car } from "@/lib/api";
import { categories, transmissions, fuelTypes, locations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CarListing() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    filterAndSortCars();
  }, [cars, selectedCategory, selectedTransmission, selectedFuel, selectedLocation, sortBy]);

  const loadCars = async () => {
    try {
      setLoading(true);
      const apiCars = await apiClient.getCars();
      
      // Transform API car data to match frontend Car interface
      const transformedCars = apiCars.map(apiCar => ({
        ...apiCar,
        id: apiCar.id.toString(),
        pricePerDay: apiCar.price_per_day || 0,
        pricePerHour: apiCar.price_per_hour || 0,
      }));
      
      setCars(transformedCars);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load cars");
      
      // Fallback to static data if API fails
      try {
        const { cars: staticCars } = await import("../../lib/data");
        setCars(staticCars);
      } catch (staticErr) {
        setError("Failed to load cars from both API and static data");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCars = () => {
    let filtered = cars.filter((car) => {
      if (selectedCategory !== "All" && car.category !== selectedCategory) return false;
      if (selectedTransmission !== "All" && car.transmission !== selectedTransmission) return false;
      if (selectedFuel !== "All" && car.fuel !== selectedFuel) return false;
      if (selectedLocation !== "All" && car.location !== selectedLocation) return false;
      return true;
    });

    // Sort cars
    filtered = [...filtered].sort((a, b) => {
      const aPrice = a.pricePerDay || a.price_per_day || 0;
      const bPrice = b.pricePerDay || b.price_per_day || 0;
      
      if (sortBy === "price-low") return aPrice - bPrice;
      if (sortBy === "price-high") return bPrice - aPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

    setFilteredCars(filtered);
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
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <label className="block font-semibold text-gray-900 mb-3">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    >
                      <option value="All">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block font-semibold text-gray-900 mb-3">Category</label>
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
                  <label className="block font-semibold text-gray-900 mb-3">Transmission</label>
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
                  <label className="block font-semibold text-gray-900 mb-3">Fuel Type</label>
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
                      <option value="rating">Top Rated</option>
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
                        src={car.image}
                        alt={car.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">{car.rating}</span>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">{car.name}</h3>
                        <p className="text-white/90">{car.brand}</p>
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
                            <span>{car.fuel}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">₹{car.pricePerDay || car.price_per_day}</div>
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
