"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import AnimatedTrainBackground from "@/components/AnimatedTrainBackground";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [previewOtp, setPreviewOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
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
      setError(err.response?.data?.error || "Invalid email, phone, or password.");
    } finally {
      setLoading(false);
    }
  };

  // Send Login OTP
  const handleSendLoginOtp = async () => {
    if (!identifier.trim()) {
      setError("Please enter your registered Email or 10-digit Mobile Number.");
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
    setLoginMethod("password");
    setIdentifier(id);
    setPassword(pass);
  };

  return (
    <AnimatedTrainBackground>
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo size="md" />
        </Link>
        <ThemeToggle />
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl shadow-black/80 ring-1 ring-white/5">
        <h2 className="text-2xl font-bold text-white mb-1">Sign In to GADDVYA</h2>
        <p className="text-xs text-gray-300/80 mb-5">
          Access Indian Railways reservation services and active PNR passes
        </p>

        {/* Tab Switcher */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("password");
              setError("");
              setInfoMessage("");
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              loginMethod === "password"
                ? "bg-white text-black shadow-md dark:bg-white dark:text-black light:bg-black light:text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🔑 Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("otp");
              setError("");
              setInfoMessage("");
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              loginMethod === "otp"
                ? "bg-white text-black shadow-md dark:bg-white dark:text-black light:bg-black light:text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📱 Instant OTP Login
          </button>
        </div>

        {error && (
          <div className="text-red-400 mb-4 bg-red-950/40 border border-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="text-green-300 mb-4 bg-green-950/40 border border-green-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <span>ℹ️</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Demo Login Pills */}
        <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl mb-5">
          <p className="text-[11px] text-gray-400 mb-2 font-medium">⚡ Quick Demo Access:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("user@railx.com", "user123")}
              className="flex-1 bg-gray-800 hover:bg-gray-750 text-blue-300 text-xs py-1.5 px-2 rounded-lg font-mono border border-gray-700 transition"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("admin@railx.com", "admin123")}
              className="flex-1 bg-gray-800 hover:bg-gray-750 text-purple-300 text-xs py-1.5 px-2 rounded-lg font-mono border border-gray-700 transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* METHOD 1: Password Login Form */}
        {loginMethod === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                Email Address or 10-Digit Mobile Number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="user@railx.com or 9876543210"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 text-xs mb-1.5 block font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-zinc-400 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In to GADDVYA"}
            </button>
          </form>
        )}

        {/* METHOD 2: Instant OTP Login Form */}
        {loginMethod === "otp" && (
          <form onSubmit={handleOtpLogin} className="space-y-4">
            <div>
              <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                Registered Email or 10-Digit Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={otpSent}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="flex-1 bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-zinc-400 focus:outline-none disabled:opacity-60"
                  placeholder="user@railx.com or 9876543210"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendLoginOtp}
                  disabled={loading || otpTimer > 0}
                  className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 text-xs px-4 rounded-xl font-bold transition whitespace-nowrap dark:bg-white dark:text-black light:bg-black light:text-white"
                >
                  {otpTimer > 0 ? `Resend (${otpTimer}s)` : otpSent ? "Resend" : "Send OTP"}
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
                <label className="text-gray-300 text-xs mb-1.5 block font-medium">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white font-mono text-center tracking-widest text-lg"
                  placeholder="••••••"
                  required
                />
              </div>
            )}

            {otpSent && (
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify OTP & Sign In"}
              </button>
            )}
          </form>
        )}

        <p className="text-gray-400 text-xs text-center mt-6 border-t border-gray-800 pt-4">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-zinc-200 dark:text-zinc-200 light:text-zinc-900 font-bold hover:underline">
            Register New Account
          </Link>
        </p>
      </div>
    </AnimatedTrainBackground>
  );
}