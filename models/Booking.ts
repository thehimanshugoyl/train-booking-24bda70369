import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  train: { type: mongoose.Schema.Types.ObjectId, ref: "Train", required: true },
  seats: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  passengerName: { type: String, required: true },
  passengerAge: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);