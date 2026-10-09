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
import { isAllowedEmail, isValidIndianPhone, cleanIndianPhone } from "@/lib/validation";

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const { t } = useLanguageStore();

  // Personal details
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    dob: "",
    state: "Delhi",
    city: "New Delhi",
    idProofType: "Aadhaar Card",
    idProofNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // OTP Verification States
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Timers & Preview OTPs (for instant testing)
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [emailPreviewOtp, setEmailPreviewOtp] = useState("");
  const [phonePreviewOtp, setPhonePreviewOtp] = useState("");

  const { setAuth } = useAuthStore();
  const router = useRouter();

  // Countdown timers for OTP resend
  useEffect(() => {
    let interval: any;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: any;
    if (phoneTimer > 0) {
      interval = setInterval(() => setPhoneTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneTimer]);

  // Send Email OTP
  const handleSendEmailOtp = async () => {
    const cleanMail = form.email.trim().toLowerCase();
    if (!cleanMail) {
      setError("Please enter your email address.");
      return;
    }
    if (!isAllowedEmail(cleanMail)) {
      setError(
        "Only Gmail, Outlook, iCloud, and Yahoo email addresses are allowed (@gmail.com, @outlook.com, @hotmail.com, @icloud.com, @yahoo.com, etc.)."
      );
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/send-otp", {
        identifier: cleanMail,
        type: "email",
        purpose: "register",
        name: form.name,
      });
      setEmailOtpSent(true);
      setEmailTimer(60);
      setInfoMessage(res.data.message);
      if (res.data.previewOtp) {
        setEmailPreviewOtp(res.data.previewOtp);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send Email OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setError("Please enter the 6-digit email OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/verify-otp", {
        identifier: form.email.trim().toLowerCase(),
        otp: emailOtp,
        purpose: "register",
      });
      setIsEmailVerified(true);
      setInfoMessage("✅ Email address successfully verified!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid or expired Email OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Send Phone OTP
  const handleSendPhoneOtp = async () => {
    const cleanPhone = cleanIndianPhone(form.phone);
    if (!isValidIndianPhone(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/send-otp", {
        identifier: cleanPhone,
        type: "phone",
        purpose: "register",
      });
      setPhoneOtpSent(true);
      setPhoneTimer(60);
      setInfoMessage(res.data.message);
      if (res.data.previewOtp) {
        setPhonePreviewOtp(res.data.previewOtp);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send Phone OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      setError("Please enter the 6-digit phone OTP.");
      return;
    }
    const cleanPhone = cleanIndianPhone(form.phone);
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/verify-otp", {
        identifier: cleanPhone,
        otp: phoneOtp,
        purpose: "register",
      });
      setIsPhoneVerified(true);
      setInfoMessage("✅ Indian mobile number successfully verified!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid or expired Mobile OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Complete Registration
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!isEmailVerified) {
      setError("Please verify your email address OTP before completing registration.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/register", {
        ...form,
        email: form.email.trim().toLowerCase(),
        phone: cleanIndianPhone(form.phone),
        emailOtp,
        phoneOtp,
      });
      setAuth(res.data.user, res.data.token);
      router.push("/search");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isEmailValidFormat = isAllowedEmail(form.email);
  const isPhoneValidFormat = isValidIndianPhone(form.phone);

  return (
    <AnimatedTrainBackground>
      <div className="flex items-center justify-between w-full max-w-xl mb-6">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl shadow-black/80 ring-1 ring-white/5">
        {/* Step Wizard Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          {[
            { num: 1, title: "1. Citizen Profile" },
            { num: 2, title: "2. OTP Verification" },
            { num: 3, title: "3. Security Credentials" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? "bg-white text-black ring-4 ring-white/20 dark:bg-white dark:text-black light:bg-black light:text-white"
                    : step > s.num
                    ? "bg-emerald-500 text-black"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  step === s.num ? "text-white font-bold" : "text-gray-500"
                }`}
              >
                {s.title.split(". ")[1]}
              </span>
            </div>
          ))}
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

        {/* ── STEP 1: CITIZEN / PASSENGER PROFILE ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-1">Passenger Profile & ID Details</h2>
            <p className="text-xs text-gray-400 mb-4">
              Enter your real citizen identification for railway ticketing and e-pass issuance.
            </p>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-medium">{t("fullName")}</label>
              <input
                type="text"
                placeholder="e.g. Himanshu Goyal"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-zinc-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-medium">{t("gender")}</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1 font-medium">{t("dob")}</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-medium">State / UT</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi, Punjab"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1 font-medium">City</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi, Amritsar"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs text-gray-300 block mb-1 font-medium">{t("idProof")}</label>
                <select
                  value={form.idProofType}
                  onChange={(e) => setForm({ ...form, idProofType: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm"
                >
                  <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                  <option value="PAN Card">PAN Card (Income Tax)</option>
                  <option value="Voter ID">Voter ID (Election Commission)</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1 font-medium">ID Proof Number</label>
                <input
                  type="text"
                  placeholder="e.g. 5432 9876 1234"
                  value={form.idProofNumber}
                  onChange={(e) => setForm({ ...form, idProofNumber: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!form.name.trim() || !form.dob) {
                  setError("Please fill in your Full Name and Date of Birth.");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-3.5 rounded-xl text-sm transition mt-4 shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
            >
              Continue to OTP Verification →
            </button>
          </div>
        )}

        {/* ── STEP 2: DUAL OTP VERIFICATION (EMAIL & PHONE) ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Email & Phone Verification</h2>
              <p className="text-xs text-gray-400">
                Authenticate your email and mobile number using 6-digit one-time passwords (OTP).
              </p>
            </div>

            {/* Email OTP Card */}
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
                  <span>✉️ Registered Email Address</span>
                  {isEmailVerified && (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      ✓ Verified
                    </span>
                  )}
                </label>
              </div>

              {/* Email allowed hint banner */}
              <div className="mb-2 text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>🔒</span>
                <span>{t("allowedEmailsNote")}</span>
              </div>

              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  disabled={isEmailVerified}
                  placeholder="yourname@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`flex-1 bg-gray-950 border rounded-xl p-2.5 text-white text-xs disabled:opacity-60 focus:outline-none ${
                    form.email && !isEmailValidFormat
                      ? "border-red-500/80"
                      : form.email && isEmailValidFormat
                      ? "border-emerald-500"
                      : "border-gray-700"
                  }`}
                />
                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={loading || emailTimer > 0 || !isEmailValidFormat}
                    className="bg-white text-black hover:bg-zinc-200 disabled:opacity-40 text-xs px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap dark:bg-white dark:text-black light:bg-black light:text-white"
                  >
                    {emailTimer > 0 ? `Resend (${emailTimer}s)` : emailOtpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                )}
              </div>

              {form.email && !isEmailValidFormat && (
                <p className="text-[11px] text-red-400 mb-2">
                  ⚠️ Invalid domain. Please use a valid @gmail.com, @outlook.com, @icloud.com, or @yahoo.com address.
                </p>
              )}

              {emailPreviewOtp && !isEmailVerified && (
                <div className="bg-zinc-850 border border-zinc-700 p-2 rounded-lg mb-3 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">⚡ Dev Preview Code:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{emailPreviewOtp}</span>
                  <button
                    type="button"
                    onClick={() => setEmailOtp(emailPreviewOtp)}
                    className="text-[11px] bg-zinc-700 hover:bg-zinc-600 px-2 py-0.5 rounded text-white font-semibold"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {emailOtpSent && !isEmailVerified && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Email OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-white font-mono text-center tracking-widest text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={loading || emailOtp.length !== 6}
                    className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 text-xs px-5 py-2.5 rounded-xl font-bold transition dark:bg-white dark:text-black light:bg-black light:text-white"
                  >
                    Verify Email
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Phone OTP Card */}
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
                  <span>📱 Indian Mobile Number (+91)</span>
                  {isPhoneVerified && (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      ✓ Verified
                    </span>
                  )}
                </label>
              </div>

              {/* Phone allowed hint banner */}
              <div className="mb-2 text-[11px] text-blue-300/90 bg-blue-950/30 border border-blue-800/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>🇮🇳</span>
                <span>{t("indianPhoneOnly")}</span>
              </div>

              <div className="flex gap-2 mb-2">
                <span className="bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-gray-400 text-xs font-mono flex items-center">
                  +91
                </span>
                <input
                  type="text"
                  maxLength={10}
                  disabled={isPhoneVerified}
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                  className={`flex-1 bg-gray-950 border rounded-xl p-2.5 text-white text-xs font-mono disabled:opacity-60 focus:outline-none ${
                    form.phone && !isPhoneValidFormat
                      ? "border-red-500/80"
                      : form.phone && isPhoneValidFormat
                      ? "border-emerald-500"
                      : "border-gray-700"
                  }`}
                />
                {!isPhoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={loading || phoneTimer > 0 || !isPhoneValidFormat}
                    className="bg-white text-black hover:bg-zinc-200 disabled:opacity-40 text-xs px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap dark:bg-white dark:text-black light:bg-black light:text-white"
                  >
                    {phoneTimer > 0 ? `Resend (${phoneTimer}s)` : phoneOtpSent ? "Resend OTP" : "Send SMS"}
                  </button>
                )}
              </div>

              {form.phone && !isPhoneValidFormat && (
                <p className="text-[11px] text-red-400 mb-2">
                  ⚠️ Must be a 10-digit Indian mobile number starting with 6, 7, 8, or 9.
                </p>
              )}

              {phonePreviewOtp && !isPhoneVerified && (
                <div className="bg-zinc-850 border border-zinc-700 p-2 rounded-lg mb-3 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">⚡ Dev Preview Code:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{phonePreviewOtp}</span>
                  <button
                    type="button"
                    onClick={() => setPhoneOtp(phonePreviewOtp)}
                    className="text-[11px] bg-zinc-700 hover:bg-zinc-600 px-2 py-0.5 rounded text-white font-semibold"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {phoneOtpSent && !isPhoneVerified && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Mobile OTP"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 bg-gray-950 border border-gray-700 rounded-xl p-2.5 text-white font-mono text-center tracking-widest text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPhoneOtp}
                    disabled={loading || phoneOtp.length !== 6}
                    className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 text-xs px-5 py-2.5 rounded-xl font-bold transition dark:bg-white dark:text-black light:bg-black light:text-white"
                  >
                    Verify SMS
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-800 hover:bg-gray-750 px-5 py-3 rounded-xl text-xs font-semibold text-gray-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isEmailVerified) {
                    setError("Please verify your email address OTP to proceed.");
                    return;
                  }
                  setError("");
                  setStep(3);
                }}
                className="flex-1 bg-white text-black hover:bg-zinc-200 font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
              >
                Continue to Password Setup →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SECURITY & PASSWORD SETUP ── */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-1">Set Security Password</h2>
            <p className="text-xs text-gray-400 mb-4">
              Create a secure password to protect your GADDVYA account and reservation history.
            </p>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-medium">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-zinc-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-zinc-400 focus:outline-none"
                required
              />
            </div>

            {/* Account Summary Pill */}
            <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl text-xs space-y-1.5 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Citizen:</span>
                <span className="font-semibold text-white">{form.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-emerald-400 font-mono">✓ {form.email}</span>
              </div>
              {form.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Mobile:</span>
                  <span className="text-zinc-200 font-mono">+91 {form.phone}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-800 hover:bg-gray-750 px-5 py-3 rounded-xl text-xs font-semibold text-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white cursor-pointer"
              >
                {loading ? "Activating Profile..." : "Complete Registration & Sign In"}
              </button>
            </div>
          </form>
        )}

        <p className="text-gray-400 text-xs text-center mt-6 border-t border-gray-800 pt-4">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-zinc-200 dark:text-zinc-200 light:text-zinc-900 font-bold hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </AnimatedTrainBackground>
  );
}