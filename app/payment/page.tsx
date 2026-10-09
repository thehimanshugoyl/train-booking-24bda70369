"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Suspense } from "react";
import Link from "next/link";
import { generateTicketPdf } from "@/lib/ticketPdf";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

function PaymentContent() {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [booking, setBooking] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();

  const trainId = searchParams.get("trainId");
  const seats = searchParams.get("seats") || "1";
  const classType = searchParams.get("classType") || "SL";
  const passengerName = searchParams.get("passengerName") || "";
  const passengerAge = searchParams.get("passengerAge") || "";
  const price = searchParams.get("price") || "0";
  const trainName = searchParams.get("trainName") || "Express Train";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";

  // Parse multi-passengers list if provided
  const parsedPassengers = useMemo(() => {
    const raw = searchParams.get("passengers");
    if (!raw) return [];
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch {
      return [];
    }
  }, [searchParams]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulated bank authorization
    await new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const res = await axios.post(
        "/api/bookings",
        {
          trainId,
          seats: Number(seats),
          classType,
          passengerName: parsedPassengers[0]?.name || passengerName,
          passengerAge: Number(parsedPassengers[0]?.age || passengerAge) || 25,
          passengers: parsedPassengers.length > 0 ? parsedPassengers : undefined,
          paymentMethod: "card",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(res.data.booking);
      setStep(3);
    } catch (err: any) {
      alert("Booking failed: " + (err.response?.data?.error || "Payment transaction declined."));
    } finally {
      setProcessing(false);
    }
  };

  const downloadTextTicket = () => {
    const content = `
=========================================
          RAILX E-RESERVATION SLIP
=========================================
PNR NUMBER : ${booking?.pnr || "N/A"}
Booking ID : ${booking?._id}
Train      : ${trainName}
Route      : ${from} -> ${to}
Date       : ${date || new Date().toLocaleDateString("en-IN")}
Class      : ${classType}
Seats      : ${seats}
Total Fare : ₹${price}
Status     : CONFIRMED

PASSENGERS:
${
  parsedPassengers.length > 0
    ? parsedPassengers
        .map(
          (p: any, i: number) =>
            `${i + 1}. ${p.name} (${p.age}y, ${p.gender}) - Seat: ${p.seatNumber || "Auto"}`
        )
        .join("\n")
    : `1. ${passengerName} (${passengerAge}y)`
}

=========================================
Thank you for traveling with RailX!
=========================================
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${booking?.pnr || booking?._id}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg mb-4 flex justify-between items-center">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <ThemeToggle />
      </div>

      <div className="bg-gray-850 border border-gray-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl">
        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {["1. Review Trip", "2. Payment", "3. Boarding Pass"].map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step > i + 1
                    ? "bg-emerald-500 text-black"
                    : step === i + 1
                    ? "bg-white text-black ring-4 ring-white/20 dark:bg-white dark:text-black light:bg-black light:text-white"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span
                className={`ml-2 text-xs font-medium hidden sm:inline ${
                  step === i + 1 ? "text-white font-bold" : "text-gray-500"
                }`}
              >
                {s.split(". ")[1]}
              </span>
              {i < 2 && <div className="w-6 sm:w-10 h-0.5 bg-gray-800 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1 - Review */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-yellow-400 mb-1">🎫 Booking Summary</h2>
            <p className="text-xs text-gray-400 mb-5">
              Review train itinerary and passenger manifest before payment
            </p>

            <div className="bg-gray-900 rounded-2xl p-4 space-y-3 mb-6 border border-gray-800">
              <div className="border-b border-gray-800 pb-2">
                <p className="text-white font-bold">{trainName}</p>
                <p className="text-xs text-gray-400">
                  {from} → {to} {date ? `• 📅 ${date}` : ""}
                </p>
              </div>

              {/* Passengers list */}
              {parsedPassengers.length > 0 ? (
                <div className="space-y-1.5 py-1">
                  <span className="text-xs text-gray-400 block font-semibold">
                    Passengers ({parsedPassengers.length}):
                  </span>
                  {parsedPassengers.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs bg-gray-950/60 p-2 rounded">
                      <span className="text-gray-300">
                        {idx + 1}. {p.name} ({p.age}y, {p.gender})
                      </span>
                      <span className="text-blue-300 font-mono">
                        {p.seatNumber || `Berth: ${p.berthPreference || "Auto"}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Primary Passenger</span>
                    <span className="text-white font-semibold">{passengerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Age</span>
                    <span className="text-white">{passengerAge} yrs</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm pt-2 border-t border-gray-800">
                <span className="text-gray-400">Travel Class</span>
                <span className="text-blue-400 font-bold">{classType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Seat Quantity</span>
                <span className="text-white">{seats} seat(s)</span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between items-center">
                <span className="text-gray-300 font-medium text-sm">Total Payable</span>
                <span className="text-yellow-400 font-extrabold text-2xl">₹{price}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-white text-black hover:bg-zinc-200 py-3.5 rounded-xl font-bold transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
            >
              Proceed to Payment →
            </button>
          </div>
        )}

        {/* Step 2 - Payment Form */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">💳 Payment Gateway</h2>
            <p className="text-xs text-gray-400 mb-5">
              Encrypted mock checkout simulation (test credentials accepted)
            </p>

            <div className="flex gap-2 mb-5">
              {["💳 Credit / Debit Card", "📱 UPI", "🏦 NetBanking"].map((method, i) => (
                <button
                  key={i}
                  type="button"
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                    i === 0
                      ? "bg-white text-black shadow-sm dark:bg-white dark:text-black light:bg-black light:text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="4532 •••• •••• 8891"
                  value={card.number}
                  onChange={(e) => {
                    const val = e.target.value
                      .replace(/\D/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim();
                    setCard({ ...card, number: val });
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="HIMANSHU GOYAL"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .replace(/^(\d{2})/, "$1/");
                      setCard({ ...card, expiry: val });
                    }}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={3}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3.5 flex justify-between items-center">
                <span className="text-gray-400 text-sm">Amount to Debit</span>
                <span className="text-yellow-400 font-extrabold text-xl">₹{price}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-800 hover:bg-gray-750 px-4 py-3 rounded-xl text-sm text-gray-300 font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 py-3.5 rounded-xl font-bold transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
                >
                  {processing ? "⏳ Processing Transaction..." : `Pay ₹${price}`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3 - Ticket Confirmation */}
        {step === 3 && booking && (
          <div className="text-center">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-black text-white mb-1">Payment Successful!</h2>
            <p className="text-xs text-gray-400 mb-6">
              Your railway reservation has been confirmed with GADDVYA
            </p>

            {/* Ticket Card Preview */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-zinc-700 mb-6 text-left relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold text-base">🚂 GADDVYA BOARDING PASS</span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  CONFIRMED
                </span>
              </div>

              {/* PNR Banner */}
              <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl mb-3 flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-semibold">PNR NUMBER</span>
                <span className="text-white font-mono font-black text-base tracking-wider">
                  {booking.pnr}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-500">Train:</span>
                  <span className="text-white font-medium">{trainName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Class:</span>
                  <span className="text-zinc-200 font-bold">{classType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Seats:</span>
                  <span className="text-white font-medium">{seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="text-white font-bold">₹{price}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => generateTicketPdf(booking)}
                className="w-full bg-white text-black hover:bg-zinc-200 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
              >
                <span>📥 Download PDF Boarding Pass</span>
              </button>

              <button
                onClick={downloadTextTicket}
                className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-750 py-2.5 rounded-xl text-xs text-gray-300 transition"
              >
                Download Plain Text Slip
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/pnr"
                  className="bg-gray-800 hover:bg-gray-750 text-gray-200 py-2.5 rounded-xl text-xs font-semibold text-center block transition border border-gray-700"
                >
                  Track PNR
                </Link>
                <Link
                  href="/bookings"
                  className="bg-gray-800 hover:bg-gray-750 text-gray-200 py-2.5 rounded-xl text-xs font-semibold text-center block transition border border-gray-700"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          Loading checkout...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}