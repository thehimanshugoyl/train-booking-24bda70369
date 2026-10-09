import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    const limit = Number(searchParams.get("limit") || 100);

    const { trains } = await db.trains.search({ from, to, limit });
    return NextResponse.json({ trains });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      trainNumber,
      trainName,
      trainType = "Superfast Express",
      from,
      to,
      departureTime,
      arrivalTime,
      duration = "",
      totalSeats,
      price,
      date,
      classes,
    } = body;

    if (!trainNumber || !trainName || !from || !to || !departureTime || !arrivalTime) {
      return NextResponse.json({ error: "Missing required train details" }, { status: 400 });
    }

    const parsedTotalSeats = Number(totalSeats) || 120;
    const parsedPrice = Number(price) || 500;

    const trainClasses = Array.isArray(classes) && classes.length > 0
      ? classes
      : [
          {
            classType: "SL",
            className: "Sleeper Class",
            price: parsedPrice,
            totalSeats: Math.round(parsedTotalSeats * 0.6),
            availableSeats: Math.round(parsedTotalSeats * 0.6),
          },
          {
            classType: "3A",
            className: "AC 3 Tier",
            price: Math.round(parsedPrice * 1.8),
            totalSeats: Math.round(parsedTotalSeats * 0.4),
            availableSeats: Math.round(parsedTotalSeats * 0.4),
          },
        ];

    const train = await db.trains.create({
      trainNumber,
      trainName,
      trainType,
      from,
      to,
      departureTime,
      arrivalTime,
      duration,
      date: date || new Date().toISOString().split("T")[0],
      totalSeats: parsedTotalSeats,
      availableSeats: parsedTotalSeats,
      price: parsedPrice,
      classes: trainClasses,
    });

    return NextResponse.json({ success: true, train }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}