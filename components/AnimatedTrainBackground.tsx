"use client";
import React from "react";

interface AnimatedTrainBackgroundProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

export default function AnimatedTrainBackground({
  children,
  backgroundImage = "/train_hero_bg.jpg",
  className = "",
}: AnimatedTrainBackgroundProps) {
  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gray-950 ${className}`}
    >
      {/* 1. Cinematic Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* 2. Layered Dark Vignette & Atmospheric Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/85 via-gray-950/80 to-gray-950/95 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-gray-950/60 to-gray-950/95" />

      {/* 3. Animated High-Speed Train Crossing in the Background */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none overflow-hidden z-0 opacity-70">
        {/* Railway Track Rail Lines */}
        <div className="absolute bottom-6 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute bottom-4 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent" />

        {/* Speeding Train Silhouette with Headlight Beam */}
        <div className="train-runner absolute bottom-5 flex items-center">
          {/* Headlight Beam Cone */}
          <div className="w-56 h-12 bg-gradient-to-r from-transparent to-amber-200/25 blur-sm -mr-3 transform -skew-x-12" />

          {/* Locomotive Nose with Glowing Headlights */}
          <div className="relative w-28 h-7 bg-gradient-to-r from-emerald-800 to-gray-200 rounded-r-full shadow-lg shadow-amber-400/20 flex items-center justify-end pr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fde047] animate-pulse" />
          </div>

          {/* Passenger Coaches with Illuminated Windows */}
          {[1, 2, 3, 4, 5, 6].map((coach) => (
            <div
              key={coach}
              className="w-24 h-7 bg-gray-800 border-t-2 border-emerald-400/50 mr-1 rounded-sm flex items-center justify-around px-2 relative"
            >
              <span className="w-4 h-2 bg-amber-100/80 rounded-xs shadow-[0_0_4px_#fef08a]" />
              <span className="w-4 h-2 bg-amber-100/80 rounded-xs shadow-[0_0_4px_#fef08a]" />
              <span className="w-4 h-2 bg-amber-100/80 rounded-xs shadow-[0_0_4px_#fef08a]" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Foreground Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
        {children}
      </div>

      {/* Inline Animation Style for Constant Smooth Train Movement */}
      <style jsx>{`
        @keyframes trainMove {
          0% {
            transform: translateX(110vw);
          }
          100% {
            transform: translateX(-150vw);
          }
        }
        .train-runner {
          animation: trainMove 14s linear infinite;
        }
      `}</style>
    </div>
  );
}
