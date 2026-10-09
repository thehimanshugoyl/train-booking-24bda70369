import mongoose from "mongoose";

export interface ITrainClass {
  classType: string; // e.g., "1A", "2A", "3A", "SL", "CC", "EC"
  className: string; // e.g., "AC 3 Tier", "Sleeper"
  price: number;
  totalSeats: number;
  availableSeats: number;
}

export interface IRouteHalt {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
}

const trainClassSchema = new mongoose.Schema<ITrainClass>({
  classType: { type: String, required: true },
  className: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
});

const routeHaltSchema = new mongoose.Schema<IRouteHalt>({
  stationCode: { type: String, required: true },
  stationName: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  departureTime: { type: String, required: true },
  haltMinutes: { type: Number, default: 2 },
  distanceKm: { type: Number, default: 0 },
});

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true, unique: true },
    trainName: { type: String, required: true },
    trainType: { type: String, default: "Superfast Express" }, // e.g., Vande Bharat, Rajdhani, Shatabdi, Superfast
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, default: "" }, // e.g. "12h 45m"
    date: { type: String, required: true }, // YYYY-MM-DD or specific departure date
    runsOn: { type: [String], default: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    
    // Multi-tier classes & seat inventory
    classes: { type: [trainClassSchema], default: [] },
    
    // Intermediate halt route timeline
    route: { type: [routeHaltSchema], default: [] },

    // Fallbacks for backwards compatibility
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

// High-speed querying indexes for 25,571+ train schedules
trainSchema.index({ from: 1, to: 1 });
trainSchema.index({ from: 1, to: 1, date: 1 });
trainSchema.index({ trainNumber: 1 });
trainSchema.index({ trainType: 1 });

export default mongoose.models.Train || mongoose.model("Train", trainSchema);