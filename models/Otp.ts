import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, index: true }, // Email address or mobile number
    type: { type: String, enum: ["email", "phone"], required: true },
    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["register", "login", "reset_password"],
      default: "register",
    },
    verified: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "10m" }, // MongoDB TTL auto-cleanup after 10 minutes
    },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
