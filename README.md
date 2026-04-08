# 🚗 JNT CAR - Complete Car Booking System

A modern, full-stack car rental booking system built with Next.js frontend and FastAPI backend, featuring real-time availability checking, user management, and seamless booking experience.

## 🌟 Features

### 🚗 **Frontend (Next.js)**
- **Modern UI/UX** with Tailwind CSS and animations
- **Car Listings** with advanced filtering and sorting
- **Real-time Availability** checking
- **Multi-step Booking Flow** with form validation
- **User Account Management** with booking history
- **Responsive Design** for all devices
- **Interactive Components** with hover effects and transitions

### 🔧 **Backend (FastAPI)**
- **RESTful API** with comprehensive endpoints
- **PostgreSQL Database** with SQLAlchemy ORM
- **User Management** with secure data handling
- **Booking System** with status tracking
- **Real-time Availability** prevention of double bookings
- **Database Migrations** with Alembic
- **API Documentation** with Swagger/OpenAPI

### 📊 **Database Schema**
- **Users**: Personal information, licenses, contact details
- **Cars**: Vehicle details, pricing, availability, features
- **Bookings**: Complete booking lifecycle with status tracking

## 🏗️ Architecture

```
├── frontend/                 # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   ├── cars/
│   │   │   ├── page.tsx     # Car listings
│   │   │   └── [id]/page.tsx # Car details
│   │   ├── booking/
│   │   │   └── [id]/page.tsx # Booking flow
│   │   └── account/page.tsx  # User account
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   ├── data.ts         # Static data (fallback)
│   │   └── utils.ts        # Utilities
│   └── components/ui/       # Reusable UI components
├── backend-booking/         # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── crud.py         # CRUD operations
│   │   └── database.py     # Database configuration
│   ├── alembic/             # Database migrations
│   └── seed_data.py        # Sample data
└── backend/                 # Original backend (legacy)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL 12+
- npm or yarn

### 1. **Backend Setup**

```bash
# Navigate to backend
cd backend-booking

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your database configuration

# Setup PostgreSQL database
createdb jntcar_booking

# Run database migrations
alembic upgrade head

# Seed sample data
python seed_data.py

# Start the backend server
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### 2. **Frontend Setup**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Setup environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the frontend server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📱 API Endpoints

### **Users**
- `POST /api/users/` - Create new user
- `GET /api/users/{user_id}` - Get user details
- `GET /api/users/{user_id}/bookings` - Get user's bookings

### **Cars**
- `GET /api/cars/` - List all cars
- `GET /api/cars/{car_id}` - Get car details
- `GET /api/cars/available` - Check available cars
- `POST /api/cars/` - Add new car (admin)

### **Bookings**
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/` - List bookings
- `GET /api/bookings/{booking_id}` - Get booking details
- `PUT /api/bookings/{booking_id}` - Update booking
- `POST /api/bookings/{booking_id}/confirm` - Confirm booking
- `POST /api/bookings/{booking_id}/cancel` - Cancel booking

### **Health Check**
- `GET /` - API health status

## 🎯 Complete Booking Flow

### 1. **Browse Cars** (`/cars`)
- View all available cars with filtering options
- Sort by price, rating, or featured
- Real-time availability checking

### 2. **View Details** (`/cars/[id]`)
- Comprehensive car information
- Features and specifications
- Customer reviews
- Quick booking option

### 3. **Book Car** (`/booking/[id]`)
- **Step 1**: Select dates and locations
- **Step 2**: Enter personal information
- **Step 3**: Choose payment method
- Real-time availability validation
- Automatic price calculation

### 4. **Manage Account** (`/account`)
- View booking history
- Cancel pending bookings
- Update profile information

## 🔧 Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

### **Cars Table**
```sql
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    fuel VARCHAR(20) NOT NULL,
    seats INTEGER NOT NULL,
    price_per_day INTEGER NOT NULL,
    price_per_hour INTEGER NOT NULL,
    image VARCHAR(500) NOT NULL,
    rating INTEGER NOT NULL,
    reviews INTEGER NOT NULL,
    features TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

### **Bookings Table**
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    car_id INTEGER REFERENCES cars(id),
    pickup_location VARCHAR(200) NOT NULL,
    drop_location VARCHAR(200) NOT NULL,
    pickup_date TIMESTAMP NOT NULL,
    drop_date TIMESTAMP NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

## 🛠️ Development

### **Database Migrations**

Create new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback:
```bash
alembic downgrade -1
```

### **API Documentation**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### **Frontend Development**
```bash
# Install new dependencies
npm install package-name

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **Input Validation** with Pydantic schemas
- **SQL Injection Prevention** with SQLAlchemy ORM
- **CORS Configuration** for secure API access
- **Data Validation** on both frontend and backend
- **Error Handling** with proper HTTP status codes

## 🚀 Deployment

### **Frontend (Vercel/Netlify)**
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### **Backend (Heroku/DigitalOcean)**
```bash
# Install production dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://..."

# Start with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📊 Monitoring & Analytics

### **Backend Monitoring**
- Health check endpoint: `GET /`
- Request logging
- Error tracking
- Performance metrics

### **Frontend Analytics**
- User interaction tracking
- Booking conversion rates
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@jntcar.com
- WhatsApp: +91 99352 32167

---

**Built with ❤️ by JNT CAR Team**
