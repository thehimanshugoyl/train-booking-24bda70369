"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TatkalCountdownWidget() {
  const [timeLeftAC, setTimeLeftAC] = useState("");
  const [timeLeftNonAC, setTimeLeftNonAC] = useState("");
  const [isACActive, setIsACActive] = useState(false);
  const [isNonACActive, setIsNonACActive] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Target today 10:00 AM
      const targetAC = new Date(now);
      targetAC.setHours(10, 0, 0, 0);

      // Target today 11:00 AM
      const targetNonAC = new Date(now);
      targetNonAC.setHours(11, 0, 0, 0);

      // If already past, set target to tomorrow
      if (now.getTime() > targetAC.getTime()) {
        if (now.getHours() === 10 && now.getMinutes() < 30) {
          setIsACActive(true);
        } else {
          setIsACActive(false);
          targetAC.setDate(targetAC.getDate() + 1);
        }
      }

      if (now.getTime() > targetNonAC.getTime()) {
        if (now.getHours() === 11 && now.getMinutes() < 30) {
          setIsNonACActive(true);
        } else {
          setIsNonACActive(false);
          targetNonAC.setDate(targetNonAC.getDate() + 1);
        }
      }

      const diffAC = Math.max(0, targetAC.getTime() - now.getTime());
      const diffNonAC = Math.max(0, targetNonAC.getTime() - now.getTime());

      const formatDiff = (diff: number) => {
        const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
        const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
        const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
        return `${h}:${m}:${s}`;
      };

      setTimeLeftAC(formatDiff(diffAC));
      setTimeLeftNonAC(formatDiff(diffNonAC));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-600/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Live Tatkal Window Clock
            </span>
            <span className="text-xs text-gray-400 font-mono">IST Indian Standard Time</span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚡ High-Speed Tatkal Booking Gauge</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Auto-sync your checkout with the official railway opening times to secure confirmed berths
          </p>
        </div>

        {/* Timers Grid */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* AC Tatkal Card */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 min-w-[150px] flex-1 md:flex-initial">
            <div className="flex justify-between items-center text-[11px] text-gray-400 mb-0.5">
              <span>❄️ AC Classes (3A, 2A, 1A)</span>
              <span className="text-amber-400 font-bold">10:00 AM</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-white flex items-center gap-2">
              {isACActive ? (
                <span className="text-emerald-400 text-sm animate-pulse">🟢 WINDOW OPEN</span>
              ) : (
                <span>{timeLeftAC || "10:00:00"}</span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              {isACActive ? "Rush hours live" : "Countdown to open"}
            </span>
          </div>

          {/* Non-AC Tatkal Card */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 min-w-[150px] flex-1 md:flex-initial">
            <div className="flex justify-between items-center text-[11px] text-gray-400 mb-0.5">
              <span>💺 Sleeper & 2S</span>
              <span className="text-amber-400 font-bold">11:00 AM</span>
            </div>
            <div className="text-xl font-extrabold font-mono text-white flex items-center gap-2">
              {isNonACActive ? (
                <span className="text-emerald-400 text-sm animate-pulse">🟢 WINDOW OPEN</span>
              ) : (
                <span>{timeLeftNonAC || "11:00:00"}</span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              {isNonACActive ? "Rush hours live" : "Countdown to open"}
            </span>
          </div>

          <Link
            href="/search"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-2xl text-xs transition shadow-lg shadow-amber-500/20 whitespace-nowrap self-stretch md:self-auto flex items-center justify-center gap-1"
          >
            <span>Book Tatkal Now →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
