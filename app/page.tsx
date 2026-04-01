"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, Users, Star, ChevronRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cars } from "@/lib/data";

export default function Home() {
  const featuredCars = cars.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-bold">
                Drive Your Dreams with{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  JNT CAR
                </span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Book self-drive cars at affordable prices. Experience freedom, flexibility, and the joy of driving.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/cars">
                  <Button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                    Browse Cars
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-2">
                    <Users className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-blue-100">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-2">
                    <Shield className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-blue-100">Secure Booking</div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-2">
                    <Clock className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-blue-100">Support</div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1760561149879-d2dcda994a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzQ3MTAzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Car on road"
                className="rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Car</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pickup Location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                Search Cars
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose JNT CAR?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer the best self-drive car rental experience with our premium services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Cars</h3>
                <p className="text-gray-600">
                  Well-maintained, modern vehicles with regular servicing and quality checks
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fully Insured</h3>
                <p className="text-gray-600">
                  Comprehensive insurance coverage for your peace of mind during every journey
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">
                  Round-the-clock customer support to assist you whenever you need help
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Cars</h2>
            <p className="text-xl text-gray-600">Check out our most popular vehicles</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Card key={car.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden">
                <div className="relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{car.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>
                  <p className="text-gray-600 mb-4">{car.brand} • {car.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">₹{car.pricePerDay}</div>
                      <div className="text-sm text-gray-600">per day</div>
                    </div>
                    <Link href={`/cars/${car.id}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/cars">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                View All Cars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who trust JNT CAR for their travel needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/cars">
              <Button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Book Now
              </Button>
            </Link>
            <a
              href="https://wa.me/919935232167"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.139-.562-2.202-1.163-.606-.348-1.732-1.134-2.619-2.466-.317-.456-.836-1.229-.945-1.392-.109-.163-.267-.198-.465-.098-.197.099-.435.326-.673.554-.238.227-.767.936-.767.936-.149.297-.297.149-.445-.05-.148-.099-.597-.347-1.139-.644-.542-.297-1.362-.747-1.362-.747-.149-.099-.297.05-.445.149-.148.099-.445.326-.742.554-.297.227-.742.554-.742.554-.149.099-.297-.05-.445-.149-.148-.099-.597-.347-1.139-.644-.542-.297-1.362-.747-1.362-.747-.149-.099-.297.05-.445.149-.148.099-.445.326-.742.554-.297.227-.742.554-.742.554-.149.099-.297-.05-.445-.149-.148-.099-.597-.347-1.139-.644-.542-.297-1.362-.747-1.362-.747-.149-.099-.297.05-.445.149-.148.099-.445.326-.742.554-.297.227-.742.554-.742.554-.149.099-.297-.05-.445-.149-.148-.099-.597-.347-1.139-.644-.542-.297-1.362-.747-1.362-.747z"/>
                <path d="M21.75 17a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
