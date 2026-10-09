"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTicketPdf } from "@/lib/ticketPdf";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string, pnr?: string) => {
    if (!confirm(`Are you sure you want to cancel booking ${pnr ? `(PNR: ${pnr})` : ""}?`)) return;
    try {
      await axios.put(
        `/api/bookings/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBookings();
    } catch (err: any) {
      alert("Cancellation failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Navbar */}
      <nav className="flex flex-wrap justify-between items-center mb-8 bg-gray-800 rounded-xl p-4 gap-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-gray-300 text-sm hidden sm:inline">Hello, {user?.name}</span>
          
          <ThemeToggle />

          <Link
            href="/pnr"
            className="bg-gray-750 hover:bg-gray-700 text-zinc-200 border border-zinc-700 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            Track PNR
          </Link>
          <Link
            href="/profile"
            className="bg-gray-700 hover:bg-gray-650 px-3.5 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
          >
            <span>👤</span> Profile
          </Link>
          <Link
            href="/search"
            className="bg-white text-black hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg text-sm font-bold transition shadow-md shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white"
          >
            🔍 Search Trains
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-zinc-800 hover:bg-red-900 border border-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">🎫 My Bookings & Tickets</h2>
          <p className="text-gray-400 text-sm">View confirmed trips, PNR numbers, and itineraries</p>
        </div>
        <Link
          href="/search"
          className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-700"
        >
          Book Another Ticket →
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400 mx-auto mb-3"></div>
          <p className="text-gray-400">Fetching your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-850 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-lg mb-2">No bookings found</p>
          <p className="text-gray-500 text-sm mb-6">You haven't reserved any train journeys yet.</p>
          <Link
            href="/search"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold inline-block"
          >
            Find Trains Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div
              key={booking._id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-750 hover:border-gray-700 transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {booking.train?.trainName || "Express Train"}
                    </h3>
                    <span className="bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded font-mono">
                      #{booking.train?.trainNumber}
                    </span>
                    {booking.pnr && (
                      <span className="bg-yellow-950/70 border border-yellow-500/50 text-yellow-400 text-xs px-2.5 py-1 rounded font-mono font-semibold">
                        PNR: {booking.pnr}
                      </span>
                    )}
                    {booking.classType && (
                      <span className="bg-blue-900/60 text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">
                        Class: {booking.classType}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-6 mt-3 items-center">
                    <div>
                      <p className="text-blue-400 font-semibold text-lg">{booking.train?.from}</p>
                      <p className="text-gray-300 text-sm font-mono">{booking.train?.departureTime}</p>
                    </div>
                    <div className="text-gray-500 text-xl font-bold">→</div>
                    <div>
                      <p className="text-green-400 font-semibold text-lg">{booking.train?.to}</p>
                      <p className="text-gray-300 text-sm font-mono">{booking.train?.arrivalTime}</p>
                    </div>
                    {booking.train?.date && (
                      <div className="ml-auto md:ml-4 text-xs text-gray-400 bg-gray-900/80 px-3 py-1.5 rounded-lg">
                        📅 {booking.train.date}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-700/60 flex flex-wrap gap-4 text-sm">
                    {booking.passengers && booking.passengers.length > 0 ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-gray-400">Passengers:</span>
                        {booking.passengers.map((p: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-gray-900 text-gray-200 px-2 py-1 rounded text-xs"
                          >
                            👤 {p.name} ({p.age}y)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-300">
                        👤 {booking.passengerName}, Age: {booking.passengerAge}
                      </p>
                    )}
                    <p className="text-gray-400">
                      💺 Seats: <span className="text-white font-medium">{booking.seats}</span>
                    </p>
                    <p className="text-yellow-400 font-bold ml-auto">
                      Total: ₹{booking.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      booking.status === "confirmed"
                        ? "bg-green-900/80 text-green-300 border border-green-700"
                        : "bg-red-900/80 text-red-300 border border-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {booking.status === "confirmed" && (
                    <div className="flex flex-col gap-2 mt-2 w-full sm:w-auto">
                      <button
                        onClick={() => generateTicketPdf(booking)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <span>📥 Download PDF</span>
                      </button>
                      <button
                        onClick={() => cancelBooking(booking._id, booking.pnr)}
                        className="bg-red-600/80 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
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