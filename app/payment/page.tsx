"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Suspense } from "react";

function PaymentContent() {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState({
    number: "", name: "", expiry: "", cvv: ""
  });
  const [booking, setBooking] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();

  const trainId = searchParams.get("trainId");
  const seats = searchParams.get("seats");
  const passengerName = searchParams.get("passengerName");
  const passengerAge = searchParams.get("passengerAge");
  const price = searchParams.get("price");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Fake payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const res = await axios.post("/api/bookings", {
        trainId,
        seats: Number(seats),
        passengerName,
        passengerAge: Number(passengerAge),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setBooking(res.data.booking);
      setStep(3);
    } catch (err: any) {
      alert("Booking failed: " + err.response?.data?.error);
    } finally {
      setProcessing(false);
    }
  };

  const downloadTicket = () => {
    const content = `
TRAIN TICKET
============
Booking ID: ${booking._id}
Passenger: ${passengerName}
Age: ${passengerAge}
Train ID: ${trainId}
Seats: ${seats}
Total Price: ₹${price}
Status: CONFIRMED
Date: ${new Date().toLocaleDateString()}
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${booking._id}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {["Review", "Payment", "Ticket"].map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step > i + 1 ? "bg-green-600" : step === i + 1 ? "bg-blue-600" : "bg-gray-600"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className="ml-2 text-sm text-gray-400">{s}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-600 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1 - Review */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">🎫 Booking Summary</h2>
            <div className="bg-gray-900 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Passenger</span>
                <span className="text-white font-semibold">{passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Age</span>
                <span className="text-white">{passengerAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Seats</span>
                <span className="text-white">{seats}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-yellow-400 font-bold text-xl">₹{price}</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Step 2 - Payment */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-6">💳 Payment Details</h2>
            <div className="flex gap-2 mb-4">
              {["💳 Card", "📱 UPI", "🏦 NetBanking"].map((method, i) => (
                <button key={i} className={`flex-1 py-2 rounded-lg text-sm ${
                  i === 0 ? "bg-blue-600" : "bg-gray-700"
                }`}>
                  {method}
                </button>
              ))}
            </div>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                    setCard({ ...card, number: val });
                  }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="HIMANSHU GOYAL"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").replace(/^(\d{2})/, "$1/");
                      setCard({ ...card, expiry: val });
                    }}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={3}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                    required
                  />
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 flex justify-between">
                <span className="text-gray-400">Amount to Pay</span>
                <span className="text-yellow-400 font-bold">₹{price}</span>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-xl font-semibold"
              >
                {processing ? "⏳ Processing Payment..." : `Pay ₹${price}`}
              </button>
            </form>
          </div>
        )}

        {/* Step 3 - Ticket */}
        {step === 3 && booking && (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold text-green-400">Payment Successful!</h2>
              <p className="text-gray-400 mt-1">Your ticket is confirmed</p>
            </div>

            {/* Ticket */}
            <div className="bg-gray-900 rounded-xl p-4 border border-green-600 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-blue-400 font-bold text-lg">🚂 TRAIN TICKET</span>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">CONFIRMED</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID</span>
                  <span className="text-white font-mono text-xs">{booking._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Passenger</span>
                  <span className="text-white">{passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seats</span>
                  <span className="text-white">{seats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Paid</span>
                  <span className="text-yellow-400 font-bold">₹{price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={downloadTicket}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
              >
                📥 Download Ticket
              </button>
              <button
                onClick={() => router.push("/bookings")}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold"
              >
                View My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}