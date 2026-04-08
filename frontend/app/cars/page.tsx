"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsClient />
    </Suspense>
  );
}
