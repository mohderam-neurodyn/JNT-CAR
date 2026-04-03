from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, Boolean, DECIMAL, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum
import uuid


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"


class TransmissionType(str, enum.Enum):
    MANUAL = "manual"
    AUTOMATIC = "automatic"


class FuelType(str, enum.Enum):
    PETROL = "petrol"
    DIESEL = "diesel"
    ELECTRIC = "electric"


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Car(Base):
    __tablename__ = "cars"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    brand = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    daily_rate = Column(DECIMAL(10, 2), nullable=False)
    transmission = Column(Enum(TransmissionType), nullable=False)
    fuel_type = Column(Enum(FuelType), nullable=False)
    seats = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    images = Column(JSON, nullable=True)  # Array of image URLs
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    owner = relationship("User", backref="cars")
