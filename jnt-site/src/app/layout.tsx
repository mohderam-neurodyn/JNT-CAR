import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "JNT CAR",
  description: "Drive Your Dream CAR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-6 bg-white shadow">
          <h1 className="text-2xl font-bold text-blue-700">NeuroDyn</h1>
          <div className="space-x-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
        </nav>

        {/* Page content */}
        <main className="min-h-[80vh] p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center p-6 mt-12">
          <p>© {new Date().getFullYear()} JNT CAR — Drive Your Dream Car</p>
        </footer>
      </body>
    </html>
  );
}

