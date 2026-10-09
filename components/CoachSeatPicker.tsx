"use client";
import { useState, useEffect } from "react";

interface CoachSeatPickerProps {
  classType: string; // "SL", "3A", "2A", "CC", "EC"
  seatsCount: number;
  onSeatsSelected: (seats: string[]) => void;
  initiallySelected?: string[];
}

export default function CoachSeatPicker({
  classType,
  seatsCount,
  onSeatsSelected,
  initiallySelected = [],
}: CoachSeatPickerProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>(initiallySelected);

  // Coach prefix based on class
  const coachCode =
    classType === "1A"
      ? "H1"
      : classType === "2A"
      ? "A1"
      : classType === "3A"
      ? "B1"
      : classType === "CC"
      ? "C1"
      : classType === "EC"
      ? "E1"
      : "S1";

  // Simulate occupied seats (fixed pseudo-random for demonstration)
  const occupiedSet = new Set([
    `${coachCode}-3`,
    `${coachCode}-7`,
    `${coachCode}-8`,
    `${coachCode}-14`,
    `${coachCode}-19`,
    `${coachCode}-22`,
    `${coachCode}-28`,
    `${coachCode}-31`,
  ]);

  // Total seats to render in coach preview
  const totalCoachSeats = classType === "EC" ? 24 : classType === "2A" ? 32 : 40;

  const toggleSeat = (seatId: string) => {
    if (occupiedSet.has(seatId)) return;

    let updated: string[];
    if (selectedSeats.includes(seatId)) {
      updated = selectedSeats.filter((s) => s !== seatId);
    } else {
      if (selectedSeats.length >= seatsCount) {
        // Replace oldest or replace all if 1 seat
        if (seatsCount === 1) {
          updated = [seatId];
        } else {
          updated = [...selectedSeats.slice(1), seatId];
        }
      } else {
        updated = [...selectedSeats, seatId];
      }
    }

    setSelectedSeats(updated);
    onSeatsSelected(updated);
  };

  // Determine berth / seat type name
  const getSeatType = (num: number) => {
    if (classType === "CC" || classType === "EC") {
      const pos = num % 5;
      if (pos === 1 || pos === 0) return "Window";
      if (pos === 2 || pos === 4) return "Aisle";
      return "Middle";
    }
    const berthMod = num % 8;
    if (berthMod === 1 || berthMod === 4) return "Lower (LB)";
    if (berthMod === 2 || berthMod === 5) return "Middle (MB)";
    if (berthMod === 3 || berthMod === 6) return "Upper (UB)";
    if (berthMod === 7) return "Side Lower (SL)";
    return "Side Upper (SU)";
  };

  return (
    <div className="bg-gray-950/80 border border-gray-800 rounded-2xl p-5 my-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-gray-850 pb-3">
        <div>
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <span>💺 Coach Compartment:</span>
            <span className="bg-blue-900/60 text-blue-300 font-mono px-2 py-0.5 rounded text-xs">
              {coachCode} ({classType})
            </span>
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Select {seatsCount} seat{seatsCount > 1 ? "s" : ""} on the interactive coach diagram below
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gray-800 border border-gray-600 inline-block"></span>
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-400 inline-block"></span>
            <span className="text-blue-300 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-red-950 border border-red-800/80 inline-block"></span>
            <span className="text-gray-500">Booked</span>
          </div>
        </div>
      </div>

      {/* Train Coach Outer Outline */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[580px] bg-gray-900/90 border-2 border-gray-700 rounded-xl p-4 relative shadow-inner">
          {/* Coach Doors */}
          <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-3 px-2 border-b border-gray-800 pb-1">
            <span>🚪 Entry Door (A)</span>
            <span>Aisle & Corridor Passage</span>
            <span>Exit Door (B) 🚪</span>
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            {Array.from({ length: totalCoachSeats }, (_, i) => {
              const seatNum = i + 1;
              const seatId = `${coachCode}-${seatNum}`;
              const isOccupied = occupiedSet.has(seatId);
              const isSelected = selectedSeats.includes(seatId);
              const seatType = getSeatType(seatNum);

              return (
                <button
                  key={seatId}
                  type="button"
                  onClick={() => toggleSeat(seatId)}
                  disabled={isOccupied}
                  title={`${seatId} - ${seatType} (${isOccupied ? "Occupied" : "Available"})`}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition duration-150 relative ${
                    isOccupied
                      ? "bg-red-950/40 border-red-900/60 text-gray-600 cursor-not-allowed opacity-60"
                      : isSelected
                      ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400"
                      : "bg-gray-800/90 border-gray-700 text-gray-200 hover:border-blue-400 hover:bg-gray-750"
                  }`}
                >
                  <span className="font-mono font-bold text-[11px]">{seatNum}</span>
                  <span
                    className={`text-[9px] mt-0.5 truncate max-w-full ${
                      isSelected ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {seatType.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Seats summary pill */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-850">
        <div>
          Selected Seat(s):{" "}
          {selectedSeats.length > 0 ? (
            <span className="text-blue-400 font-mono font-bold">
              {selectedSeats.join(", ")}
            </span>
          ) : (
            <span className="text-gray-500 italic">None selected yet (auto-allocated if blank)</span>
          )}
        </div>
        <div className="text-gray-500">
          {selectedSeats.length}/{seatsCount} assigned
        </div>
      </div>
    </div>
  );
}
