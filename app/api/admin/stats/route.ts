import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Train from "@/models/Train";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

const Visit = mongoose.models.Visit || mongoose.model("Visit", new mongoose.Schema({
  ip: String, userAgent: String, page: String, timestamp: { type: Date, default: Date.now }
}));

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded: any = verifyToken(token);
    if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [totalUsers, totalTrains, totalBookings, confirmedBookings, cancelledBookings, recentUsers, recentBookings, totalVisits, todayVisits] = await Promise.all([
      User.countDocuments(),
      Train.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
      User.find().sort({ createdAt: -1 }).limit(10).select("-password"),
      Booking.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email").populate("train", "trainName from to"),
      Visit.countDocuments(),
      Visit.countDocuments({ timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    ]);

    const revenue = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    return NextResponse.json({
      stats: {
        totalUsers, totalTrains, totalBookings,
        confirmedBookings, cancelledBookings,
        totalRevenue: revenue[0]?.total || 0,
        totalVisits, todayVisits,
      },
      recentUsers,
      recentBookings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}