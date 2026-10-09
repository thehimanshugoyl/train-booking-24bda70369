"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTicketPdf } from "@/lib/ticketPdf";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuthStore();
  const { t } = useLanguageStore();
  const { refundFunds } = useWalletStore();
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

  const cancelBooking = async (id: string, pnr?: string, amount?: number) => {
    if (!confirm(`Are you sure you want to cancel booking ${pnr ? `(PNR: ${pnr})` : ""}? 100% of your fare (₹${amount || 0}) will be refunded instantly to your GADDVYA Rail Wallet.`)) return;
    try {
      await axios.put(
        `/api/bookings/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (amount && amount > 0) {
        refundFunds(amount, `Cancelled Ticket PNR: ${pnr || id}`, pnr);
      }
      alert(`Booking cancelled successfully. ₹${amount || 0} has been refunded immediately to your GADDVYA Rail Wallet!`);
      fetchBookings();
    } catch (err: any) {
      alert("Cancellation failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Navbar */}
      <nav className="flex flex-wrap justify-between items-center mb-8 bg-gray-800 rounded-2xl p-4 gap-3 border border-gray-700/60 shadow-lg">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <span className="text-gray-300 text-sm hidden sm:inline">Hello, {user?.name}</span>
          
          <LanguageSelector />
          <ThemeToggle />

          <Link
            href="/wallet"
            className="text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>💳</span> {t("wallet")}
          </Link>
          <Link
            href="/pnr"
            className="bg-gray-750 hover:bg-gray-750 text-zinc-200 border border-zinc-700 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            {t("pnrStatus")}
          </Link>
          <Link
            href="/profile"
            className="bg-gray-700 hover:bg-gray-650 px-3.5 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
          >
            <span>👤</span> {t("profile")}
          </Link>
          <Link
            href="/search"
            className="bg-white text-black hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg text-sm font-bold transition shadow-md shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white"
          >
            🔍 {t("searchTrains")}
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-zinc-800 hover:bg-red-900 border border-zinc-700 text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-lg text-sm transition cursor-pointer"
          >
            {t("logout")}
          </button>
        </div>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("myBookings")}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Active and past train reservation slips</p>
        </div>
        <Link
          href="/wallet"
          className="bg-zinc-900 border border-zinc-750 hover:border-zinc-600 px-4 py-2 rounded-xl text-xs font-medium text-amber-300 flex items-center gap-2"
        >
          <span>⚡ Instant Auto-Refunds enabled with Rail Wallet</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-lg mb-2">No bookings found</p>
          <p className="text-gray-500 text-sm mb-6">
            You haven't reserved any train tickets yet.
          </p>
          <Link
            href="/search"
            className="bg-white text-black hover:bg-zinc-200 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white"
          >
            Search Trains Now
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
                        onClick={() => cancelBooking(booking._id, booking.pnr, booking.totalPrice)}
                        className="bg-red-600/80 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                      >
                        Cancel & Instant Refund
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