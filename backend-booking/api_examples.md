# JNT CAR MVP - API Usage Examples

## Base URL
```
http://localhost:8000
```

## Authentication Endpoints

### 1. Register New User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-01T12:00:00"
  }
}
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jntcar.com",
    "password": "admin123"
  }'
```

### 3. Get Current User Info
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Car Management Endpoints (Admin Only)

### 1. Create New Car
```bash
curl -X POST "http://localhost:8000/api/cars" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2022,
    "daily_rate": 50.00,
    "transmission": "automatic",
    "fuel_type": "petrol",
    "seats": 5,
    "description": "Comfortable sedan perfect for city driving",
    "images": [
      "https://example.com/car1.jpg",
      "https://example.com/car2.jpg"
    ],
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "123 MG Road, Bangalore",
    "city": "Bangalore"
  }'
```

### 2. Get All Cars
```bash
curl -X GET "http://localhost:8000/api/cars?city=Bangalore&limit=10"
```

### 3. Get Car by ID
```bash
curl -X GET "http://localhost:8000/api/cars/car-uuid-here"
```

### 4. Update Car
```bash
curl -X PUT "http://localhost:8000/api/cars/car-uuid-here" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "daily_rate": 55.00,
    "is_available": false
  }'
```

### 5. Delete Car
```bash
curl -X DELETE "http://localhost:8000/api/cars/car-uuid-here" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Geo-location Endpoints

### 1. Get Nearby Cars
```bash
curl -X GET "http://localhost:8000/api/cars/nearby?lat=12.9716&lng=77.5946&radius=10&city=Bangalore"
```

**Response:**
```json
[
  {
    "id": "car-uuid-here",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2022,
    "daily_rate": 50.00,
    "transmission": "automatic",
    "fuel_type": "petrol",
    "seats": 5,
    "description": "Comfortable sedan perfect for city driving",
    "images": [
      "https://example.com/car1.jpg",
      "https://example.com/car2.jpg"
    ],
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "123 MG Road, Bangalore",
    "city": "Bangalore",
    "is_available": true,
    "owner_id": "admin-uuid-here",
    "created_at": "2024-01-01T12:00:00",
    "distance_km": 0.5
  }
]
```

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
```bash
# For local development
export DATABASE_URL="postgresql://postgres:password@localhost:5432/jntcar_booking"

# For Render production
export DATABASE_URL="your-render-database-url"
```

### 3. Create Admin User
```bash
python create_admin.py
```

### 4. Run the Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing with Postman

Import the following collection into Postman:

```json
{
  "info": {
    "name": "JNT CAR MVP",
    "description": "API endpoints for JNT Car Rental MVP"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## Common Error Responses

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Admin access required"
}
```

### 404 Not Found
```json
{
  "detail": "Car not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```
