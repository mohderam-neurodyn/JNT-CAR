// 🚗 JNT CAR - PRODUCTION READY FULLSTACK (Next.js + FastAPI)
// Modern UI + Interactive + Deploy Ready

// =============================
// BACKEND (FastAPI)
// =============================

// main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "JNT CAR API running"}

@app.post("/enquiry")
def create_enquiry(enquiry: schemas.EnquiryCreate, db: Session = Depends(get_db)):
    db_enquiry = models.Enquiry(**enquiry.dict())
    db.add(db_enquiry)
    db.commit()
    return {"message": "Enquiry submitted"}


// =============================
// FRONTEND (Next.js Modern UI)
// =============================

// pages/index.js
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, form);
      alert("✅ Enquiry sent successfully!");
      setForm({ name: "", phone: "", location: "" });
    } catch (err) {
      alert("❌ Failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white text-center p-12">
        <h1 className="text-5xl font-bold">JNT CAR</h1>
        <p className="mt-3">Rent cars at best price in your city</p>
      </div>

      {/* FORM */}
      <div className="max-w-lg mx-auto bg-white p-6 mt-10 shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Enquiry</h2>

        <input
          value={form.name}
          placeholder="Your Name"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          value={form.phone}
          placeholder="Phone Number"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          value={form.location}
          placeholder="Pickup Location"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded"
        >
          {loading ? "Sending..." : "Get Best Deal"}
        </button>
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-10">
        <div className="bg-white p-5 shadow rounded">Affordable Pricing</div>
        <div className="bg-white p-5 shadow rounded">Well Maintained Cars</div>
        <div className="bg-white p-5 shadow rounded">24/7 Support</div>
      </div>

      {/* WHATSAPP CTA */}
      <div className="text-center p-10">
        <a
          href="https://wa.me/919935232167"
          className="bg-green-500 text-white px-6 py-3 rounded-lg"
        >
          Chat on WhatsApp
        </a>
      </div>

    </div>
  );
}


// =============================
// ENV SETUP (IMPORTANT)
// =============================
// .env.local
// NEXT_PUBLIC_API_URL=http://127.0.0.1:8000


// =============================
// DEPLOY READY NOTES
// =============================
// Backend → Railway / Render
// Frontend → Vercel
// Replace API URL with deployed backend URL

// =============================
// BONUS FEATURES YOU CAN ADD
// =============================
// - Car listing page
// - Admin dashboard
// - Payment gateway
// - Login system
// - Booking calendar
