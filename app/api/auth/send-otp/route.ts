import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { sendEmailOtp, sendPhoneOtp } from "@/lib/notificationService";

export async function POST(req: NextRequest) {
  try {
    const { identifier, type, purpose = "register", name } = await req.json();

    if (!identifier || !type) {
      return NextResponse.json(
        { error: "Identifier (email or phone) and type are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier =
      type === "phone"
        ? identifier.replace(/\D/g, "").slice(-10)
        : identifier.trim().toLowerCase();

    if (type === "phone" && cleanIdentifier.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    if (type === "email" && !cleanIdentifier.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // If purpose is register, check if email/phone already belongs to an existing user
    if (purpose === "register") {
      const existingUser =
        type === "email"
          ? await db.users.findByEmail(cleanIdentifier)
          : await db.users.findByPhone(cleanIdentifier);

      if (existingUser) {
        return NextResponse.json(
          {
            error: `An account with this ${
              type === "email" ? "email address" : "phone number"
            } already exists. Please login instead.`,
          },
          { status: 400 }
        );
      }
    }

    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in Supabase / Local db
    await db.otps.create({
      identifier: cleanIdentifier,
      code: generatedOtp,
      type,
      purpose,
      expiresAt,
    });

    // Send via Notification Service
    let result;
    if (type === "email") {
      result = await sendEmailOtp(cleanIdentifier, generatedOtp, name);
    } else {
      result = await sendPhoneOtp(cleanIdentifier, generatedOtp);
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      delivered: result.delivered,
      previewOtp: result.previewOtp,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
