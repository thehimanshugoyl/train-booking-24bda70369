"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import AnimatedTrainBackground from "@/components/AnimatedTrainBackground";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import IrctcStyleBanner from "@/components/IrctcStyleBanner";

export default function Login() {
  // Tabs: User Login vs Agent Login (from IRCTC modal)
  const [userType, setUserType] = useState<"user" | "agent">("user");
  // Sub-method: Password vs OTP
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [previewOtp, setPreviewOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle Standard Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", {
        identifier,
        password,
      });
      setAuth(res.data.user, res.data.token);
      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/search");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid username, email, phone, or password.");
    } finally {
      setLoading(false);
    }
  };

  // Send Login OTP
  const handleSendLoginOtp = async () => {
    if (!identifier.trim()) {
      setError("Please enter your registered Email or 10-digit Indian Mobile Number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const isEmail = identifier.includes("@");
      const res = await axios.post("/api/auth/send-otp", {
        identifier,
        type: isEmail ? "email" : "phone",
        purpose: "login",
      });
      setOtpSent(true);
      setOtpTimer(60);
      setInfoMessage(res.data.message);
      if (res.data.previewOtp) {
        setPreviewOtp(res.data.previewOtp);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send Login OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Instant OTP Login
  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login-otp", {
        identifier,
        otp,
      });
      setAuth(res.data.user, res.data.token);
      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/search");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (id: string, pass: string) => {
    setUserType("user");
    setLoginMethod("password");
    setIdentifier(id);
    setPassword(pass);
  };

  return (
    <AnimatedTrainBackground>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full max-w-lg mb-4">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      {/* Main IRCTC-Style Modal Card */}
      <div className="w-full max-w-lg bg-gray-900/90 dark:bg-gray-900/90 light:bg-white border border-white/10 dark:border-white/10 light:border-zinc-200 rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden transition-colors">
        {/* IRCTC-Style Train Graphic Banner with Logo on the RIGHT SIDE */}
        <IrctcStyleBanner onClose={() => router.push("/")} />

        {/* USER LOGIN vs AGENT LOGIN Tabs (Exact IRCTC Modal Pattern) */}
        <div className="grid grid-cols-2 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-zinc-100 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
          <button
            type="button"
            onClick={() => setUserType("user")}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer border-b-2 ${
              userType === "user"
                ? "text-blue-400 dark:text-blue-400 light:text-blue-600 border-blue-500 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white"
                : "text-gray-400 dark:text-gray-400 light:text-zinc-600 border-transparent hover:text-white"
            }`}
          >
            {/* User Silhouette Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{t("userLogin")}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUserType("agent");
              fillCredentials("admin@railx.com", "admin123");
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer border-b-2 ${
              userType === "agent"
                ? "text-amber-400 dark:text-amber-400 light:text-amber-600 border-amber-500 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white"
                : "text-gray-400 dark:text-gray-400 light:text-zinc-600 border-transparent hover:text-white"
            }`}
          >
            {/* Agent Headset Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
            <span>{t("agentLogin")}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* Sub Switcher: Password vs OTP */}
          <div className="flex justify-between items-center mb-5 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-100 p-1 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("password");
                setError("");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                loginMethod === "password"
                  ? "bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🔑 {t("passwordLogin")}
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("otp");
                setError("");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                loginMethod === "otp"
                  ? "bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📱 {t("otpLogin")}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 mb-4 bg-red-950/50 border border-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Info Message */}
          {infoMessage && (
            <div className="text-emerald-300 mb-4 bg-emerald-950/50 border border-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <span>ℹ️</span>
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Quick Demo Access Pills */}
          <div className="bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 p-2.5 rounded-xl mb-5 flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[11px] font-medium">⚡ Demo Autofill:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("user@railx.com", "user123")}
                className="bg-zinc-800 hover:bg-zinc-700 text-blue-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-zinc-700 transition"
              >
                Citizen User
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("admin@railx.com", "admin123")}
                className="bg-zinc-800 hover:bg-zinc-700 text-purple-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-zinc-700 transition"
              >
                IRCTC Admin
              </button>
            </div>
          </div>

          {/* ── PASSWORD LOGIN (Matching IRCTC modal input styling) ── */}
          {loginMethod === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {/* Username Input with User icon on RIGHT */}
              <div className="relative">
                <label className="text-xs text-gray-300 dark:text-gray-300 light:text-zinc-700 block mb-1.5 font-medium">
                  {userType === "agent" ? "Agent ID / Corporate Email" : "Username"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      userType === "agent"
                        ? "Enter Agent ID or admin@railx.com"
                        : "Enter Username or Email / Phone"
                    }
                    className="w-full bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-50 border border-zinc-750 dark:border-zinc-750 light:border-zinc-300 rounded-xl py-3 pl-4 pr-11 text-white dark:text-white light:text-zinc-900 text-sm focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                  {/* Right-aligned User Icon */}
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 light:text-zinc-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input with Eye Toggle on RIGHT */}
              <div className="relative">
                <label className="text-xs text-gray-300 dark:text-gray-300 light:text-zinc-700 block mb-1.5 font-medium">
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("enterPassword")}
                    className="w-full bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-50 border border-zinc-750 dark:border-zinc-750 light:border-zinc-300 rounded-xl py-3 pl-4 pr-11 text-white dark:text-white light:text-zinc-900 text-sm focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                  {/* Right-aligned Eye Toggle Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Account Details Link (Centered, from IRCTC modal) */}
              <div className="text-center pt-1 pb-1">
                <button
                  type="button"
                  onClick={() =>
                    alert("For security, please use Instant OTP Login or contact Railway Helpline 139.")
                  }
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 dark:text-blue-400 light:text-blue-600 underline cursor-pointer"
                >
                  {t("forgotDetails")}
                </button>
              </div>

              {/* IRCTC-Style Action Button: ➔ LOGIN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-full text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {/* Arrow inside circle icon matching the screenshot */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="uppercase tracking-wider font-extrabold">
                  {loading ? "Authenticating..." : "LOGIN"}
                </span>
              </button>
            </form>
          )}

          {/* ── OTP LOGIN FORM ── */}
          {loginMethod === "otp" && (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 dark:text-gray-300 light:text-zinc-700 block mb-1.5 font-medium">
                  {t("usernameOrEmail")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={otpSent}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="flex-1 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-50 border border-zinc-750 dark:border-zinc-750 light:border-zinc-300 rounded-xl p-3 text-white dark:text-white light:text-zinc-900 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-60"
                    placeholder="user@railx.com or 9876543210"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendLoginOtp}
                    disabled={loading || otpTimer > 0}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs px-4 rounded-xl font-bold transition whitespace-nowrap cursor-pointer"
                  >
                    {otpTimer > 0 ? `Resend (${otpTimer}s)` : otpSent ? "Resend" : t("sendOtp")}
                  </button>
                </div>
              </div>

              {previewOtp && (
                <div className="bg-zinc-850 border border-zinc-700 p-2.5 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-zinc-300">⚡ Dev Preview Code:</span>
                  <span className="font-mono font-bold text-amber-300 text-base">{previewOtp}</span>
                  <button
                    type="button"
                    onClick={() => setOtp(previewOtp)}
                    className="bg-zinc-700 hover:bg-zinc-600 px-2 py-0.5 rounded text-white text-[11px] font-semibold"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {otpSent && (
                <div>
                  <label className="text-xs text-gray-300 dark:text-gray-300 light:text-zinc-700 block mb-1.5 font-medium">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-3 text-white font-mono text-center tracking-widest text-lg focus:border-blue-500 focus:outline-none"
                    placeholder="••••••"
                    required
                  />
                </div>
              )}

              {otpSent && (
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-full text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="uppercase tracking-wider font-extrabold">
                    {loading ? "Verifying..." : t("verifyOtp")}
                  </span>
                </button>
              )}
            </form>
          )}

          {/* —— OR —— Divider (Matching IRCTC modal) */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-300" />
            </div>
            <span className="relative bg-gray-900 dark:bg-gray-900 light:bg-white px-3 text-xs uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-zinc-500 font-semibold">
              OR
            </span>
          </div>

          {/* Don't have an account? Sign Up Pill (Matching IRCTC modal) */}
          <Link
            href="/register"
            className="w-full block text-center py-3 px-4 rounded-full border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-zinc-50 hover:bg-zinc-800/80 dark:hover:bg-zinc-800/80 light:hover:bg-zinc-100 transition shadow-sm text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-zinc-800"
          >
            {t("dontHaveAccount")}{" "}
            <span className="font-bold text-blue-400 dark:text-blue-400 light:text-blue-600 ml-1">
              {t("signUp")}
            </span>
          </Link>
        </div>
      </div>
    </AnimatedTrainBackground>
  );
}