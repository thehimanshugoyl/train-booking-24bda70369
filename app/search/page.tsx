"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CoachSeatPicker from "@/components/CoachSeatPicker";
import Logo from "@/components/Logo";

interface PassengerItem {
  name: string;
  age: number | string;
  gender: string;
  berthPreference: string;
  seatNumber?: string;
}

export default function Search() {
  const [form, setForm] = useState({ from: "", to: "", date: "" });
  const [trains, setTrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<string>("SL");
  const [showCoachMap, setShowCoachMap] = useState<boolean>(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [passengersList, setPassengersList] = useState<PassengerItem[]>([
    { name: "", age: "", gender: "Male", berthPreference: "No Preference" },
  ]);
  const [stationSuggestions, setStationSuggestions] = useState<string[]>([]);

  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchInitialTrains();
  }, [user]);

  const fetchInitialTrains = async () => {
    setLoading(true);
    try {
      const [trainsRes, stationsRes] = await Promise.all([
        axios.get("/api/trains"),
        axios.get("/api/trains?action=stations").catch(() => ({ data: { stations: [] } })),
      ]);
      setTrains(trainsRes.data.trains || []);
      if (stationsRes.data?.stations) {
        setStationSuggestions(stationsRes.data.stations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchTrains = async (e?: React.FormEvent, customParams?: any) => {
    if (e) e.preventDefault();
    setLoading(true);
    const searchFrom = customParams?.from !== undefined ? customParams.from : form.from;
    const searchTo = customParams?.to !== undefined ? customParams.to : form.to;
    const searchDate = customParams?.date !== undefined ? customParams.date : form.date;

    try {
      const query = new URLSearchParams();
      if (searchFrom) query.append("from", searchFrom);
      if (searchTo) query.append("to", searchTo);
      if (searchDate) query.append("date", searchDate);

      const res = await axios.get(`/api/trains?${query.toString()}`);
      setTrains(res.data.trains || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickFilter = (fromCity: string, toCity: string) => {
    setForm({ ...form, from: fromCity, to: toCity });
    searchTrains(undefined, { from: fromCity, to: toCity, date: form.date });
  };

  const startBooking = (train: any) => {
    const defaultCls = train.classes?.[0]?.classType || "SL";
    setSelectedClass(defaultCls);
    setBooking(train._id);
    setShowCoachMap(false);
    setSelectedSeats([]);
    setPassengersList([
      {
        name: user?.name || "",
        age: "",
        gender: (user as any)?.gender || "Male",
        berthPreference: "No Preference",
      },
    ]);
  };

  const addPassenger = (maxAvailable: number) => {
    if (passengersList.length >= Math.min(6, maxAvailable)) return;
    setPassengersList([
      ...passengersList,
      { name: "", age: "", gender: "Male", berthPreference: "No Preference" },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengersList.length <= 1) return;
    const updated = passengersList.filter((_, i) => i !== index);
    setPassengersList(updated);
  };

  const updatePassenger = (index: number, field: keyof PassengerItem, value: any) => {
    const updated = [...passengersList];
    updated[index] = { ...updated[index], [field]: value };
    setPassengersList(updated);
  };

  const handleSeatsChosen = (seats: string[]) => {
    setSelectedSeats(seats);
    // Link chosen seats into passengers
    const updated = passengersList.map((p, idx) => ({
      ...p,
      seatNumber: seats[idx] || p.seatNumber || "",
    }));
    setPassengersList(updated);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 bg-gray-850 border border-gray-800 rounded-2xl p-4 shadow-lg">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex gap-2 sm:gap-3 items-center">
          <span className="text-gray-300 text-sm hidden sm:inline">Hello, {user?.name}</span>
          <Link
            href="/pnr"
            className="bg-gray-800 hover:bg-gray-750 text-yellow-300 border border-yellow-500/30 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            Track PNR
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
            >
              ⚙️ Admin
            </Link>
          )}
          <Link
            href="/profile"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
          >
            <span>👤</span> Profile
          </Link>
          <Link
            href="/bookings"
            className="bg-gray-800 hover:bg-gray-750 border border-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
          >
            🎫 My Bookings
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-6 border border-white/10 shadow-2xl bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/railway_station_bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-emerald-950/40" />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Book Your Next Journey</h2>
          <p className="text-gray-300 text-sm mb-6 max-w-xl">
            Search 25,571 live trains across Indian Railways routes with instant berth & class seat allocation.
          </p>

        {/* Quick Route Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-gray-400 self-center mr-1">Popular Routes:</span>
          {[
            { label: "Delhi ⇄ Mumbai", from: "New Delhi", to: "Mumbai Central" },
            { label: "Delhi ⇄ Varanasi", from: "New Delhi", to: "Varanasi Junction" },
            { label: "Bengaluru ⇄ Chennai", from: "Bengaluru City", to: "Chennai Central" },
            { label: "Delhi ⇄ Kolkata", from: "New Delhi", to: "Howrah (Kolkata)" },
            { label: "Delhi ⇄ Bhopal", from: "New Delhi", to: "Bhopal Junction" },
          ].map((pill, idx) => (
            <button
              key={idx}
              onClick={() => quickFilter(pill.from, pill.to)}
              className="text-xs bg-gray-800/80 hover:bg-blue-600/40 border border-gray-700 px-3 py-1.5 rounded-full transition text-gray-300 hover:text-white"
            >
              {pill.label}
            </button>
          ))}
          <button
            onClick={() => {
              setForm({ from: "", to: "", date: "" });
              fetchInitialTrains();
            }}
            className="text-xs bg-gray-700/60 hover:bg-gray-600 border border-gray-600 px-3 py-1.5 rounded-full transition text-gray-300"
          >
            Show All
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={searchTrains} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Origin Station</label>
            <input
              type="text"
              list="stations-list"
              placeholder="e.g. New Delhi, Mumbai"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              className="w-full bg-gray-900/90 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Destination Station</label>
            <input
              type="text"
              list="stations-list"
              placeholder="e.g. Varanasi, Chennai"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className="w-full bg-gray-900/90 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <datalist id="stations-list">
            {stationSuggestions.map((st, i) => (
              <option key={i} value={st} />
            ))}
          </datalist>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Travel Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-gray-900/90 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl p-3 font-semibold text-white transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : "🔍 Find Trains"}
            </button>
          </div>
        </form>
        </div>
      </div>

      {/* Train Results List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-400 px-1">
          <span>
            Available Trains: <strong className="text-white">{trains.length}</strong>
          </span>
        </div>

        {trains.map((train: any) => {
          const matchedClass =
            train.classes?.find((c: any) => c.classType === selectedClass) || train.classes?.[0];
          const displayPrice = matchedClass ? matchedClass.price : train.price;
          const displayAvailable = matchedClass ? matchedClass.availableSeats : train.availableSeats;
          const totalFare = displayPrice * passengersList.length;

          return (
            <div
              key={train._id}
              className="bg-gray-850 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition shadow-md"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{train.trainName}</h3>
                    <span className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2.5 py-0.5 rounded font-mono">
                      #{train.trainNumber}
                    </span>
                    {train.trainType && (
                      <span className="bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs px-2.5 py-0.5 rounded font-medium">
                        {train.trainType}
                      </span>
                    )}
                    {train.date && (
                      <span className="text-xs text-gray-400 ml-auto md:ml-2">
                        📅 {train.date}
                      </span>
                    )}
                  </div>

                  {/* Route & Timings */}
                  <div className="flex gap-6 mt-3 items-center">
                    <div>
                      <p className="text-blue-400 font-semibold text-lg">{train.from}</p>
                      <p className="text-gray-300 text-sm font-mono">{train.departureTime}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      {train.duration && (
                        <span className="text-[11px] text-gray-400 mb-1">⏳ {train.duration}</span>
                      )}
                      <div className="text-gray-500 text-xl font-bold">→</div>
                    </div>
                    <div>
                      <p className="text-green-400 font-semibold text-lg">{train.to}</p>
                      <p className="text-gray-300 text-sm font-mono">{train.arrivalTime}</p>
                    </div>
                  </div>

                  {/* Class Chips */}
                  {train.classes && train.classes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-800">
                      <span className="text-xs text-gray-400 self-center mr-1">Classes:</span>
                      {train.classes.map((c: any) => {
                        const isSelected = booking === train._id && selectedClass === c.classType;
                        return (
                          <button
                            key={c.classType}
                            type="button"
                            onClick={() => {
                              setSelectedClass(c.classType);
                              if (booking !== train._id) startBooking(train);
                            }}
                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-500"
                                : "bg-gray-900/80 text-gray-300 border-gray-700 hover:border-gray-500"
                            }`}
                          >
                            <span className="font-bold">{c.classType}</span> ({c.className}) • ₹
                            {c.price} •{" "}
                            <span
                              className={
                                c.availableSeats > 10 ? "text-green-400" : "text-yellow-400"
                              }
                            >
                              {c.availableSeats} left
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pricing & Booking Trigger */}
                <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-800">
                  <p className="text-3xl font-extrabold text-yellow-400">₹{displayPrice}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {displayAvailable > 0 ? (
                      <span className="text-green-400 font-semibold">
                        {displayAvailable} seats available
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">Sold Out</span>
                    )}
                  </p>
                  <button
                    onClick={() => startBooking(train)}
                    disabled={displayAvailable === 0}
                    className="mt-3 w-full md:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-6 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-green-700/20"
                  >
                    {displayAvailable === 0 ? "Sold Out" : "Book Ticket"}
                  </button>
                </div>
              </div>

              {/* Upgraded Multi-Passenger & Interactive Coach Drawer */}
              {booking === train._id && (
                <div className="mt-5 border-t border-gray-800 pt-5 bg-gray-900/90 p-5 rounded-2xl border border-blue-500/30">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <div>
                      <h4 className="text-yellow-400 font-bold text-base">
                        Passenger Manifest & Coach Selection
                      </h4>
                      <p className="text-xs text-gray-400">
                        {matchedClass ? matchedClass.className : "Standard"} Class • ₹{displayPrice}{" "}
                        / passenger
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCoachMap(!showCoachMap)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-blue-300 px-3 py-1.5 rounded-lg font-medium transition"
                      >
                        {showCoachMap ? "Hide Coach Map" : "🗺️ View Coach Seat Map"}
                      </button>

                      <span className="text-sm text-yellow-300 font-black">
                        Total: ₹{totalFare}
                      </span>
                    </div>
                  </div>

                  {/* Optional Interactive Coach Map */}
                  {showCoachMap && (
                    <CoachSeatPicker
                      classType={selectedClass}
                      seatsCount={passengersList.length}
                      onSeatsSelected={handleSeatsChosen}
                      initiallySelected={selectedSeats}
                    />
                  )}

                  {/* Multi-Passenger Dynamic Rows */}
                  <div className="space-y-3 mb-4">
                    {passengersList.map((passenger, pIdx) => (
                      <div
                        key={pIdx}
                        className="bg-gray-950/90 border border-gray-800 p-3.5 rounded-xl flex flex-col md:flex-row gap-3 items-start md:items-center"
                      >
                        <div className="text-xs text-blue-400 font-bold self-center">
                          P{pIdx + 1}
                        </div>

                        {/* Name */}
                        <div className="flex-1 w-full md:w-auto">
                          <label className="text-[11px] text-gray-400 block mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Himanshu Goyal"
                            value={passenger.name}
                            onChange={(e) => updatePassenger(pIdx, "name", e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs"
                            required
                          />
                        </div>

                        {/* Age */}
                        <div className="w-full md:w-24">
                          <label className="text-[11px] text-gray-400 block mb-1">Age</label>
                          <input
                            type="number"
                            placeholder="Age"
                            min={1}
                            max={110}
                            value={passenger.age}
                            onChange={(e) => updatePassenger(pIdx, "age", e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs"
                            required
                          />
                        </div>

                        {/* Gender */}
                        <div className="w-full md:w-28">
                          <label className="text-[11px] text-gray-400 block mb-1">Gender</label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => updatePassenger(pIdx, "gender", e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Berth Preference */}
                        <div className="w-full md:w-36">
                          <label className="text-[11px] text-gray-400 block mb-1">
                            Berth Choice
                          </label>
                          <select
                            value={passenger.berthPreference}
                            onChange={(e) =>
                              updatePassenger(pIdx, "berthPreference", e.target.value)
                            }
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs"
                          >
                            <option value="No Preference">No Preference</option>
                            <option value="Lower">Lower Berth</option>
                            <option value="Middle">Middle Berth</option>
                            <option value="Upper">Upper Berth</option>
                            <option value="Side Lower">Side Lower</option>
                            <option value="Side Upper">Side Upper</option>
                            <option value="Window">Window</option>
                          </select>
                        </div>

                        {/* Seat allocated */}
                        {passenger.seatNumber && (
                          <div className="w-full md:w-24">
                            <label className="text-[11px] text-blue-400 block mb-1">
                              Seat
                            </label>
                            <span className="bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-xs px-2 py-1.5 rounded block text-center">
                              {passenger.seatNumber}
                            </span>
                          </div>
                        )}

                        {/* Remove passenger action */}
                        {passengersList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePassenger(pIdx)}
                            className="text-red-400 hover:text-red-300 text-xs self-center px-2 py-1"
                            title="Remove passenger"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Passenger & Checkout Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => addPassenger(displayAvailable || 6)}
                      disabled={passengersList.length >= Math.min(6, displayAvailable || 6)}
                      className="text-xs bg-gray-800 hover:bg-gray-750 disabled:opacity-40 border border-gray-700 text-blue-300 px-3.5 py-2 rounded-xl font-medium transition"
                    >
                      ➕ Add Another Passenger ({passengersList.length}/
                      {Math.min(6, displayAvailable || 6)})
                    </button>

                    <div className="flex gap-3 ml-auto">
                      <button
                        onClick={() => setBooking(null)}
                        className="bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-xl text-sm transition"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          // Validation
                          const isInvalid = passengersList.some((p) => !p.name.trim() || !p.age);
                          if (isInvalid) {
                            alert("Please fill in the Name and Age for each passenger.");
                            return;
                          }

                          const query = new URLSearchParams({
                            trainId: train._id,
                            seats: passengersList.length.toString(),
                            classType: selectedClass,
                            passengerName: passengersList[0].name,
                            passengerAge: passengersList[0].age.toString(),
                            price: totalFare.toString(),
                            trainName: train.trainName,
                            from: train.from,
                            to: train.to,
                            date: train.date,
                            passengers: encodeURIComponent(JSON.stringify(passengersList)),
                          });
                          router.push(`/payment?${query.toString()}`);
                        }}
                        className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition shadow-lg shadow-green-700/30"
                      >
                        Proceed to Checkout — ₹{totalFare}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {trains.length === 0 && !loading && (
          <div className="text-center py-20 bg-gray-850 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-lg mb-2">No trains found for this route</p>
            <p className="text-gray-500 text-sm mb-6">
              Try searching without dates or choose one of the popular routes above.
            </p>
            <button
              onClick={fetchInitialTrains}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              Browse All Trains
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Searching railway database...</p>
          </div>
        )}
      </div>
    </div>
  );
}