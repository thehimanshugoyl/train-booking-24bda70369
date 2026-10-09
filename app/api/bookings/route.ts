import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

function generatePNR(): string {
  // Generate a realistic 10-digit Indian Railway format PNR (starts with 2-9)
  const first = Math.floor(2 + Math.random() * 8);
  const remaining = Math.floor(100000000 + Math.random() * 900000000);
  return `${first}${remaining}`.slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    const bookings = await db.bookings.findByUserId(decoded.id);

    return NextResponse.json({ bookings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    const body = await req.json();
    const {
      trainId,
      seats = 1,
      classType = "SL",
      passengerName,
      passengerAge,
      passengers,
      paymentMethod = "card",
    } = body;

    const numSeats = Number(seats) || 1;
    const train = await db.trains.findById(trainId);
    if (!train) return NextResponse.json({ error: "Train not found" }, { status: 404 });

    // Find class if exists
    let unitPrice = train.price;
    const matchedClass = train.classes?.find((c: any) => c.classType === classType);
    if (matchedClass) {
      unitPrice = matchedClass.price;
    }

    const totalPrice = unitPrice * numSeats;

    // Normalizing passengers
    let passengersList = [];
    if (Array.isArray(passengers) && passengers.length > 0) {
      passengersList = passengers;
    } else if (passengerName) {
      passengersList = [
        {
          name: passengerName,
          age: Number(passengerAge) || 25,
          gender: "Male",
          berthPreference: "No Preference",
        },
      ];
    }

    // Generate unique PNR
    let pnr = generatePNR();
    let isPnrUnique = false;
    let attempts = 0;
    while (!isPnrUnique && attempts < 5) {
      const existing = await db.bookings.findByPnr(pnr);
      if (!existing) {
        isPnrUnique = true;
      } else {
        pnr = generatePNR();
        attempts++;
      }
    }

    const booking = await db.bookings.create({
      pnr,
      userId: decoded.id,
      trainId,
      trainNumber: train.trainNumber || train.train_number,
      trainName: train.trainName || train.train_name,
      from: train.from || train.from_station,
      to: train.to || train.to_station,
      date: train.date,
      classType: matchedClass ? matchedClass.classType : classType,
      seats: numSeats,
      totalPrice,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod,
      passengers: passengersList,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}