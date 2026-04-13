import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Train from "@/models/Train";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded: any = verifyToken(token);
    const bookings = await Booking.find({ user: decoded.id }).populate("train");
    return NextResponse.json({ bookings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded: any = verifyToken(token);
    const { trainId, seats, passengerName, passengerAge } = await req.json();
    const train = await Train.findById(trainId);
    if (!train) return NextResponse.json({ error: "Train not found" }, { status: 404 });
    if (train.availableSeats < seats) return NextResponse.json({ error: "Not enough seats" }, { status: 400 });
    const totalPrice = train.price * seats;
    const booking = await Booking.create({
      user: decoded.id, train: trainId, seats, totalPrice, passengerName, passengerAge,
    });
    await Train.findByIdAndUpdate(trainId, { $inc: { availableSeats: -seats } });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}