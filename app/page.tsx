import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-400 mb-4">🚂 Train Booking</h1>
        <p className="text-gray-400 text-xl mb-8">Book train tickets easily and quickly</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-lg">
            Login
          </Link>
          <Link href="/register" className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-xl font-semibold text-lg">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}