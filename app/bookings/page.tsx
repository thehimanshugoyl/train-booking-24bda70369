"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await axios.put(`/api/bookings/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 bg-gray-800 rounded-xl p-4">
        <h1 className="text-2xl font-bold text-blue-400">🚂 Train Booking</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-300">Hello, {user?.name}</span>
          <Link href="/search" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">Search Trains</Link>
          <button onClick={() => { logout(); router.push("/login"); }} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
      </nav>

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">🎫 My Bookings</h2>

      {loading ? (
        <p className="text-gray-400 text-center py-10">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">No bookings found</p>
          <Link href="/search" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">Search Trains</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div key={booking._id} className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{booking.train?.trainName}</h3>
                  <p className="text-gray-400 text-sm">Train No: {booking.train?.trainNumber}</p>
                  <div className="flex gap-6 mt-2">
                    <div>
                      <p className="text-blue-400 font-semibold">{booking.train?.from}</p>
                      <p className="text-gray-300 text-sm">{booking.train?.departureTime}</p>
                    </div>
                    <div className="text-gray-500 self-center">→</div>
                    <div>
                      <p className="text-green-400 font-semibold">{booking.train?.to}</p>
                      <p className="text-gray-300 text-sm">{booking.train?.arrivalTime}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4">
                    <p className="text-gray-300 text-sm">👤 {booking.passengerName}, Age: {booking.passengerAge}</p>
                    <p className="text-gray-300 text-sm">💺 Seats: {booking.seats}</p>
                    <p className="text-yellow-400 text-sm font-semibold">₹{booking.totalPrice}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === "confirmed" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
                  }`}>
                    {booking.status}
                  </span>
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="block mt-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}