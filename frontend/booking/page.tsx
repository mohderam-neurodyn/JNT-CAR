"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Car } from "lucide-react";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Car</h1>
          <p className="text-lg text-gray-600">Choose from our wide selection of vehicles</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Quick Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Browse our available cars and book instantly with our easy booking system.
              </p>
              <Link href="/cars">
                <Button className="w-full">Browse Cars</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Find Your Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Already have a booking? Check your booking status and details.
              </p>
              <Link href="/account">
                <Button variant="outline" className="w-full">My Bookings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Why Choose JNT CAR?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Wide Selection</h3>
                <p className="text-sm text-gray-600">Choose from sedans, SUVs, hatchbacks, and more</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Booking</h3>
                <p className="text-sm text-gray-600">Book by hour or day, with easy extensions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Multiple Locations</h3>
                <p className="text-sm text-gray-600">Pick up and drop off at convenient locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
