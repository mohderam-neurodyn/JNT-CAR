export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  pricePerDay: number;
  pricePerHour: number;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  available: boolean;
  location: string;
}

export const cars: Car[] = [
  {
    id: "1",
    name: "Swift Dzire",
    brand: "Maruti Suzuki",
    category: "Sedan",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    pricePerDay: 1499,
    pricePerHour: 99,
    image: "https://images.unsplash.com/photo-1547731269-e4073e054f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzZWRhbiUyMGludGVyaW9yfGVufDF8fHx8MTc3NDcxMDM5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 234,
    features: ["Bluetooth", "AUX", "AC", "Power Steering"],
    available: true,
    location: "Mumbai"
  },
  {
    id: "2",
    name: "Creta",
    brand: "Hyundai",
    category: "SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    pricePerDay: 2499,
    pricePerHour: 149,
    image: "https://images.unsplash.com/photo-1649296303096-38245976e01e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHN1diUyMGNhcnxlbnwxfHx8fDE3NzQ2MTI4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 189,
    features: ["Sunroof", "Leather Seats", "Touchscreen", "Parking Camera"],
    available: true,
    location: "Delhi"
  },
  {
    id: "3",
    name: "Baleno",
    brand: "Maruti Suzuki",
    category: "Hatchback",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    pricePerDay: 1299,
    pricePerHour: 89,
    image: "https://images.unsplash.com/photo-1630151318688-1fb92c793a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBoYXRjaGJhY2slMjBjYXJ8ZW58MXx8fHwxNzc0NzEwMzk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3,
    reviews: 156,
    features: ["AC", "Music System", "Power Windows", "Central Locking"],
    available: true,
    location: "Bangalore"
  },
  {
    id: "4",
    name: "City",
    brand: "Honda",
    category: "Sedan",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    pricePerDay: 1999,
    pricePerHour: 129,
    image: "https://images.unsplash.com/photo-1764605206511-7a649d9df63b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGx1eHVyeSUyMHNlZGFuJTIwY2FyfGVufDF8fHx8MTc3NDcwNzk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 298,
    features: ["Cruise Control", "Alloy Wheels", "Touchscreen", "Reverse Camera"],
    available: true,
    location: "Mumbai"
  },
  {
    id: "5",
    name: "i20",
    brand: "Hyundai",
    category: "Hatchback",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    pricePerDay: 1599,
    pricePerHour: 109,
    image: "https://images.unsplash.com/photo-1743809809295-cfd2a2e3d40f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwY29tcGFjdCUyMGNhcnxlbnwxfHx8fDE3NzQ2MzQ5NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    reviews: 178,
    features: ["Touchscreen", "Wireless Charger", "AC", "Bluetooth"],
    available: true,
    location: "Pune"
  },
  {
    id: "6",
    name: "XUV500",
    brand: "Mahindra",
    category: "SUV",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 7,
    pricePerDay: 2299,
    pricePerHour: 139,
    image: "https://images.unsplash.com/photo-1767949374180-e5895daa1990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBzdXYlMjB2ZWhpY2xlfGVufDF8fHx8MTc3NDcxMDM5NXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 142,
    features: ["7 Seater", "Cruise Control", "Touchscreen", "Parking Sensors"],
    available: true,
    location: "Delhi"
  },
];

export const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Pune",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Ahmedabad"
];

export const categories = ["All", "Sedan", "SUV", "Hatchback"];
export const transmissions = ["All", "Manual", "Automatic"];
export const fuelTypes = ["All", "Petrol", "Diesel"];
