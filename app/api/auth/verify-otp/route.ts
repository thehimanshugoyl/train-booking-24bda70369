import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { identifier, otp, purpose = "register" } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: "Identifier and OTP are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().includes("@")
      ? identifier.trim().toLowerCase()
      : identifier.replace(/\D/g, "").slice(-10);

    const match = await db.otps.verify(cleanIdentifier, otp.trim(), purpose);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please check the code or request a new one." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${
        cleanIdentifier.includes("@") ? "Email" : "Mobile"
      } verified successfully!`,
      verifiedType: cleanIdentifier.includes("@") ? "email" : "phone",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
