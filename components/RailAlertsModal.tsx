"use client";

import React from "react";

interface RailAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RailAlertsModal({ isOpen, onClose }: RailAlertsModalProps) {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 1,
      type: "HIGH PRIORITY",
      title: "Diwali & Chhath Puja 2026: 250+ Special Vande Bharat & Superfast Trains Added",
      date: "Active Today",
      body: "Northern & Eastern Railway have announced special reservation runs between Delhi, Patna, Varanasi, Gorakhpur, and Kolkata. Normal booking and Tatkal berths open.",
      color: "border-red-500 bg-red-950/20 text-red-300",
    },
    {
      id: 2,
      type: "WEATHER ADVISORY",
      title: "Fog Safety Device (FSD) Protocol Active Across Northern Zone",
      date: "09 Oct 2026",
      body: "Locomotives operating between Amritsar, Delhi, and Lucknow are running equipped with GPS-guided Fog Vision systems. Trains maintain safe speed thresholds during low visibility.",
      color: "border-amber-500 bg-amber-950/20 text-amber-300",
    },
    {
      id: 3,
      type: "PLATFORM UPGRADE",
      title: "New Delhi (NDLS) Redevelopment: Contactless Smart Gates at Ajmeri Gate Side",
      date: "08 Oct 2026",
      body: "QR code scanners and facial-recognition automatic ticket gates are now active across Platforms 1 to 16 for swift, contactless boarding.",
      color: "border-blue-500 bg-blue-950/20 text-blue-300",
    },
    {
      id: 4,
      type: "POLICY UPDATE",
      title: "Zero Cancellation Fee Guarantee on GADDVYA Rail Wallet",
      date: "Ongoing",
      body: "All tickets booked using GADDVYA Rail Wallet receive instantaneous 100% fare refunds credited back into the citizen wallet within 3 seconds of cancellation.",
      color: "border-emerald-500 bg-emerald-950/20 text-emerald-300",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-gray-900 border border-zinc-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-gradient-to-r from-red-700 via-rose-800 to-indigo-950 p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-red-200 uppercase font-bold">
                Official Ministry of Railways Circulars
              </span>
            </div>
            <h3 className="text-xl font-extrabold flex items-center gap-2">
              <span>🚨 Live Railway Alerts & Bulletins</span>
            </h3>
            <p className="text-xs text-rose-100 mt-0.5">
              Real-time advisories, festival specials, weather alerts, and route diversions
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {alerts.map((a) => (
            <div key={a.id} className={`p-4 rounded-2xl border ${a.color} space-y-1.5`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold tracking-wider uppercase font-mono">{a.type}</span>
                <span className="text-gray-400 text-[11px]">{a.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{a.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-xs text-gray-400 shrink-0">
          <span>Helpline: Call 139 (Toll-Free, 24x7 all languages)</span>
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-xl font-semibold transition"
          >
            Close Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
