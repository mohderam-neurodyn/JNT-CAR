#!/usr/bin/env python3

"""
Script to create an admin user for the JNT CAR MVP system.
Run this script after setting up your database to create the first admin user.
"""

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import User, UserRole, Base
from app.auth import get_password_hash

def create_admin_user():
    """Create an admin user with default credentials."""
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.email == "admin@jntcar.com").first()
        if existing_admin:
            print("Admin user already exists!")
            print(f"Email: {existing_admin.email}")
            print(f"Role: {existing_admin.role}")
            return
        
        # Create admin user
        admin_user = User(
            name="Admin User",
            email="admin@jntcar.com",
            password_hash=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"ID: {admin_user.id}")
        print(f"Email: {admin_user.email}")
        print(f"Name: {admin_user.name}")
        print(f"Role: {admin_user.role}")
        print("\n🔐 Login Credentials:")
        print(f"Email: admin@jntcar.com")
        print(f"Password: admin123")
        print("\n⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
