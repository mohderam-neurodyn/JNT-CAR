"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Clock, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFormData {
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  useLocation: boolean;
}

export default function BookingSearchWidget() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState<SearchFormData>({
    location: "",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "10:00",
    useLocation: false,
  });

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setFormData(prev => ({
            ...prev,
            location: "Current Location",
            useLocation: true,
          }));
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          alert("Unable to get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      useLocation: field === 'location' ? false : prev.useLocation,
    }));
  };

  const handleSearch = () => {
    if (!formData.location || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set('location', formData.location);
    searchParams.set('startDate', formData.startDate);
    searchParams.set('endDate', formData.endDate);
    searchParams.set('startTime', formData.startTime);
    searchParams.set('endTime', formData.endTime);

    if (userLocation && formData.useLocation) {
      searchParams.set('lat', userLocation.lat.toString());
      searchParams.set('lng', userLocation.lng.toString());
      searchParams.set('nearby', 'true');
    }

    router.push(`/cars?${searchParams.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Car</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative">
            <Label htmlFor="location" className="sr-only">Pickup Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                id="location"
                type="text"
                placeholder="Pickup Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLocationClick}
                disabled={isLoading}
                className="absolute right-1 top-1 p-2 h-8 w-8 text-gray-400 hover:text-blue-600 transition-colors"
                title="Use my current location"
              >
                <Locate className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Start Date */}
          <div className="relative">
            <Label htmlFor="startDate" className="sr-only">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                id="startDate"
                type="date"
                min={today}
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="relative">
            <Label htmlFor="endDate" className="sr-only">End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                id="endDate"
                type="date"
                min={formData.startDate || today}
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {isLoading ? "Searching..." : "Search Cars"}
          </Button>
        </div>

        {/* Time Selection */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Pickup Time:
            </Label>
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Select value={formData.startTime} onValueChange={(value) => handleInputChange('startTime', value)}>
                <SelectTrigger className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Return Time:
            </Label>
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Select value={formData.endTime} onValueChange={(value) => handleInputChange('endTime', value)}>
                <SelectTrigger className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
