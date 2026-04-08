from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta

from . import models, schemas, crud
from .database import get_db, engine
from .auth import (
    authenticate_user, create_access_token, get_current_user, get_current_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JNT CAR Booking API",
    description="API for managing car bookings - MVP",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
def health_check():
    return {"status": "healthy", "message": "JNT CAR Booking API is running"}

# Authentication endpoints
@app.post("/api/auth/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400, 
            detail="Email already registered"
        )
    
    # Create new user
    db_user = crud.create_user(db=db, user=user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.id, "role": db_user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # Authenticate user
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user

# Car endpoints
@app.post("/api/cars", response_model=schemas.CarResponse, status_code=status.HTTP_201_CREATED)
def create_car(
    car: schemas.CarCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    return crud.create_car(db=db, car=car, owner_id=current_user.id)

@app.get("/api/cars", response_model=List[schemas.CarResponse])
def read_cars(
    skip: int = 0,
    limit: int = 20,
    city: Optional[str] = Query(None, description="Filter by city"),
    db: Session = Depends(get_db)
):
    cars = crud.get_cars(db, skip=skip, limit=limit, city=city)
    return cars

@app.get("/api/cars/{car_id}", response_model=schemas.CarResponse)
def read_car(car_id: str, db: Session = Depends(get_db)):
    db_car = crud.get_car(db, car_id=car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return db_car

@app.get("/api/cars/nearby", response_model=List[schemas.CarResponse])
def get_nearby_cars(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: float = Query(10.0, description="Search radius in kilometers"),
    city: Optional[str] = Query(None, description="Filter by city"),
    db: Session = Depends(get_db)
):
    nearby_cars = crud.get_nearby_cars(db, lat=lat, lng=lng, radius=radius, city=city)
    return nearby_cars

@app.put("/api/cars/{car_id}", response_model=schemas.CarResponse)
def update_car(
    car_id: str,
    car_update: schemas.CarUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    db_car = crud.update_car(db, car_id=car_id, car_update=car_update)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return db_car

@app.delete("/api/cars/{car_id}")
def delete_car(
    car_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    db_car = crud.delete_car(db, car_id=car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
