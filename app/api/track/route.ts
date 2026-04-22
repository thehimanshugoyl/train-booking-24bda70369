import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  page: String,
  timestamp: { type: Date, default: Date.now },
});

const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { page } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown";
    await Visit.create({ ip, userAgent, page });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}