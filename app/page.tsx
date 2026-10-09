"use client";

import { useState } from "react";
import Link from "next/link";
import IrctcNavBar from "@/components/IrctcNavBar";
import TatkalCountdownWidget from "@/components/TatkalCountdownWidget";
import LiveTrainTrackerModal from "@/components/LiveTrainTrackerModal";
import ECateringModal from "@/components/ECateringModal";
import RailAlertsModal from "@/components/RailAlertsModal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const { t } = useLanguageStore();
  const { user } = useAuthStore();

  const [showLiveTracker, setShowLiveTracker] = useState(false);
  const [showECatering, setShowECatering] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between transition-colors">
      {/* IRCTC-Style Official Navigation Bar */}
      <IrctcNavBar />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col items-center justify-center text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-750 px-4 py-1.5 rounded-full mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-zinc-300 font-medium">
            {t("heroPill")}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 max-w-4xl leading-tight">
          {t("heroTitle1")} <br />
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-400 light:from-blue-700 light:via-indigo-800 light:to-sky-700">
            {t("heroTitle2")}
          </span>
        </h1>

        <p className="text-gray-400 text-base sm:text-xl max-w-2xl mb-8 leading-relaxed">
          {t("heroSubtitle")}
        </p>

        {/* Live Tatkal Countdown Banner Widget */}
        <div className="w-full max-w-4xl mb-8">
          <TatkalCountdownWidget />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-12">
          <Link
            href="/search"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-base sm:text-lg transition shadow-xl shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <span>🔍 {t("searchBtn")}</span>
          </Link>
          <button
            onClick={() => setShowLiveTracker(true)}
            className="bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-500/40 px-6 py-3.5 rounded-2xl font-semibold text-base sm:text-lg transition flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>📡 Live Running Status</span>
          </button>
          <button
            onClick={() => setShowECatering(true)}
            className="bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-700/60 px-6 py-3.5 rounded-2xl font-semibold text-base sm:text-lg transition flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>🍱 e-Catering Meals</span>
          </button>
          <Link
            href="/wallet"
            className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-6 py-3.5 rounded-2xl font-semibold text-base sm:text-lg transition flex items-center gap-2 cursor-pointer"
          >
            <span>💳 {t("wallet")}</span>
          </Link>
          <Link
            href="/pnr"
            className="bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 px-6 py-3.5 rounded-2xl font-semibold text-base sm:text-lg transition flex items-center gap-2 cursor-pointer"
          >
            <span>🎫 {t("pnrBtn")}</span>
          </Link>
        </div>

        {/* Key Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full text-left mt-2">
          <div
            onClick={() => setShowLiveTracker(true)}
            className="bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition cursor-pointer hover:bg-slate-850/80 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">📡</span>
              <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/50">
                GPS LIVE
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition mb-1">
              Live GPS Tracking
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Real-time speed, platform numbers, upcoming station progress and exact delay calculation.
            </p>
          </div>

          <div
            onClick={() => setShowECatering(true)}
            className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition cursor-pointer hover:bg-slate-850/80 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🍱</span>
              <span className="text-[10px] font-bold bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full border border-amber-700/50">
                BERTH DELIVERY
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition mb-1">
              e-Catering Meals
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Order fresh Thalis, Jain Satvik, Biryani & Domino's pizza delivered right to your berth.
            </p>
          </div>

          <div
            onClick={() => setShowAlerts(true)}
            className="bg-slate-900/70 border border-slate-800 hover:border-red-500/50 p-5 rounded-2xl transition cursor-pointer hover:bg-slate-850/80 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🚨</span>
              <span className="text-[10px] font-bold bg-red-900/60 text-red-300 px-2 py-0.5 rounded-full border border-red-700/50">
                CRITICAL
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-red-300 transition mb-1">
              Fog & Rail Advisories
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Winter fog delays, rescheduled routes, track maintenance blocks, and festival specials.
            </p>
          </div>

          <Link
            href="/wallet"
            className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition cursor-pointer hover:bg-slate-850/80 group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">⚡</span>
              <span className="text-[10px] font-bold bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/50">
                INSTANT
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition mb-1">
              GADDVYA Rail Wallet
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              1-Click Tatkal checkout, zero bank gateway dropouts, and 100% instant ticket refund.
            </p>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-4">
          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition">
            <div className="text-3xl mb-3">🇮🇳</div>
            <h3 className="text-lg font-bold text-white mb-2">25,571 Daily Trains</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Vande Bharat, Tejas Rajdhani, Shatabdi, Garib Rath, and Express trains spanning Northern, Western, Southern, Eastern, and Central zones.
            </p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-bold text-white mb-2">Dual-Factor OTP Auth</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Verify both your 10-digit Indian mobile number and Gmail/Outlook/iCloud/Yahoo ID with real 6-digit OTPs.
            </p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="text-lg font-bold text-white mb-2">GADDVYA Rail Wallet</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              1-Click Tatkal checkout, zero gateway convenience fees, and 100% instant refunds within seconds on ticket cancellations.
            </p>
          </div>
        </div>

        {/* Visual Photographic Showcase Cards */}
        <div className="w-full mt-16 pt-12 border-t border-gray-850 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-2">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold block mb-1">
                Visual Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Next-Gen Indian Rail Transit
              </h2>
            </div>
            <Link
              href="/search"
              className="text-xs text-zinc-300 hover:text-white font-semibold flex items-center gap-1 transition"
            >
              Explore all train schedules →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vande Bharat Card */}
            <div className="group relative rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl transition hover:border-gray-700">
              <div
                className="h-64 sm:h-72 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/train_hero_bg.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
                  Semi-High Speed 160 KM/H
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition">
                  Vande Bharat & Tejas Rajdhani Express
                </h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                  Experience aerodynamically engineered trainsets with automatic plug doors, panoramic windows, regenerative braking, and executive coach comfort.
                </p>
              </div>
            </div>

            {/* Mega Station Terminal Card */}
            <div className="group relative rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl transition hover:border-gray-700">
              <div
                className="h-64 sm:h-72 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/railway_station_bg.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="bg-zinc-800/90 text-zinc-200 border border-zinc-600/40 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
                  Redeveloped World-Class Hubs
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition">
                  Modern Glass-Dome Mega Terminals
                </h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                  Transit through airport-standard railway terminals featuring seamless digital departure canopies, executive lounge pods, and contactless ticketing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Route Highlights */}
        <div className="w-full mt-16 pt-12 border-t border-gray-850">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
            {t("popularRoutes")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { route: "Delhi → Mumbai", train: "Tejas Rajdhani", time: "15h 40m" },
              { route: "Delhi → Varanasi", train: "Vande Bharat", time: "8h 00m" },
              { route: "Bengaluru → Chennai", train: "Vande Bharat", time: "4h 30m" },
              { route: "Delhi → Bhopal", train: "Bhopal Shatabdi", time: "8h 40m" },
            ].map((r, i) => (
              <Link
                key={i}
                href="/search"
                className="bg-gray-900/40 hover:bg-gray-850 border border-gray-800 p-4 rounded-xl text-left transition block group"
              >
                <p className="text-white font-semibold group-hover:text-zinc-300 transition text-sm">
                  {r.route}
                </p>
                <p className="text-gray-400 text-xs mt-1">{r.train}</p>
                <span className="text-[11px] text-gray-500 font-mono mt-2 block">⏳ {r.time}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GADDVYA Indian Railways Reservation. Built by Himanshu Goyal.</p>
          <div className="flex gap-6 items-center">
            <Link href="/search" className="hover:text-gray-300 transition">{t("searchTrains")}</Link>
            <Link href="/wallet" className="hover:text-gray-300 transition">{t("wallet")}</Link>
            <Link href="/bookings" className="hover:text-gray-300 transition">{t("myBookings")}</Link>
            <Link href="/admin" className="hover:text-gray-300 transition">{t("admin")}</Link>
            <a
              href="https://github.com/thehimanshugoyl/train-booking-24bda70369"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-300 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modals for Live Tracker, e-Catering & Rail Alerts */}
      {showLiveTracker && (
        <LiveTrainTrackerModal
          isOpen={showLiveTracker}
          onClose={() => setShowLiveTracker(false)}
        />
      )}
      {showECatering && (
        <ECateringModal
          isOpen={showECatering}
          onClose={() => setShowECatering(false)}
        />
      )}
      {showAlerts && (
        <RailAlertsModal
          isOpen={showAlerts}
          onClose={() => setShowAlerts(false)}
        />
      )}
    </div>
  );
}