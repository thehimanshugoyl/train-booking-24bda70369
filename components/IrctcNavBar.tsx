"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useWalletStore } from "@/store/useWalletStore";
import LiveTrainTrackerModal from "@/components/LiveTrainTrackerModal";
import ECateringModal from "@/components/ECateringModal";
import RailAlertsModal from "@/components/RailAlertsModal";

export default function IrctcNavBar() {
  const { user, logout } = useAuthStore();
  const { balance } = useWalletStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();

  // Modals
  const [showLiveTracker, setShowLiveTracker] = useState(false);
  const [showECatering, setShowECatering] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live clock
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
          " | " +
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }) +
          " IST"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const isHome = pathname === "/";
  const isSearch = pathname === "/search";
  const isWallet = pathname === "/wallet";
  const isBookings = pathname === "/bookings";
  const isAdmin = pathname === "/admin";
  const isPnr = pathname === "/pnr";

  return (
    <>
      <header className="w-full bg-slate-900 border-b border-slate-800 text-white z-40 relative shadow-xl">
        {/* ── 1. TOP RAIL SERVICE UTILITY STRIP ── */}
        <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 sm:px-8 py-1.5 text-[11px] text-slate-300 flex flex-wrap justify-between items-center gap-2">
          {/* Live Date / Time & Helpline */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono text-amber-300 font-semibold flex items-center gap-1">
              <span>🕒</span> {currentTime || "Live IST"}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <span>📞</span> 24x7 Rail Helpline: <strong className="text-white">139</strong>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <button
              onClick={() => setShowAlerts(true)}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>🚨 Live Rail Alerts</span>
            </button>
          </div>

          {/* Right Tools: Language, Theme, Role, Profile */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Wallet pill if logged in */}
            {user && (
              <Link
                href="/wallet"
                className="bg-amber-950/80 hover:bg-amber-900/80 border border-amber-600/50 text-amber-300 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold flex items-center gap-1 transition"
                title="GADDVYA Rail Wallet"
              >
                <span>💳</span>
                <span>₹{balance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </Link>
            )}

            <LanguageSelector />
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-700">
                <Link
                  href="/profile"
                  className="bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded-full text-white font-medium flex items-center gap-1 transition"
                >
                  <span>👤</span>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>
                {user.role === "admin" && (
                  <span className="bg-purple-950 border border-purple-700 text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Admin
                  </span>
                )}
                {user.role === "agent" && (
                  <span className="bg-amber-950 border border-amber-600 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Agent
                  </span>
                )}
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="text-red-400 hover:text-red-300 text-[11px] px-1 font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-700">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-black hover:bg-slate-200 px-2.5 py-0.5 rounded-full font-bold transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. OFFICIAL EMBLEMS & BRAND LOGO ROW ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="transition hover:opacity-95">
              <Logo size="md" />
            </Link>
            <div className="hidden lg:block border-l border-slate-700 pl-3">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase block">
                Official Rail Booking Platform
              </span>
              <span className="text-xs text-slate-300">
                Ministry of Railways • Indian Railway Catering & Tourism Corporation
              </span>
            </div>
          </div>

          {/* Official Crests */}
          <div className="flex items-center gap-3">
            {/* Quick Live GPS Status Action Button */}
            <button
              onClick={() => setShowLiveTracker(true)}
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>📡 Live GPS Train Tracker</span>
            </button>

            {/* Indian Railways Crest Badge */}
            <div
              className="w-10 h-10 rounded-full bg-red-700 border-2 border-white shadow-lg flex items-center justify-center p-1"
              title="Indian Railways Official Emblem"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#ffffff" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="50" cy="50" r="28" fill="#ffffff" />
                <path d="M40 55 L60 55 L58 42 L42 42 Z" fill="#b91c1c" />
                <rect x="44" y="38" width="12" height="4" fill="#b91c1c" />
                <circle cx="45" cy="57" r="3" fill="#ffffff" stroke="#b91c1c" strokeWidth="1" />
                <circle cx="55" cy="57" r="3" fill="#ffffff" stroke="#b91c1c" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── 3. THE ICONIC IRCTC BLUE NAVIGATION PILL BAR (From User Screenshot) ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-3" ref={dropdownRef}>
          <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-full px-4 sm:px-6 py-2 shadow-2xl border border-blue-400/30 flex items-center justify-between overflow-x-auto text-xs sm:text-sm font-bold tracking-wide">
            <div className="flex items-center gap-1 sm:gap-4 shrink-0">
              {/* HOME Tab (with underline matching user image) */}
              <Link
                href="/"
                className={`px-3 py-1.5 uppercase transition relative whitespace-nowrap ${
                  isHome ? "text-white" : "text-blue-100 hover:text-white"
                }`}
              >
                HOME
                {isHome && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-white rounded-full shadow-sm" />
                )}
              </Link>

              {/* TRAINS Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("trains")}
                  className={`px-3 py-1.5 uppercase flex items-center gap-1 transition cursor-pointer whitespace-nowrap ${
                    isSearch || isPnr || openDropdown === "trains"
                      ? "text-white"
                      : "text-blue-100 hover:text-white"
                  }`}
                >
                  <span>TRAINS</span>
                  <span className="text-[10px]">⌄</span>
                </button>
                {openDropdown === "trains" && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn">
                    <Link
                      href="/search"
                      onClick={() => setOpenDropdown(null)}
                      className="block p-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white font-medium"
                    >
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>🔍</span> Search 25,500+ Trains
                      </div>
                      <span className="text-[11px] text-slate-400">Pan-India timetables & class fares</span>
                    </Link>
                    <Link
                      href="/pnr"
                      onClick={() => setOpenDropdown(null)}
                      className="block p-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white font-medium"
                    >
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>🎫</span> PNR Status & Confirmation
                      </div>
                      <span className="text-[11px] text-slate-400">Live 10-digit PNR booking tracker</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        setShowLiveTracker(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white font-medium cursor-pointer"
                    >
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span>📡</span> Live Train Running Status
                      </div>
                      <span className="text-[11px] text-slate-400">GPS location, delay, & platform numbers</span>
                    </button>
                  </div>
                )}
              </div>

              {/* MEALS Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("meals")}
                  className={`px-3 py-1.5 uppercase flex items-center gap-1 transition cursor-pointer whitespace-nowrap ${
                    openDropdown === "meals" ? "text-white" : "text-blue-100 hover:text-white"
                  }`}
                >
                  <span>MEALS</span>
                  <span className="text-[10px]">⌄</span>
                </button>
                {openDropdown === "meals" && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        setShowECatering(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white font-medium cursor-pointer"
                    >
                      <div className="font-bold text-orange-400 flex items-center gap-1.5">
                        <span>🍱</span> IRCTC e-Catering Food on Track
                      </div>
                      <span className="text-[11px] text-slate-400">Order hot food delivered to seat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        setShowECatering(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white font-medium cursor-pointer"
                    >
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span>🥗</span> Pure Jain Satvik Food
                      </div>
                      <span className="text-[11px] text-slate-400">No onion, no garlic certified meals</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        setShowECatering(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 hover:text-white font-medium cursor-pointer"
                    >
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <span>🍕</span> Domino's & Haldiram's Delivery
                      </div>
                      <span className="text-[11px] text-slate-400">Pre-ordered station delivery</span>
                    </button>
                  </div>
                )}
              </div>

              {/* LOYALTY Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("loyalty")}
                  className={`px-3 py-1.5 uppercase flex items-center gap-1 transition cursor-pointer whitespace-nowrap ${
                    openDropdown === "loyalty" ? "text-white" : "text-blue-100 hover:text-white"
                  }`}
                >
                  <span>LOYALTY</span>
                  <span className="text-[10px]">⌄</span>
                </button>
                {openDropdown === "loyalty" && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                    <div className="p-2.5">
                      <p className="font-bold text-amber-300">👑 Rail Citizen Loyalty Program</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Earn 5 reward points for every ₹100 spent. Redeem for free berth upgrades.
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-emerald-400">
                        Tier: <strong>Gold Citizen Pass</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* E-WALLET Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("wallet")}
                  className={`px-3 py-1.5 uppercase flex items-center gap-1 transition cursor-pointer whitespace-nowrap ${
                    isWallet || openDropdown === "wallet" ? "text-white" : "text-blue-100 hover:text-white"
                  }`}
                >
                  <span>E-WALLET</span>
                  <span className="text-[10px]">⌄</span>
                </button>
                {openDropdown === "wallet" && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn">
                    <Link
                      href="/wallet"
                      onClick={() => setOpenDropdown(null)}
                      className="block p-2.5 rounded-xl hover:bg-slate-800 text-xs font-medium"
                    >
                      <div className="font-bold text-amber-300 flex items-center justify-between">
                        <span>💳 GADDVYA Rail Wallet</span>
                        <span className="text-white font-mono">₹{balance.toLocaleString("en-IN")}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">1-Click Tatkal checkout & instant refunds</span>
                    </Link>
                    <Link
                      href="/wallet"
                      onClick={() => setOpenDropdown(null)}
                      className="block p-2.5 rounded-xl hover:bg-slate-800 text-xs font-medium text-emerald-300"
                    >
                      <span>➕ Add Money / Top-up</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* ALERTS Button */}
              <button
                type="button"
                onClick={() => setShowAlerts(true)}
                className="px-3 py-1.5 uppercase transition text-blue-100 hover:text-white cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <span>ALERTS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </button>

              {/* CONTACT US */}
              <button
                type="button"
                onClick={() =>
                  alert("📞 24x7 Indian Railways Passenger Helpline: 139\n\nFor grievances: support@gaddvya.rail.gov.in")
                }
                className="px-3 py-1.5 uppercase transition text-blue-100 hover:text-white cursor-pointer whitespace-nowrap"
              >
                CONTACT US
              </button>
            </div>

            {/* Role-Specific Right Action Pills */}
            <div className="flex items-center gap-2 shrink-0 pl-4 border-l border-blue-500/40">
              {user?.role === "admin" ? (
                <Link
                  href="/admin"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    isAdmin
                      ? "bg-white text-black shadow-lg"
                      : "bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/50"
                  }`}
                >
                  <span>⚙️ Admin Panel</span>
                </Link>
              ) : user?.role === "agent" ? (
                <div className="flex items-center gap-2">
                  <span className="bg-amber-950/90 border border-amber-500/60 text-amber-300 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <span>🎧</span> Agent Portal
                  </span>
                  <Link
                    href="/bookings"
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-blue-950 hover:bg-blue-50 transition shadow-md"
                  >
                    Client Slips
                  </Link>
                </div>
              ) : user ? (
                <Link
                  href="/bookings"
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                    isBookings
                      ? "bg-white text-black shadow-lg"
                      : "bg-blue-900/60 hover:bg-blue-800 text-white border border-blue-400/40"
                  }`}
                >
                  <span>🎫 My Bookings</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-blue-950 hover:bg-blue-50 transition shadow-md"
                >
                  Sign In →
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Modals */}
      <LiveTrainTrackerModal isOpen={showLiveTracker} onClose={() => setShowLiveTracker(false)} />
      <ECateringModal isOpen={showECatering} onClose={() => setShowECatering(false)} />
      <RailAlertsModal isOpen={showAlerts} onClose={() => setShowAlerts(false)} />
    </>
  );
}
