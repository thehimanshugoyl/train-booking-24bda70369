"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IrctcNavBar from "@/components/IrctcNavBar";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function WalletPage() {
  const { user } = useAuthStore();
  const { balance, transactions, addFunds } = useWalletStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  const [addAmount, setAddAmount] = useState<string>("1000");
  const [selectedMethod, setSelectedMethod] = useState<string>("UPI");
  const [upiId, setUpiId] = useState<string>("user@oksbi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(addAmount);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsProcessing(true);
    setSuccessMessage("");

    setTimeout(() => {
      addFunds(num, `${selectedMethod} (${selectedMethod === "UPI" ? upiId : "Instant Bank Gateway"})`);
      setIsProcessing(false);
      setSuccessMessage(`₹${num.toLocaleString("en-IN")} successfully added to your GADDVYA Rail Wallet!`);
      setTimeout(() => setSuccessMessage(""), 5000);
    }, 800);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col transition-colors">
      {/* Official IRCTC Navigation Bar */}
      <IrctcNavBar />

      <main className="max-w-6xl mx-auto w-full p-4 md:p-8 flex-1">

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-5 py-4 rounded-2xl shadow-xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-xl">✅</span>
              <span className="text-sm font-semibold">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-emerald-400 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Card: GADDVYA Rail Wallet */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-700 bg-gradient-to-br from-zinc-900 via-gray-900 to-black p-6 sm:p-10 shadow-2xl">
          {/* Subtle Railway Grid / Track Graphic in background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              <line x1="0" y1="200" x2="800" y2="200" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 8" />
              <line x1="0" y1="230" x2="800" y2="230" stroke="#ffffff" strokeWidth="3" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  ⚡ Official Rail Transit Wallet
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  Zero Surcharge
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t("walletTitle")}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                {t("walletSubtitle")}. Seamlessly integrated with IRCTC Next-Gen reservation systems.
              </p>
              {user && (
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-300 font-mono">
                  <span>Linked Citizen: <strong className="text-white">{user.name}</strong></span>
                  {user.phone && <span>• +91 {user.phone}</span>}
                </div>
              )}
            </div>

            {/* Wallet Balance Display Box */}
            <div className="bg-zinc-950/80 border border-zinc-700/80 rounded-2xl p-6 min-w-[260px] text-left shadow-xl backdrop-blur-md">
              <span className="text-xs uppercase font-mono tracking-wider text-gray-400 block mb-1">
                {t("currentBalance")}
              </span>
              <div className="text-4xl font-extrabold text-white flex items-baseline gap-1">
                <span className="text-amber-400">₹</span>
                <span>{balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                <span>🛡️ 100% RBI Protected</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid: Add Money & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Money Form (2 columns on large screens) */}
          <div className="lg:col-span-2 bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>💳</span> {t("addMoney")}
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Instant recharge via UPI, RuPay, Net Banking. No payment gateway convenience fee.
            </p>

            <form onSubmit={handleAddMoney} className="space-y-6">
              {/* Quick Select Amounts */}
              <div>
                <label className="text-xs text-gray-300 block mb-2 font-medium">Quick Amount Selection:</label>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {["500", "1000", "2000", "5000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAddAmount(amt)}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                        addAmount === amt
                          ? "bg-white text-black border-white shadow-md dark:bg-white dark:text-black light:bg-black light:text-white"
                          : "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="text-xs text-gray-300 block mb-1.5 font-medium">Recharge Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-bold">₹</span>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 pl-9 pr-4 text-white text-lg font-bold focus:border-zinc-400 focus:outline-none font-mono"
                    placeholder="Enter amount (e.g. 1500)"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Min: ₹100 • Max per transaction: ₹50,000</p>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs text-gray-300 block mb-2 font-medium">Choose Payment Method:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "UPI", label: "UPI (Google Pay, PhonePe, Paytm)", icon: "📱" },
                    { id: "RuPay", label: "RuPay / Visa / Debit Card", icon: "💳" },
                    { id: "NetBanking", label: "Net Banking (SBI, HDFC, ICICI)", icon: "🏦" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedMethod === method.id
                          ? "bg-zinc-800 border-white text-white shadow-md ring-1 ring-white/30"
                          : "bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <div className="text-xl mb-1">{method.icon}</div>
                      <div className="text-xs font-bold text-white">{method.id}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedMethod === "UPI" && (
                <div>
                  <label className="text-xs text-gray-300 block mb-1.5 font-medium">UPI VPA Address</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm font-mono focus:border-zinc-400 focus:outline-none"
                    placeholder="mobile@upi or name@okaxis"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold py-3.5 rounded-xl text-sm transition shadow-xl shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
              >
                {isProcessing ? "Processing Secure Top-up..." : `Recharge ₹${parseFloat(addAmount || "0").toLocaleString("en-IN")} to Wallet →`}
              </button>
            </form>
          </div>

          {/* Benefits Card */}
          <div className="space-y-4">
            <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span>⭐</span> Why Use GADDVYA Wallet?
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Instant 1-Click Tatkal Checkout</h4>
                    <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">
                      Bypass payment gateway wait times during high-demand opening hours. No OTP lag or timeout failures.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
                    🔄
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t("instantRefund")}</h4>
                    <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">
                      Ticket cancellations are credited instantly back to your rail wallet within 3 seconds, rather than 3-5 bank business days.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-base shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Zero Gateway Convenience Fee</h4>
                    <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">
                      Save ₹15 to ₹30 on every single booking transaction compared to external credit/debit card gateways.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-xl text-xs space-y-3">
              <h4 className="font-bold text-white text-sm">Quick Actions</h4>
              <Link
                href="/search"
                className="block text-center bg-gray-800 hover:bg-gray-750 text-white font-semibold py-2.5 rounded-xl border border-gray-700 transition"
              >
                Book Tickets Using Wallet →
              </Link>
              <Link
                href="/bookings"
                className="block text-center bg-gray-800 hover:bg-gray-750 text-white font-semibold py-2.5 rounded-xl border border-gray-700 transition"
              >
                View Active Reservations
              </Link>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📑</span> {t("recentTransactions")}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Real-time ledger of your top-ups, ticket deductions, and auto-refund credits.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-950 border border-gray-800 rounded-xl p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "all"
                    ? "bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType("credit")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "credit"
                    ? "bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Credits (+)
              </button>
              <button
                type="button"
                onClick={() => setFilterType("debit")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "debit"
                    ? "bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Debits (-)
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No transactions found in this view.
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-850/40 rounded-xl px-3 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        txn.type === "credit"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                      }`}
                    >
                      {txn.type === "credit" ? "↓" : "↑"}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{txn.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span className="font-mono">{txn.id}</span>
                        <span>•</span>
                        <span>{txn.date}</span>
                        {txn.method && (
                          <>
                            <span>•</span>
                            <span className="text-gray-300">{txn.method}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <div
                      className={`text-base font-bold font-mono ${
                        txn.type === "credit" ? "text-emerald-400" : "text-zinc-200"
                      }`}
                    >
                      {txn.type === "credit" ? "+" : "-"}₹
                      {txn.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
