import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Train from "@/models/Train";
import { verifyToken } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    verifyToken(token);
    const booking = await Booking.findByIdAndUpdate(params.id, { status: "cancelled" }, { new: true });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    await Train.findByIdAndUpdate(booking.train, { $inc: { availableSeats: booking.seats } });
    return NextResponse.json({ booking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}