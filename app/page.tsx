"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const { t } = useLanguageStore();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between transition-colors">
      {/* Navigation Bar */}
      <header className="border-b border-gray-850 bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/">
            <Logo size="md" />
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition"
            >
              {t("searchTrains")}
            </Link>
            <Link
              href="/pnr"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition hidden md:inline-block"
            >
              {t("pnrStatus")}
            </Link>
            <Link
              href="/wallet"
              className="text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>💳</span> {t("wallet")}
            </Link>

            {/* Language Selector (English / Hindi / Punjabi) */}
            <LanguageSelector />

            {/* Black / White Theme Switcher */}
            <ThemeToggle />

            <div className="h-5 w-[1px] bg-gray-800 mx-1 hidden sm:block"></div>

            {user ? (
              <Link
                href="/profile"
                className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white"
              >
                👤 {user.name}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-200 hover:text-white bg-gray-800/80 hover:bg-gray-700/80 border border-gray-750 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-black hover:bg-zinc-200 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white"
                >
                  {t("register")}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full flex flex-col items-center justify-center text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-750 px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-zinc-300 font-medium">
            {t("heroPill")}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          {t("heroTitle1")} <br />
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-400 light:from-black light:via-zinc-800 light:to-zinc-600">
            {t("heroTitle2")}
          </span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          {t("heroSubtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link
            href="/search"
            className="bg-white text-black hover:bg-zinc-200 px-8 py-3.5 rounded-2xl font-bold text-lg transition shadow-xl shadow-white/10 flex items-center gap-2 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
          >
            <span>{t("searchBtn")}</span>
          </Link>
          <Link
            href="/wallet"
            className="bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-700/60 px-7 py-3.5 rounded-2xl font-semibold text-lg transition flex items-center gap-2"
          >
            <span>💳 {t("wallet")}</span>
          </Link>
          <Link
            href="/register"
            className="bg-gray-850 hover:bg-gray-800 text-gray-200 border border-gray-750 px-8 py-3.5 rounded-2xl font-semibold text-lg transition flex items-center gap-2"
          >
            <span>{t("createAccountBtn")}</span>
          </Link>
          <Link
            href="/pnr"
            className="bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 px-6 py-3.5 rounded-2xl font-semibold text-lg transition flex items-center gap-2"
          >
            <span>{t("pnrBtn")}</span>
          </Link>
        </div>

        {/* Key Features Cards */}
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
    </div>
  );
}