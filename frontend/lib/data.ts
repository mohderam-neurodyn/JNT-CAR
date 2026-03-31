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
    name: "Honda City",
    brand: "Honda",
    category: "Sedan",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    pricePerDay: 1500,
    pricePerHour: 100,
    image: "https://images.unsplash.com/photo-1550355241-4c4ca8f0f7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzQ3MTAzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reviews: 128,
    features: ["Air Conditioning", "Power Steering", "ABS", "Airbags"],
    available: true,
    location: "Delhi"
  },
  {
    id: "2",
    name: "Maruti Swift",
    brand: "Maruti Suzuki",
    category: "Hatchback",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    pricePerDay: 1200,
    pricePerHour: 80,
    image: "https://images.unsplash.com/photo-1494976384436-d6f0bfe5c9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzQ3MTAzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3,
    reviews: 96,
    features: ["Air Conditioning", "Power Steering", "Central Locking"],
    available: true,
    location: "Delhi"
  },
  {
    id: "3",
    name: "Toyota Innova",
    brand: "Toyota",
    category: "SUV",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 7,
    pricePerDay: 2500,
    pricePerHour: 150,
    image: "https://images.unsplash.com/photo-1542362567-b07e5e58a68a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzQ3MTAzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reviews: 203,
    features: ["Air Conditioning", "Power Steering", "ABS", "Airbags", "GPS"],
    available: true,
    location: "Delhi"
  },
  {
    id: "4",
    name: "Hyundai Creta",
    brand: "Hyundai",
    category: "SUV",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    pricePerDay: 2000,
    pricePerHour: 120,
    image: "https://images.unsplash.com/photo-15493983462-1a9e1cd98276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzQ3MTAzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 156,
    features: ["Air Conditioning", "Power Steering", "ABS", "Airbags", "Touchscreen"],
    available: true,
    location: "Mumbai"
  },
  {
    id: "5",
    name: "Tata Nexon",
    brand: "Tata",
    category: "SUV",
    transmission: "Manual",
    fuel: "Electric",
    seats: 5,
    pricePerDay: 1800,
    pricePerHour: 110,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzQ3MTAzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    reviews: 89,
    features: ["Air Conditioning", "Power Steering", "ABS", "Airbags", "Regenerative Braking"],
    available: true,
    location: "Mumbai"
  },
  {
    id: "6",
    name: "Mahindra Thar",
    brand: "Mahindra",
    category: "SUV",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 4,
    pricePerDay: 2200,
    pricePerHour: 130,
    image: "https://images.unsplash.com/photo-1606664515524-ed12e874c98d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzQ3MTAzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 267,
    features: ["Air Conditioning", "Power Steering", "4WD", "ABS", "Airbags"],
    available: true,
    location: "Bangalore"
  }
];

export const categories = ["All", "Sedan", "SUV", "Hatchback", "Luxury"];
export const transmissions = ["All", "Manual", "Automatic"];
export const fuelTypes = ["All", "Petrol", "Diesel", "Electric"];
export const locations = ["All", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];
