import mongoose from "mongoose";

export interface IPassenger {
  name: string;
  age: number;
  gender?: string;
  seatNumber?: string;
  berthPreference?: string;
}

const passengerSchema = new mongoose.Schema<IPassenger>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, default: "Male" },
  seatNumber: { type: String, default: "" },
  berthPreference: { type: String, default: "No Preference" },
});

const bookingSchema = new mongoose.Schema(
  {
    pnr: { type: String, unique: true, sparse: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    train: { type: mongoose.Schema.Types.ObjectId, ref: "Train", required: true },
    classType: { type: String, default: "SL" },
    seats: { type: Number, required: true },
    passengers: { type: [passengerSchema], default: [] },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    paymentStatus: { type: String, enum: ["paid", "pending", "refunded"], default: "paid" },
    paymentMethod: { type: String, default: "card" },
    
    // Backwards compatibility for single-passenger fields
    passengerName: { type: String, default: "" },
    passengerAge: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);