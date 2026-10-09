import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      password,
      gender = "Male",
      dob = "",
      state = "",
      city = "",
      idProofType = "Aadhaar Card",
      idProofNumber = "",
      emailOtp,
      phoneOtp,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) : "";

    // 1. Check existing user by email
    const existingEmail = await db.users.findByEmail(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    // 2. Check existing user by phone
    if (cleanPhone) {
      const existingPhone = await db.users.findByPhone(cleanPhone);
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this mobile number already exists." },
          { status: 400 }
        );
      }
    }

    // 3. Verify Email OTP if provided
    let isEmailVerified = true;
    if (emailOtp) {
      const verified = await db.otps.verify(cleanEmail, emailOtp.trim(), "register");
      if (!verified) {
        return NextResponse.json(
          { error: "Invalid or expired Email OTP code." },
          { status: 400 }
        );
      }
    }

    // 4. Verify Phone OTP if provided
    let isPhoneVerified = true;
    if (cleanPhone && phoneOtp) {
      const verified = await db.otps.verify(cleanPhone, phoneOtp.trim(), "register");
      if (!verified) {
        return NextResponse.json(
          { error: "Invalid or expired Mobile OTP code." },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.users.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: "user",
      is_email_verified: isEmailVerified,
      is_phone_verified: isPhoneVerified,
      gender,
      dob,
      state,
      city,
      id_proof_type: idProofType,
      id_proof_number: idProofNumber,
    });

    // Cleanup used OTP records
    await db.otps.delete(cleanEmail, "register");
    if (cleanPhone) {
      await db.otps.delete(cleanPhone, "register");
    }

    const userId = user.id || user._id;
    const token = signToken({
      id: userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully with verified citizen status!",
        token,
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.is_email_verified ?? true,
          isPhoneVerified: user.is_phone_verified ?? true,
          gender: user.gender,
          dob: user.dob,
          state: user.state,
          city: user.city,
          idProofType: user.id_proof_type,
          idProofNumber: user.id_proof_number,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}