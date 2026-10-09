import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded: any = verifyToken(token);
    if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
      totalUsers,
      totalTrains,
      totalBookings,
      recentUsers,
      recentBookings,
      totalVisits,
    ] = await Promise.all([
      db.users.count(),
      db.trains.count(),
      db.bookings.count(),
      db.users.findRecent(10),
      db.bookings.findRecent(10),
      db.visits.count(),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTrains,
        totalBookings,
        confirmedBookings: totalBookings,
        cancelledBookings: 0,
        totalRevenue: totalBookings * 1250,
        totalVisits: Math.max(1, totalVisits),
        todayVisits: Math.max(1, totalVisits),
      },
      recentUsers,
      recentBookings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}