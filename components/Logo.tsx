import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string | null;
  className?: string;
  variant?: "badge" | "plain";
}

export default function Logo({
  size = "md",
  showText = true,
  subtitle,
  className = "",
  variant = "badge",
}: LogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  }[size];

  const titleSizes = {
    sm: "text-base tracking-[0.14em]",
    md: "text-xl tracking-[0.16em]",
    lg: "text-2xl sm:text-3xl tracking-[0.18em]",
    xl: "text-4xl tracking-[0.2em]",
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Gaddvya Emblem Badge */}
      <div
        className={`${iconDimensions} flex-shrink-0 relative rounded-2xl overflow-hidden shadow-md shadow-emerald-950/40 transition-transform hover:scale-105`}
        title="GADDVYA — Indian Railways Portal"
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep Forest Teal Background Squircle */}
          {variant === "badge" && (
            <>
              <rect x="0" y="0" width="160" height="160" rx="42" fill="#153b31" />
              <rect
                x="2"
                y="2"
                width="156"
                height="156"
                rx="40"
                fill="none"
                stroke="#245a4c"
                strokeWidth="2.5"
              />
            </>
          )}

          {/* Golden Train Outline Emblem */}
          <g transform="translate(80, 78) scale(1.42) translate(-50, -50)">
            {/* Aerodynamic Locomotive Hull */}
            <path
              d="M34,55 C34,35 38,24 50,24 C62,24 66,35 66,55 C66,63 61,66 50,66 C39,66 34,63 34,55 Z"
              fill="none"
              stroke="#eec574"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Top Windshield Glass */}
            <path
              d="M42,37 C42,31 45,29 50,29 C55,29 58,31 58,37 C58,45 55,47 50,47 C45,47 42,45 42,37 Z"
              fill="none"
              stroke="#eec574"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Twin Headlights */}
            <ellipse
              cx="42"
              cy="54"
              rx="2.2"
              ry="1.6"
              transform="rotate(-15 42 54)"
              fill="#eec574"
            />
            <ellipse
              cx="58"
              cy="54"
              rx="2.2"
              ry="1.6"
              transform="rotate(15 58 54)"
              fill="#eec574"
            />

            {/* Cowcatcher / Rail Runners */}
            <path
              d="M40,66 L35,76 M60,66 L65,76"
              stroke="#eec574"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M33,74 C44,72 56,72 67,74"
              stroke="#eec574"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-black font-sans uppercase text-white ${titleSizes} select-none leading-none`}
          >
            GADDVYA
          </span>
          {subtitle && (
            <p className="text-[11px] text-emerald-400/80 tracking-wide font-medium mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
