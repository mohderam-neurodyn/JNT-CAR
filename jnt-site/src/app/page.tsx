"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Shield,
  Award,
  Headphones,
  Star,
  ChevronRight,
} from "lucide-react";

import { cars } from "@/data/cars"; // adjust path if needed

export default function HomePage() {
  const featuredCars = cars.slice(0, 3);

  return (
    <div className="min-h-screen text-white bg-[#0b1220]">
      
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">
            Drive Your Dreams with{" "}
            <span className="text-emerald-400">JNT CAR</span>
          </h1>

          <p className="text-white/70 text-lg mb-8">
            Book self-drive cars at affordable prices. Freedom, flexibility,
            and comfort at your fingertips.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Button asChild>
              <a href="/cars">
                Browse Cars <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <Button variant="secondary" asChild>
              <a href="/about">Learn More</a>
            </Button>
          </div>
        </motion.div>

        <motion.img
          src="https://images.unsplash.com/photo-1549924231-f129b911e442"
          className="rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        />
      </section>

      {/* SEARCH */}
      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <Card className="bg-white/5 border-white/10 backdrop-blur rounded-2xl p-6">
          <div className="grid md:grid-cols-3 gap-4">
            
            <div className="flex items-center gap-3">
              <MapPin className="text-emerald-400" />
              <select className="bg-transparent w-full outline-none">
                <option>Mumbai</option>
                <option>Delhi</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-emerald-400" />
              <input type="date" className="bg-transparent w-full outline-none" />
            </div>

            <div className="flex items-center gap-3">
              <Clock className="text-emerald-400" />
              <select className="bg-transparent w-full outline-none">
                <option>1 Day</option>
                <option>3 Days</option>
              </select>
            </div>

          </div>

          <Button className="w-full mt-4" asChild>
            <a href="/cars">Search Cars</a>
          </Button>
        </Card>
      </section>

      {/* WHY US */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl mb-10">Why Choose Us?</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Shield />, title: "Fully Insured" },
            { icon: <Award />, title: "Best Prices" },
            { icon: <Headphones />, title: "24/7 Support" },
          ].map((item) => (
            <Card key={item.title} className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center text-emerald-400">
                  {item.icon}
                </div>
                <h3 className="text-xl">{item.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between mb-8">
          <h2 className="text-3xl">Featured Cars</h2>
          <a href="/cars" className="text-emerald-400 flex items-center gap-2">
            View All <ChevronRight />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <Card key={car.id} className="bg-white/5 border-white/10">
              <img src={car.image} className="rounded-t-xl h-48 w-full object-cover" />

              <CardContent className="p-4">
                <h3 className="text-lg">{car.name}</h3>

                <div className="flex justify-between mt-2">
                  <span className="text-emerald-400">₹{car.pricePerDay}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {car.rating}
                  </div>
                </div>

                <Button className="w-full mt-4" asChild>
                  <a href={`/cars/${car.id}`}>Book Now</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
        <h2 className="text-3xl mb-4">Ready to Start?</h2>
        <Button asChild>
          <a href="/cars">Book Your Car</a>
        </Button>
      </section>
    </div>
  );
}