'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { carsAPI, type FastAPICar, CarFormData } from '@/lib/api';
import { 
  Car, 
  Plus, 
  Trash2, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {
  const [formData, setFormData] = useState<CarFormData>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    daily_rate: 0,
    transmission: 'manual',
    fuel_type: 'petrol',
    seats: 5,
    description: '',
    images: [''],
    latitude: 28.6139,
    longitude: 77.2090,
    address: '',
    city: 'Delhi',
  });
  
  const [cars, setCars] = useState<FastAPICar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCarsLoading, setIsCarsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('add-car');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/');
      return;
    }

    if (isAdmin) {
      loadCars();
    }
  }, [user, isAdmin, router]);

  const loadCars = async () => {
    try {
      setIsCarsLoading(true);
      const carsData = await carsAPI.getCars();
      setCars(carsData);
    } catch (err) {
      console.error('Failed to load cars:', err);
    } finally {
      setIsCarsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Filter out empty images
      const filteredFormData = {
        ...formData,
        images: (formData.images || []).filter(img => img.trim() !== '')
      };

      await carsAPI.createCar(filteredFormData);
      setSuccess('Car added successfully!');
      
      // Reset form
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        daily_rate: 0,
        transmission: 'manual',
        fuel_type: 'petrol',
        seats: 5,
        description: '',
        images: [''],
        latitude: 28.6139,
        longitude: 77.2090,
        address: '',
        city: 'Delhi',
      });
      
      // Reload cars
      await loadCars();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add car');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
      await carsAPI.deleteCar(carId);
      setSuccess('Car deleted successfully!');
      await loadCars();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete car');
    }
  };

  const handleToggleAvailability = async (carId: string, currentStatus: boolean) => {
    try {
      // Update car availability status
      const carData: any = { is_available: !currentStatus };
      await carsAPI.updateCar(carId, carData);
      setSuccess(`Car ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
      await loadCars();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update car');
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    const currentImages = formData.images || [];
    setFormData({ ...formData, images: [...currentImages, ''] });
  };

  const removeImageField = (index: number) => {
    const currentImages = formData.images || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || car.city === filterCity;
    return matchesSearch && matchesCity;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage cars, bookings, and system settings</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="/dashboard">
                <Button variant="outline">User View</Button>
              </Link>
              <Link href="/">
                <Button>Homepage</Button>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter(c => c.is_available).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unavailable</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter(c => !c.is_available).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {[...new Set(cars.map(c => c.city))].length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-car">Add New Car</TabsTrigger>
            <TabsTrigger value="manage-cars">Manage Cars</TabsTrigger>
          </TabsList>

          {/* Add Car Tab */}
          <TabsContent value="add-car">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Add New Car</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        required
                        placeholder="e.g., Honda, Toyota, Maruti"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        required
                        placeholder="e.g., City, Corolla, Swift"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        required
                        min="2010"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="daily_rate">Daily Rate (₹)</Label>
                      <Input
                        id="daily_rate"
                        type="number"
                        value={formData.daily_rate}
                        onChange={(e) => setFormData({ ...formData, daily_rate: parseFloat(e.target.value) })}
                        required
                        min="0"
                        step="100"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="transmission">Transmission</Label>
                      <Select value={formData.transmission} onValueChange={(value: 'manual' | 'automatic') => setFormData({ ...formData, transmission: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="fuel_type">Fuel Type</Label>
                      <Select value={formData.fuel_type} onValueChange={(value: 'petrol' | 'diesel' | 'electric') => setFormData({ ...formData, fuel_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="seats">Number of Seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        value={formData.seats}
                        onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                        required
                        min="2"
                        max="8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        placeholder="e.g., Delhi, Mumbai, Bangalore"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Complete pickup address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the car features, condition, etc."
                    />
                  </div>

                  <div>
                    <Label>Car Images</Label>
                    <div className="space-y-2">
                      {(formData.images || []).map((image, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            placeholder="Enter image URL"
                          />
                          {(formData.images || []).length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImageField(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addImageField}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Image
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding Car...
                      </div>
                    ) : (
                      'Add Car'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Cars Tab */}
          <TabsContent value="manage-cars">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-xl font-bold text-gray-900">Manage Cars</CardTitle>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterCity} onValueChange={setFilterCity}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="All Cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {[...new Set(cars.map(c => c.city))].map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isCarsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading cars...</p>
                  </div>
                ) : filteredCars.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
                    <p className="text-gray-600">No cars match your search criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCars.map((car) => (
                      <div key={car.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={car.images?.[0] || '/placeholder-car.jpg'}
                              alt={`${car.brand} ${car.model}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{car.brand} {car.model}</h3>
                              <p className="text-sm text-gray-600">{car.year} • {car.city}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={car.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {car.is_available ? "Available" : "Unavailable"}
                                </Badge>
                                <span className="text-sm text-gray-600">₹{car.daily_rate}/day</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailability(car.id, car.is_available)}
                            >
                              {car.is_available ? "Disable" : "Enable"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCar(car.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
