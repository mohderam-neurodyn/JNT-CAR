# Railway Deployment Guide

## 🚀 Production-Ready Monorepo Structure

### ✅ Final Project Structure
```
jnt-car/
├── backend/                    # FastAPI Backend Service
│   ├── app/
│   │   ├── main.py           # Entry point: app.main:app
│   │   ├── database.py       # Database configuration
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   └── auth.py          # Authentication
│   ├── requirements.txt       # Python dependencies
│   └── .env.example        # Environment variables
│
├── frontend/                   # Next.js Frontend Service
│   ├── app/               # Next.js app directory
│   │   ├── booking/        # Booking pages
│   │   ├── cars/           # Car pages
│   │   ├── account/         # User account
│   │   ├── login/           # Authentication
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   ├── lib/              # Utilities
│   ├── package.json        # Node.js dependencies
│   ├── next.config.js      # Next.js configuration
│   └── .env.local.example # Environment variables
│
└── README.md              # Project documentation
```

## 🎯 Railway Service Configuration

### Backend Service
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  ```
  DATABASE_URL=postgresql://user:password@host:port/database
  SECRET_KEY=your-secret-key
  GOOGLE_MAPS_API_KEY=your-google-maps-key
  ```

### Frontend Service
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
  NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key
  ```

## 🔧 Production Settings

### Backend (FastAPI)
- ✅ CORS configured for all origins
- ✅ Railway PORT environment variable support
- ✅ SQLite/PostgreSQL database support
- ✅ Production-ready requirements.txt
- ✅ Entry point: `app.main:app`

### Frontend (Next.js)
- ✅ Environment variable API URL configuration
- ✅ Production build optimization
- ✅ Turbopack configuration
- ✅ Static generation ready
- ✅ No hardcoded localhost URLs

## 🚀 Deployment Steps

### 1. Backend Deployment
1. Create new Railway service
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

### 2. Frontend Deployment
1. Create new Railway service
2. Set root directory to `frontend`
3. Add environment variables (including backend URL)
4. Deploy

## 🎉 Benefits

- ✅ **Zero Runtime Conflicts**: Python vs Node.js separated
- ✅ **Independent Scaling**: Scale services separately
- ✅ **Clean Architecture**: Clear separation of concerns
- ✅ **Production Ready**: Both services optimized for Railway
- ✅ **Environment Variables**: No hardcoded URLs
- ✅ **Database Flexibility**: SQLite for dev, PostgreSQL for prod

## 📊 Service URLs

After deployment:
- Backend: `https://your-backend-name.railway.app`
- Frontend: `https://your-frontend-name.railway.app`

## 🔍 Testing

Both services tested independently:
- ✅ Backend imports and starts correctly
- ✅ Frontend builds successfully
- ✅ Environment variable configuration working
- ✅ API calls use dynamic URLs

**🚀 Ready for Railway deployment!**
