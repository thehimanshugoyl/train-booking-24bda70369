"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { generateTicketPdf } from "@/lib/ticketPdf";
import IrctcNavBar from "@/components/IrctcNavBar";

export default function PnrPage() {
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearchPnr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr.trim()) return;
    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const res = await axios.get(`/api/bookings/${pnr.trim()}`);
      setBooking(res.data.booking);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "PNR record not found. Please verify the 10-digit number."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between transition-colors">
      {/* Official IRCTC Navigation Bar */}
      <IrctcNavBar />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full my-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full mb-3">
            Live PNR Inquiry & Status
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Passenger Current Status Enquiries
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Enter your 10-digit Passenger Name Record (PNR) number to track live booking status, coach allotment, and download your boarding pass.
          </p>
        </div>

        {/* PNR Search Card */}
        <div className="bg-gray-850 border border-gray-800 rounded-2xl p-6 shadow-xl mb-8">
          <form onSubmit={handleSearchPnr} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                maxLength={10}
                placeholder="Enter 10-Digit PNR (e.g. 8429103941)"
                value={pnr}
                onChange={(e) => setPnr(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-white font-mono text-base tracking-widest placeholder:tracking-normal focus:border-blue-500 focus:outline-none"
                required
              />
              <span className="absolute right-4 top-4 text-xs text-gray-500 font-mono">
                {pnr.length}/10
              </span>
            </div>
            <button
              type="submit"
              disabled={loading || pnr.length !== 10}
              className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 px-8 py-3.5 rounded-xl font-bold transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Checking..." : "Get Status"}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-950/40 border border-red-800 text-red-300 p-3.5 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* PNR Results Card */}
        {booking && (
          <div className="bg-gray-850 border border-gray-750 rounded-2xl p-6 shadow-2xl transition animate-fadeIn">
            {/* Header Status */}
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-800 pb-5 mb-5">
              <div>
                <span className="text-xs text-gray-400 font-mono uppercase">PNR Number</span>
                <p className="text-2xl font-black text-yellow-400 font-mono tracking-wider">
                  {booking.pnr || booking._id}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === "confirmed"
                      ? "bg-green-900/80 text-green-300 border border-green-700"
                      : "bg-red-900/80 text-red-300 border border-red-700"
                  }`}
                >
                  ● {booking.status === "confirmed" ? "CONFIRMED (CNF)" : "CANCELLED"}
                </span>
                <p className="text-xs text-blue-300 font-semibold mt-2">
                  Class: {booking.classType || "SL"} • {booking.seats} Seat(s)
                </p>
              </div>
            </div>

            {/* Train & Journey Route */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-white">
                  {booking.train?.trainName || "Express Train"}
                </h3>
                <span className="bg-gray-800 text-gray-300 text-xs px-2.5 py-0.5 rounded font-mono">
                  #{booking.train?.trainNumber}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-xs text-gray-400">Boarding Station</p>
                  <p className="text-blue-400 font-bold text-base">{booking.train?.from}</p>
                  <p className="text-gray-300 text-xs font-mono">{booking.train?.departureTime}</p>
                </div>
                <div className="text-center text-gray-500 font-bold">
                  {booking.train?.duration && (
                    <span className="text-[10px] block text-gray-400 font-normal">
                      ⏳ {booking.train.duration}
                    </span>
                  )}
                  ────────►
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Destination Station</p>
                  <p className="text-green-400 font-bold text-base">{booking.train?.to}</p>
                  <p className="text-gray-300 text-xs font-mono">{booking.train?.arrivalTime}</p>
                </div>
              </div>
            </div>

            {/* Passenger Manifest */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Passenger Berth / Coach Allocation
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-800 bg-gray-900/50">
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Passenger</th>
                      <th className="p-2.5">Age / Gender</th>
                      <th className="p-2.5">Allocated Berth</th>
                      <th className="p-2.5">Current Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(booking.passengers && booking.passengers.length > 0
                      ? booking.passengers
                      : [
                          {
                            name: booking.passengerName || "Passenger 1",
                            age: booking.passengerAge || 28,
                            gender: "Male",
                            seatNumber: "B1-22",
                          },
                        ]
                    ).map((p: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-800/60">
                        <td className="p-2.5 text-gray-500">{idx + 1}</td>
                        <td className="p-2.5 font-medium text-white">{p.name}</td>
                        <td className="p-2.5 text-gray-400">
                          {p.age} yrs • {p.gender || "M"}
                        </td>
                        <td className="p-2.5 font-mono text-blue-300 font-semibold">
                          {p.seatNumber || `B1-${15 + idx * 3}`}
                        </td>
                        <td className="p-2.5 font-bold text-green-400 text-xs">
                          {booking.status === "confirmed" ? "CNF / CONFIRMED" : "CAN / CANCELLED"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => generateTicketPdf(booking)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <span>📥 Download PDF E-Ticket</span>
              </button>
              <Link
                href="/search"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Book Another Trip
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-600 py-6 mt-8">
        RailX PNR Tracking System • Direct Integrated Railway Reservation Inquiry
      </footer>
    </div>
  );
}
