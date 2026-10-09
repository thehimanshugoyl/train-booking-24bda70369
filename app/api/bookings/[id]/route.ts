import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Check if searching by 10-digit PNR or booking id
    let booking;
    if (id.length === 10 && !isNaN(Number(id))) {
      booking = await db.bookings.findByPnr(id);
    } else {
      booking = await db.bookings.findById(id);
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking or PNR not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    const { id } = await context.params;

    const existingBooking = await db.bookings.findById(id);
    if (!existingBooking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const bookingUserId = existingBooking.user_id || existingBooking.userId;
    if (bookingUserId !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Cannot cancel another user's booking" }, { status: 403 });
    }

    if (existingBooking.status === "cancelled") {
      return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 });
    }

    const updated = await db.bookings.update(id, {
      status: "cancelled",
      payment_status: "refunded",
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}