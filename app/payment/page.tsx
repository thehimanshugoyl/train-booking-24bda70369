"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import axios from "axios";
import { Suspense } from "react";
import Link from "next/link";
import { generateTicketPdf } from "@/lib/ticketPdf";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

function PaymentContent() {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [paymentMethodTab, setPaymentMethodTab] = useState<"wallet" | "card" | "upi" | "netbanking">("wallet");
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
  const { balance, deductFunds, addFunds } = useWalletStore();
  const { t } = useLanguageStore();

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

  const numericPrice = parseFloat(price) || 0;

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

  // Payment via Wallet (1-Click)
  const handleWalletPayment = async () => {
    if (balance < numericPrice) {
      alert("Insufficient wallet balance. Please add funds to your wallet.");
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

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
          paymentMethod: "GADDVYA Rail Wallet",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Deduct from wallet store
      deductFunds(numericPrice, `Train Ticket: ${trainName}`, res.data.booking?.pnr);
      setBooking(res.data.booking);
      setStep(3);
    } catch (err: any) {
      alert("Booking failed: " + (err.response?.data?.error || "Transaction declined."));
    } finally {
      setProcessing(false);
    }
  };

  // Payment via Card/External
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulated bank authorization
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
          paymentMethod: paymentMethodTab,
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
          GADDVYA E-RESERVATION SLIP
=========================================
PNR NUMBER : ${booking?.pnr || "N/A"}
Booking ID : ${booking?._id}
Train      : ${trainName}
Route      : ${from} -> ${to}
Date       : ${date || new Date().toLocaleDateString("en-IN")}
Class      : ${classType}
Seats      : ${seats}
Total Fare : ₹${price}
Payment    : ${booking?.paymentMethod || "Verified Transaction"}
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
Thank you for traveling with Indian Railways!
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ticket_${booking?.pnr || "GADDVYA"}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-4">
      <div className="flex items-center justify-between w-full max-w-lg mb-6">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
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
            <h2 className="text-xl font-bold text-white mb-1">💳 Choose Payment Mode</h2>
            <p className="text-xs text-gray-400 mb-5">
              Instant 1-click checkout with GADDVYA Rail Wallet or bank card
            </p>

            {/* Payment Method Switcher */}
            <div className="flex gap-2 mb-5">
              {[
                { id: "wallet", label: "⚡ Rail Wallet" },
                { id: "card", label: "💳 Card" },
                { id: "upi", label: "📱 UPI" },
                { id: "netbanking", label: "🏦 NetBanking" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethodTab(m.id as any)}
                  className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-semibold transition cursor-pointer ${
                    paymentMethodTab === m.id
                      ? "bg-white text-black shadow-md dark:bg-white dark:text-black light:bg-black light:text-white font-bold"
                      : "bg-gray-800/80 text-gray-400 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* OPTION 1: GADDVYA Rail Wallet */}
            {paymentMethodTab === "wallet" && (
              <div className="space-y-4 bg-zinc-900 border border-zinc-750 p-5 rounded-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-xs text-zinc-400 block font-medium">GADDVYA Rail Wallet Balance</span>
                    <span className="text-2xl font-extrabold text-white flex items-baseline gap-1 mt-0.5">
                      <span className="text-amber-400">₹</span>
                      <span>{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2.5 py-1 rounded-full font-bold">
                    ✓ 0% Surcharge
                  </span>
                </div>

                <div className="text-xs text-zinc-300 space-y-1">
                  <p className="flex items-center gap-1.5 text-emerald-300">
                    <span>⚡</span> 1-Click Instant Ticket Confirmation
                  </p>
                  <p className="flex items-center gap-1.5 text-zinc-400">
                    <span>🔄</span> 100% Instant Refund if cancelled
                  </p>
                </div>

                {balance >= numericPrice ? (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={handleWalletPayment}
                    className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 py-3.5 rounded-xl font-bold text-sm transition shadow-xl shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
                  >
                    {processing ? "Authorizing Payment..." : `⚡ Pay ₹${price} with Rail Wallet (1-Click)`}
                  </button>
                ) : (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-red-400">
                      ⚠️ Insufficient balance (Fare is ₹{price}, you have ₹{balance.toFixed(2)}).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        addFunds(1000, "Instant Quick-Topup");
                        alert("₹1,000 added to your Rail Wallet!");
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl text-xs transition"
                    >
                      + Quick Add ₹1,000 to Wallet
                    </button>
                    <Link
                      href="/wallet"
                      className="block text-center text-xs text-zinc-400 underline hover:text-white"
                    >
                      Go to Full Wallet Manager →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* OPTION 2: Card Payment */}
            {paymentMethodTab === "card" && (
              <form onSubmit={handleCardPayment} className="space-y-4">
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
                      maxLength={4}
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 py-3.5 rounded-xl font-bold transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
                >
                  {processing ? "Connecting Bank Gateway..." : `Pay ₹${price} with Card`}
                </button>
              </form>
            )}

            {/* OPTION 3: UPI / Netbanking Form */}
            {(paymentMethodTab === "upi" || paymentMethodTab === "netbanking") && (
              <form onSubmit={handleCardPayment} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">
                    {paymentMethodTab === "upi" ? "UPI ID / VPA" : "Select Bank"}
                  </label>
                  {paymentMethodTab === "upi" ? (
                    <input
                      type="text"
                      placeholder="user@oksbi or 9876543210@paytm"
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm"
                      required
                    />
                  ) : (
                    <select className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm">
                      <option>State Bank of India (SBI)</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Punjab National Bank (PNB)</option>
                    </select>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 py-3.5 rounded-xl font-bold transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
                >
                  {processing ? "Authorizing..." : `Pay ₹${price}`}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step 3 - Ticket Confirmation */}
        {step === 3 && booking && (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-1">Booking Confirmed!</h2>
            <p className="text-xs text-gray-400 mb-6">
              Your railway reservation has been authorized and issued by GADDVYA Portal.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-xs text-gray-400">PNR Number:</span>
                <span className="font-mono text-yellow-400 font-bold text-base bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-700/50">
                  {booking.pnr}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Train:</span>
                <span className="text-white font-medium">{trainName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Route:</span>
                <span className="text-white">
                  {from} → {to}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Paid:</span>
                <span className="text-emerald-400 font-bold">₹{price}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Payment Channel:</span>
                <span className="text-zinc-300 font-medium">{booking.paymentMethod || "Rail Wallet"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => generateTicketPdf(booking)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>📥 Download IRCTC PDF Slip</span>
              </button>

              <button
                onClick={downloadTextTicket}
                className="w-full bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                Save Plain Text Slip (.txt)
              </button>

              <div className="flex gap-2 pt-2">
                <Link
                  href="/wallet"
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 py-2.5 rounded-xl text-xs font-semibold text-center transition"
                >
                  💳 View Wallet
                </Link>
                <Link
                  href="/bookings"
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-xs font-semibold text-center transition"
                >
                  My Bookings →
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}