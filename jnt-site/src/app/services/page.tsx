"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-blue-700"
      >
        NeuroDyn Technologies
      </motion.h1>
      <p className="mt-6 text-lg text-gray-700 max-w-2xl">
        Where Intelligence Meets Technology — Delivering IT, AI, Software,
        Energy & Electronics Solutions.
      </p>
      <a
        href="/services"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition"
      >
        Explore Services
      </a>
    </div>
  );
}
