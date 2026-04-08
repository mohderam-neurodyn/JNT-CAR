import { Suspense } from "react";
import CarsClient from "./CarsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsClient />
    </Suspense>
  );
}
