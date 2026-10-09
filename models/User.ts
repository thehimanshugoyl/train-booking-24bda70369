import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, sparse: true, index: true }, // 10-digit Indian mobile
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    
    // OTP & Verification Status
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    // Proper Citizen / Passenger Details
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "Male" },
    dob: { type: String, default: "" }, // YYYY-MM-DD
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    
    // Official Government ID Verification
    idProofType: {
      type: String,
      enum: ["Aadhaar Card", "PAN Card", "Voter ID", "Passport", ""],
      default: "Aadhaar Card",
    },
    idProofNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);