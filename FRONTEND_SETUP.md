# JNT CAR Frontend - Next.js Integration

## Overview

Complete Next.js frontend that integrates with the FastAPI backend for JNT CAR rental platform.

## Features Implemented

### 1. Authentication System
- **Login Page** (`/login`) - User authentication with JWT tokens
- **Register Page** (`/register`) - New user registration
- **JWT Token Storage** - Tokens stored in localStorage
- **Auto-logout** - Automatic logout on token expiration

### 2. Admin Panel
- **Add Car Form** (`/admin`) - Complete car creation form
- **Fields**: brand, model, price, images, location (lat/lng), city
- **Admin-only Access** - Protected routes for admin users

### 3. Nearby Cars Page
- **Geolocation** - Automatic user location detection
- **Distance Display** - Shows distance from user to each car
- **Car Cards** - Displays car images, details, and pricing
- **Real-time Search** - Calls `/api/cars/nearby` endpoint

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Default Credentials

### Admin User
- Email: `admin@jntcar.com`
- Password: `admin123`

### Regular User
- Register via `/register` page

## Page Routes

### Public Pages
- `/` - Home page with nearby cars (requires location)
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/admin` - Admin panel (admin only)

## API Integration

### Authentication Endpoints
```javascript
// Login
POST /api/auth/login
{
  "email": "admin@jntcar.com",
  "password": "admin123"
}

// Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Cars Endpoints
```javascript
// Get nearby cars
GET /api/cars/nearby?lat=12.9716&lng=77.5946&radius=10

// Create car (admin only)
POST /api/cars
{
  "brand": "Toyota",
  "model": "Camry",
  "year": 2022,
  "daily_rate": 50.00,
  "transmission": "automatic",
  "fuel_type": "petrol",
  "seats": 5,
  "description": "Comfortable sedan",
  "images": ["https://example.com/car.jpg"],
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address": "123 MG Road, Bangalore",
  "city": "Bangalore"
}
```

## Key Features

### Authentication Flow
1. User submits login/register form
2. JWT token received from FastAPI backend
3. Token stored in localStorage
4. Token automatically added to all API requests
5. Auto-redirect to login on 401 errors

### Geolocation Integration
1. Browser requests user location on page load
2. Location coordinates sent to `/api/cars/nearby`
3. Cars displayed with distance from user
4. Fallback option for manual location retry

### Admin Car Management
1. Admin users see "Add Car" button in header
2. Comprehensive form with all car fields
3. Image URLs support (multiple images)
4. Location coordinates for geo-search
5. Success/error feedback with form reset

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Grid layout for car cards
- Responsive navigation and forms
- Touch-friendly interface

## Development Notes

### File Structure
```
app/
├── login/page.tsx          # Login form
├── register/page.tsx        # Registration form
├── admin/page.tsx           # Admin panel
├── page.tsx                # Home/nearby cars
└── layout.tsx              # Root layout with AuthProvider

contexts/
└── AuthContext.tsx         # Authentication state management

lib/
└── api.ts                 # API client with axios
```

### State Management
- React Context for authentication
- Local state for forms and data
- localStorage for JWT persistence

### Error Handling
- API error responses displayed to users
- Form validation with user-friendly messages
- Network error handling with retry options

## Production Deployment

### Environment Variables
```bash
# Production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Testing the Integration

### 1. Test Authentication
- Register a new user
- Login with the credentials
- Verify token is stored in localStorage
- Check user info displayed in header

### 2. Test Admin Features
- Login as admin (admin@jntcar.com / admin123)
- Access `/admin` page
- Add a new car with all fields
- Verify car appears in nearby cars list

### 3. Test Geolocation
- Allow browser location access
- Verify nearby cars load automatically
- Check distance calculations
- Test location retry functionality

### 4. Test API Integration
- Check browser network tab for API calls
- Verify JWT tokens in request headers
- Test error handling scenarios

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows frontend origin
2. **Location Denied**: Enable location services in browser
3. **Token Issues**: Check localStorage for valid JWT
4. **API Connection**: Verify backend is running on correct port

### Debug Tips
- Check browser console for errors
- Verify network requests in DevTools
- Test API endpoints directly via Swagger UI
- Check environment variables are correctly set
