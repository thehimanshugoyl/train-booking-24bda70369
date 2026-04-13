import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Train from "@/models/Train";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const query: any = {};
    if (from) query.from = new RegExp(from, "i");
    if (to) query.to = new RegExp(to, "i");
    const trains = await Train.find(query);
    return NextResponse.json({ trains });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}