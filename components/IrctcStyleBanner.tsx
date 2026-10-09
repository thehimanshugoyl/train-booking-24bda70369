import React from "react";
import Logo from "@/components/Logo";

export default function IrctcStyleBanner({ onClose }: { onClose?: () => void }) {
  return (
    <div className="relative w-full h-36 sm:h-40 rounded-t-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-amber-700 flex items-center justify-between px-6 shadow-inner">
      {/* High-speed motion track lines */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 160">
          <line x1="0" y1="120" x2="400" y2="120" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="0" y1="135" x2="400" y2="135" stroke="#ffffff" strokeWidth="3" />
          <line x1="0" y1="145" x2="400" y2="145" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M-50,140 Q150,70 450,130" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      {/* Saffron High-Speed Vande Bharat Locomotive Vector (Left Side) */}
      <div className="relative z-10 flex items-center">
        <svg
          viewBox="0 0 260 100"
          className="w-48 sm:w-56 h-auto drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speed blur shadows */}
          <path d="M10 75 L180 75 L190 70 L20 70 Z" fill="#000000" opacity="0.35" />
          
          {/* Main Aerodynamic Hull */}
          <path
            d="M20 72 C50 72 170 72 210 70 C240 68 255 52 258 40 C260 30 250 25 235 25 C180 25 50 25 20 25 Z"
            fill="#1e293b"
          />
          {/* Saffron Racing Stripe */}
          <path
            d="M20 60 C80 60 180 60 215 58 C242 56 254 44 256 36 L250 36 C240 44 210 52 180 52 L20 52 Z"
            fill="#f97316"
          />
          {/* Top White Cap */}
          <path
            d="M20 25 C60 25 180 25 225 25 C238 25 246 29 250 34 L20 34 Z"
            fill="#ffffff"
          />
          {/* Windshield Cockpit Glass */}
          <path
            d="M210 32 L248 35 C242 45 228 48 212 48 L206 38 Z"
            fill="#0f172a"
            stroke="#f97316"
            strokeWidth="1.5"
          />
          {/* Headlight Flare */}
          <circle cx="250" cy="48" r="4" fill="#fef08a" />
          <line x1="250" y1="48" x2="265" y2="48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Vande Bharat Windows */}
          <rect x="140" y="36" width="22" height="10" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
          <rect x="105" y="36" width="22" height="10" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
          <rect x="70" y="36" width="22" height="10" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
          <rect x="35" y="36" width="22" height="10" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Official Emblems on the RIGHT SIDE (Matching IRCTC screenshot) */}
      <div className="relative z-10 flex items-center gap-3 ml-auto">
        {/* Indian Railways Emblem */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-700 border-2 border-white shadow-xl flex items-center justify-center p-1"
          title="Indian Railways"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#ffffff" strokeWidth="3" />
            <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="28" fill="#ffffff" />
            {/* Locomotive silhouette in center */}
            <path d="M40 55 L60 55 L58 42 L42 42 Z" fill="#b91c1c" />
            <rect x="44" y="38" width="12" height="4" fill="#b91c1c" />
            <circle cx="45" cy="57" r="3" fill="#ffffff" stroke="#b91c1c" strokeWidth="1" />
            <circle cx="55" cy="57" r="3" fill="#ffffff" stroke="#b91c1c" strokeWidth="1" />
          </svg>
        </div>

        {/* GADDVYA Portal Emblem on Right */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-zinc-250 shadow-xl flex items-center justify-center p-1.5"
          title="GADDVYA Railway Portal"
        >
          <Logo size="sm" showText={false} variant="plain" />
        </div>
      </div>

      {/* Close button at top right */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-xs backdrop-blur-md transition cursor-pointer z-20"
          title="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
}
