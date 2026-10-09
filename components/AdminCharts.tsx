"use client";

import React, { useState } from "react";

interface TimelinePoint {
  label: string;
  bookings: number;
  revenue: number;
  visits: number;
}

interface ClassItem {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

interface RouteItem {
  route: string;
  occupancy: number;
  trains: number;
  revenue: number;
}

interface AdminChartsProps {
  stats: {
    totalUsers: number;
    totalTrains: number;
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    totalVisits: number;
    todayVisits: number;
  };
  charts?: {
    timeline: TimelinePoint[];
    classDistribution: ClassItem[];
    routeDistribution: RouteItem[];
  };
  onRefresh?: () => void;
}

export default function AdminCharts({ stats, charts, onRefresh }: AdminChartsProps) {
  const [metricView, setMetricView] = useState<"revenue" | "bookings" | "visits">("revenue");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "1y">("7d");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const defaultTimeline: TimelinePoint[] = [
    { label: "Mon", bookings: 12, revenue: 16800, visits: 45 },
    { label: "Tue", bookings: 18, revenue: 24500, visits: 62 },
    { label: "Wed", bookings: 15, revenue: 21000, visits: 58 },
    { label: "Thu", bookings: 24, revenue: 33600, visits: 89 },
    { label: "Fri", bookings: 32, revenue: 44800, visits: 114 },
    { label: "Sat", bookings: 45, revenue: 63000, visits: 156 },
    { label: "Sun", bookings: 40, revenue: 56000, visits: 142 },
  ];

  const timeline = charts?.timeline && charts.timeline.length > 0 ? charts.timeline : defaultTimeline;

  const defaultClasses: ClassItem[] = [
    { name: "3A (3-Tier AC)", percentage: 38, count: 142, color: "#3b82f6" },
    { name: "2A (2-Tier AC)", percentage: 24, count: 90, color: "#8b5cf6" },
    { name: "SL (Sleeper)", percentage: 20, count: 75, color: "#10b981" },
    { name: "1A (First AC)", percentage: 10, count: 38, color: "#f59e0b" },
    { name: "CC (Chair Car)", percentage: 8, count: 30, color: "#ef4444" },
  ];

  const classData = charts?.classDistribution && charts.classDistribution.length > 0 ? charts.classDistribution : defaultClasses;

  const defaultRoutes: RouteItem[] = [
    { route: "NDLS ⇄ MMCT (Delhi - Mumbai)", occupancy: 96, trains: 28, revenue: 185000 },
    { route: "NDLS ⇄ BSB (Delhi - Varanasi)", occupancy: 92, trains: 18, revenue: 142000 },
    { route: "SBC ⇄ MAS (Bengaluru - Chennai)", occupancy: 88, trains: 22, revenue: 115000 },
    { route: "NDLS ⇄ HWH (Delhi - Howrah)", occupancy: 85, trains: 24, revenue: 98000 },
    { route: "NDLS ⇄ BPL (Delhi - Bhopal)", occupancy: 79, trains: 16, revenue: 64000 },
  ];

  const routeData = charts?.routeDistribution && charts.routeDistribution.length > 0 ? charts.routeDistribution : defaultRoutes;

  // Chart Dimensions & Mathematics
  const chartHeight = 220;
  const chartWidth = 650;
  const paddingX = 40;
  const paddingY = 25;

  const values = timeline.map((p) => p[metricView]);
  const maxValue = Math.max(...values, 1);
  const minValue = 0;

  const points = timeline.map((p, idx) => {
    const x = paddingX + (idx / (timeline.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (p[metricView] / maxValue) * (chartHeight - paddingY * 2);
    return { x, y, ...p };
  });

  // Build SVG Path strings
  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // Smooth bezier curve control points
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Mini Sparkline helper
  const renderSparkline = (data: number[], color: string) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const h = 30;
    const w = 70;
    const pts = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((val - min) / (max - min || 1)) * (h - 6) - 3;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg className="w-18 h-8 overflow-visible" viewBox={`0 0 ${w} ${h}`}>
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      </svg>
    );
  };

  // Donut chart calculations
  let accumulatedAngle = 0;
  const circumference = 2 * Math.PI * 40; // r = 40

  return (
    <div className="space-y-6">
      {/* ── TOP KPI METRIC CARDS WITH SPARKLINES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-gray-900/90 border border-zinc-750 hover:border-blue-500/60 transition p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="text-xs text-gray-400 font-medium">Registered Citizens</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <span>↑ 12.4%</span>
              <span className="text-gray-400 font-normal">this month</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-xl mb-1">👥</span>
            {renderSparkline([4, 6, 8, 12, 14, 18, 22], "#3b82f6")}
          </div>
        </div>

        {/* Card 2: Total Trains */}
        <div className="bg-gray-900/90 border border-zinc-750 hover:border-emerald-500/60 transition p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400 font-medium">Active Train Fleet</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.totalTrains.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <span>✓ All Zones</span>
              <span className="text-gray-400 font-normal">operational</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xl mb-1">🚆</span>
            {renderSparkline([10, 15, 20, 24, 28, 30, 35], "#10b981")}
          </div>
        </div>

        {/* Card 3: Total Bookings */}
        <div className="bg-gray-900/90 border border-zinc-750 hover:border-amber-500/60 transition p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-400 font-medium">Ticket Reservations</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.totalBookings.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-300 flex items-center gap-1 mt-1">
              <span className="text-emerald-400 font-semibold">{stats.confirmedBookings} active</span>
              <span>•</span>
              <span className="text-red-400">{stats.cancelledBookings} cancelled</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-xl mb-1">🎫</span>
            {renderSparkline([5, 8, 14, 18, 22, 29, 36], "#f59e0b")}
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-gray-900/90 border border-zinc-750 hover:border-purple-500/60 transition p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs text-gray-400 font-medium">Platform Revenue</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <span>↑ 24.8%</span>
              <span className="text-gray-400 font-normal">gross yield</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 text-xl mb-1">💰</span>
            {renderSparkline([12, 18, 25, 34, 48, 62, 75], "#a855f7")}
          </div>
        </div>
      </div>

      {/* ── MAIN INTERACTIVE CHART: REVENUE & BOOKING TIMELINE ── */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Transit Velocity & Operational Trends
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Real-time progression curves across passenger volume, revenue, and platform visits
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Switcher */}
            <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setMetricView("revenue")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  metricView === "revenue"
                    ? "bg-purple-600 text-white shadow-md font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ₹ Revenue
              </button>
              <button
                type="button"
                onClick={() => setMetricView("bookings")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  metricView === "bookings"
                    ? "bg-amber-500 text-black shadow-md font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🎫 Bookings
              </button>
              <button
                type="button"
                onClick={() => setMetricView("visits")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  metricView === "visits"
                    ? "bg-blue-600 text-white shadow-md font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🌐 Visits
              </button>
            </div>

            {/* Timeframe Filter */}
            <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
              {(["7d", "30d", "1y"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-lg uppercase transition cursor-pointer ${
                    timeRange === r
                      ? "bg-white text-black font-bold dark:bg-white dark:text-black light:bg-black light:text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 p-2 rounded-xl text-xs border border-zinc-700 transition cursor-pointer"
                title="Refresh Analytics"
              >
                🔄
              </button>
            )}
          </div>
        </div>

        {/* SVG Area & Line Chart */}
        <div className="relative w-full overflow-x-auto pt-2">
          <svg
            className="w-full h-64 overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradient for Revenue */}
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
              </linearGradient>
              {/* Gradient for Bookings */}
              <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
              {/* Gradient for Visits */}
              <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#27272a"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    fill="#71717a"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {metricView === "revenue"
                      ? `₹${Math.round((maxValue * ratio) / 1000)}k`
                      : Math.round(maxValue * ratio)}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area Fill */}
            <path
              d={areaD}
              fill={
                metricView === "revenue"
                  ? "url(#revenueGrad)"
                  : metricView === "bookings"
                  ? "url(#bookingsGrad)"
                  : "url(#visitsGrad)"
              }
            />

            {/* Smooth Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke={
                metricView === "revenue"
                  ? "#c084fc"
                  : metricView === "bookings"
                  ? "#fbbf24"
                  : "#60a5fa"
              }
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Point Circles with hover targets */}
            {points.map((pt, idx) => {
              const isHovered = hoveredPoint === idx;
              return (
                <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)}>
                  {/* Outer glow ring on hover */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="9"
                      fill={
                        metricView === "revenue"
                          ? "#a855f7"
                          : metricView === "bookings"
                          ? "#f59e0b"
                          : "#3b82f6"
                      }
                      opacity="0.3"
                    />
                  )}
                  {/* Point circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "5.5" : "4"}
                    fill="#ffffff"
                    stroke={
                      metricView === "revenue"
                        ? "#a855f7"
                        : metricView === "bookings"
                        ? "#f59e0b"
                        : "#3b82f6"
                    }
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all"
                  />
                  {/* X-axis Label */}
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    fill="#a1a1aa"
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight={isHovered ? "bold" : "normal"}
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredPoint !== null && (
            <div
              className="absolute top-2 bg-zinc-950/95 border border-zinc-700 p-3 rounded-xl shadow-2xl text-xs pointer-events-none transform -translate-x-1/2 transition-all backdrop-blur-md"
              style={{
                left: `${(points[hoveredPoint].x / chartWidth) * 100}%`,
              }}
            >
              <p className="text-gray-400 font-semibold mb-1">{points[hoveredPoint].label}</p>
              <div className="space-y-0.5 font-mono">
                <p className="text-purple-300">₹{points[hoveredPoint].revenue.toLocaleString("en-IN")}</p>
                <p className="text-amber-300">{points[hoveredPoint].bookings} Bookings</p>
                <p className="text-blue-300">{points[hoveredPoint].visits} Site Visits</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LOWER CHARTS: DONUT CHART + HORIZONTAL BARS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 2: Class Booking Breakdown (Donut Chart) */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💺</span>
              <h3 className="text-lg font-bold text-white">Coach Class Berth Demand</h3>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Passenger distribution across AC 3-Tier, 2-Tier, Sleeper & Chair Car classes
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {classData.map((item, idx) => {
                  const dashLength = (item.percentage / 100) * circumference;
                  const dashOffset = -accumulatedAngle;
                  accumulatedAngle += dashLength;

                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="14"
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                    />
                  );
                })}
              </svg>

              {/* Center Donut Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total</span>
                <span className="text-xl font-extrabold text-white font-mono">100%</span>
                <span className="text-[10px] text-emerald-400 font-medium">Allocated</span>
              </div>
            </div>

            {/* Class Legend Breakdown */}
            <div className="space-y-2.5 w-full sm:w-auto">
              {classData.map((cls, i) => (
                <div key={i} className="flex items-center justify-between sm:justify-start gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cls.color }} />
                    <span className="text-gray-300 font-medium">{cls.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{cls.percentage}%</span>
                    <span className="text-gray-500 text-[11px]">({cls.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex justify-between">
            <span>⚡ Highest revenue density: <strong>3A & 2A Coaches</strong></span>
            <span className="text-blue-400">View Manifest →</span>
          </div>
        </div>

        {/* CHART 3: Top Rail Corridors (Horizontal Bar Chart) */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🗺️</span>
              <h3 className="text-lg font-bold text-white">Top Rail Corridor Occupancy</h3>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Route utilization rates for Vande Bharat, Rajdhani, and Shatabdi runs
            </p>
          </div>

          {/* Horizontal Bar Items */}
          <div className="space-y-4 my-auto">
            {routeData.map((r, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{r.route}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-400 font-bold">{r.occupancy}% Load</span>
                    <span className="text-gray-500 text-[11px]">• {r.trains} trains</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      r.occupancy >= 90
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : r.occupancy >= 80
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                        : "bg-gradient-to-r from-amber-500 to-yellow-400"
                    }`}
                    style={{ width: `${r.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex justify-between">
            <span>Average nationwide route occupancy: <strong className="text-white">88.4%</strong></span>
            <span className="text-emerald-400">High Yield</span>
          </div>
        </div>
      </div>
    </div>
  );
}
