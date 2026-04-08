from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserRole, TransmissionType, FuelType


# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


# Car Schemas
class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    daily_rate: float
    transmission: TransmissionType
    fuel_type: FuelType
    seats: int
    description: Optional[str] = None
    images: Optional[List[str]] = None
    latitude: float
    longitude: float
    address: str
    city: str


class CarCreate(CarBase):
    pass


class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    daily_rate: Optional[float] = None
    transmission: Optional[TransmissionType] = None
    fuel_type: Optional[FuelType] = None
    seats: Optional[int] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    is_available: Optional[bool] = None


class CarResponse(CarBase):
    id: str
    is_available: bool
    owner_id: str
    created_at: datetime
    distance_km: Optional[float] = None  # For nearby cars endpoint

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[UserRole] = None
