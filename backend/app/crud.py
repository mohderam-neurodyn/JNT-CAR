from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
import math
from . import models, schemas
from .auth import get_password_hash


# User CRUD operations
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Car CRUD operations
def get_cars(db: Session, skip: int = 0, limit: int = 100, city: str = None):
    query = db.query(models.Car).filter(models.Car.is_available == True)
    
    if city:
        query = query.filter(models.Car.city.ilike(f"%{city}%"))
    
    return query.offset(skip).limit(limit).all()

def get_car(db: Session, car_id: str):
    return db.query(models.Car).filter(models.Car.id == car_id).first()

def create_car(db: Session, car: schemas.CarCreate, owner_id: str):
    db_car = models.Car(**car.dict(), owner_id=owner_id)
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

def update_car(db: Session, car_id: str, car_update: schemas.CarUpdate):
    db_car = get_car(db, car_id)
    if db_car:
        update_data = car_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_car, field, value)
        
        db.commit()
        db.refresh(db_car)
    return db_car

def delete_car(db: Session, car_id: str):
    db_car = get_car(db, car_id)
    if db_car:
        db.delete(db_car)
        db.commit()
    return db_car


# Geo-location functions
def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points using Haversine formula."""
    # Convert decimal degrees to radians
    lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    return c * r

def get_nearby_cars(
    db: Session, 
    lat: float, 
    lng: float, 
    radius: float = 10.0,
    city: str = None
):
    """Get available cars within specified radius."""
    query = db.query(models.Car).filter(models.Car.is_available == True)
    
    # Filter by city first for performance
    if city:
        query = query.filter(models.Car.city.ilike(f"%{city}%"))
    
    cars = query.all()
    
    # Calculate distances and filter by radius
    nearby_cars = []
    for car in cars:
        distance = calculate_distance(lat, lng, float(car.latitude), float(car.longitude))
        if distance <= radius:
            car_dict = {
                "id": car.id,
                "brand": car.brand,
                "model": car.model,
                "year": car.year,
                "daily_rate": float(car.daily_rate),
                "transmission": car.transmission,
                "fuel_type": car.fuel_type,
                "seats": car.seats,
                "description": car.description,
                "images": car.images,
                "latitude": float(car.latitude),
                "longitude": float(car.longitude),
                "address": car.address,
                "city": car.city,
                "is_available": car.is_available,
                "owner_id": car.owner_id,
                "created_at": car.created_at,
                "distance_km": round(distance, 2)
            }
            nearby_cars.append(car_dict)
    
    # Sort by distance
    nearby_cars.sort(key=lambda x: x["distance_km"])
    
    return nearby_cars
