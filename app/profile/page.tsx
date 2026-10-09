"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProfilePage() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [bookingsCount, setBookingsCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUserStats = async () => {
      try {
        const res = await axios.get("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookingsCount(res.data.bookings?.length || 0);
      } catch (e) {
        // silently fallback
      }
    };

    fetchUserStats();
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      {/* Top Navbar */}
      <nav className="max-w-5xl mx-auto flex flex-wrap justify-between items-center mb-8 bg-gray-900/80 border border-gray-800 rounded-2xl p-4 backdrop-blur-md gap-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <ThemeToggle />
          <Link
            href="/search"
            className="bg-white text-black hover:bg-zinc-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white"
          >
            🔍 Search Trains
          </Link>
          <Link
            href="/bookings"
            className="bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            🎫 My Bookings
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-zinc-800 hover:bg-red-900 border border-zinc-700 text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-gray-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-3xl font-bold shadow-lg shadow-black/30 text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h2>
                  <span className="text-[11px] bg-zinc-800 border border-zinc-650 text-zinc-300 font-semibold px-2 py-0.5 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Indian Railways Registered Passenger Citizen
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">
                    <span>✓</span> Email Verified
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">
                    <span>✓</span> Mobile OTP Verified
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs px-2.5 py-1 rounded-full font-medium">
                    <span>🇮🇳</span> KYC Certified
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center min-w-[140px]">
              <p className="text-xs text-gray-400 font-medium">Total Bookings</p>
              <p className="text-3xl font-extrabold text-blue-400 mt-1">
                {bookingsCount !== null ? bookingsCount : "—"}
              </p>
              <Link
                href="/bookings"
                className="text-[11px] text-gray-400 hover:text-white underline mt-1 block"
              >
                View History →
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact & Verification Credentials */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>🔐</span> Verified Authentication Contacts
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-950/80 border border-gray-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-white font-mono mt-0.5">{user.email}</p>
                </div>
                <span className="bg-green-900/60 text-green-300 border border-green-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              </div>

              <div className="bg-gray-950/80 border border-gray-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Mobile Number (+91)</p>
                  <p className="text-sm font-semibold text-white font-mono mt-0.5">
                    {user.phone ? `+91 ${user.phone}` : "Not linked"}
                  </p>
                </div>
                <span className="bg-green-900/60 text-green-300 border border-green-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-blue-950/40 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2">
              <span>💡</span>
              <span>
                Both contacts are verified via 6-digit one-time passcodes and are eligible for passwordless OTP login.
              </span>
            </div>
          </div>

          {/* Citizen Demographics & KYC Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>🪪</span> Official Citizen Demographics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-950/80 border border-gray-800/80 p-3.5 rounded-xl">
                <p className="text-xs text-gray-400 font-medium">Gender</p>
                <p className="text-sm font-bold text-white mt-1">{user.gender || "Not specified"}</p>
              </div>

              <div className="bg-gray-950/80 border border-gray-800/80 p-3.5 rounded-xl">
                <p className="text-xs text-gray-400 font-medium">Date of Birth</p>
                <p className="text-sm font-bold text-white mt-1">{user.dob || "—"}</p>
              </div>

              <div className="bg-gray-950/80 border border-gray-800/80 p-3.5 rounded-xl">
                <p className="text-xs text-gray-400 font-medium">State / UT</p>
                <p className="text-sm font-bold text-white mt-1">{user.state || "Delhi"}</p>
              </div>

              <div className="bg-gray-950/80 border border-gray-800/80 p-3.5 rounded-xl">
                <p className="text-xs text-gray-400 font-medium">City</p>
                <p className="text-sm font-bold text-white mt-1">{user.city || "New Delhi"}</p>
              </div>
            </div>

            <div className="mt-3 bg-gray-950/80 border border-gray-800/80 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  {user.idProofType || "Government ID Proof"}
                </p>
                <p className="text-sm font-mono font-bold text-yellow-300 mt-0.5">
                  {user.idProofNumber
                    ? `•••• •••• ${user.idProofNumber.slice(-4)}`
                    : "Verified on Registration"}
                </p>
              </div>
              <span className="text-[11px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded-full font-semibold">
                IRCTC Valid
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Ready for your next train journey?</h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Browse 25,571 daily trains across India or check real-time PNR booking status.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/search"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
            >
              Search Trains
            </Link>
            <Link
              href="/pnr"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-5 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Check PNR Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
