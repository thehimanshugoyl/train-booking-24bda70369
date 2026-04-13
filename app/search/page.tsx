"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Search() {
  const [form, setForm] = useState({ from: "", to: "" });
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({ seats: 1, passengerName: "", passengerAge: "" });
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  const searchTrains = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`/api/trains?from=${form.from}&to=${form.to}`);
      setTrains(res.data.trains);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 bg-gray-800 rounded-xl p-4">
        <h1 className="text-2xl font-bold text-blue-400">🚂 Train Booking</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-300">Hello, {user?.name}</span>
          <Link href="/bookings" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">My Bookings</Link>
          <button onClick={() => { logout(); router.push("/login"); }} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
      </nav>

      {/* Search Form */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">🔍 Search Trains</h2>
        <form onSubmit={searchTrains} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="From (e.g. Delhi)"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          />
          <input
            type="text"
            placeholder="To (e.g. Mumbai)"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Train Results */}
      <div className="space-y-4">
        {trains.map((train: any) => (
          <div key={train._id} className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{train.trainName}</h3>
                <p className="text-gray-400 text-sm">Train No: {train.trainNumber}</p>
                <div className="flex gap-6 mt-2">
                  <div>
                    <p className="text-blue-400 font-semibold">{train.from}</p>
                    <p className="text-gray-300 text-sm">{train.departureTime}</p>
                  </div>
                  <div className="text-gray-500 self-center">→</div>
                  <div>
                    <p className="text-green-400 font-semibold">{train.to}</p>
                    <p className="text-gray-300 text-sm">{train.arrivalTime}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">₹{train.price}</p>
                <p className="text-gray-400 text-sm">{train.availableSeats} seats left</p>
                <button
                  onClick={() => { setBooking(train._id); }}
                  disabled={train.availableSeats === 0}
                  className="mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Booking Form */}
            {booking === train._id && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <h4 className="text-yellow-400 font-semibold mb-3">Passenger Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Passenger Name"
                    value={bookingForm.passengerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, passengerName: e.target.value })}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={bookingForm.passengerAge}
                    onChange={(e) => setBookingForm({ ...bookingForm, passengerAge: e.target.value })}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Seats"
                    min={1}
                    max={train.availableSeats}
                    value={bookingForm.seats}
                    onChange={(e) => setBookingForm({ ...bookingForm, seats: Number(e.target.value) })}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => {
                      router.push(`/payment?trainId=${train._id}&seats=${bookingForm.seats}&passengerName=${encodeURIComponent(bookingForm.passengerName)}&passengerAge=${bookingForm.passengerAge}&price=${train.price * bookingForm.seats}&trainName=${encodeURIComponent(train.trainName)}&from=${encodeURIComponent(train.from)}&to=${encodeURIComponent(train.to)}`);
                    }}
                    disabled={!bookingForm.passengerName || !bookingForm.passengerAge}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold"
                  >
                    Proceed to Pay — ₹{train.price * bookingForm.seats}
                  </button>
                  <button
                    onClick={() => setBooking(null)}
                    className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {trains.length === 0 && !loading && (
          <p className="text-gray-400 text-center py-10">Search for trains to see results</p>
        )}
      </div>
    </div>
  );
}