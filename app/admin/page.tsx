"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    trainNumber: "", trainName: "", from: "", to: "",
    departureTime: "", arrivalTime: "", totalSeats: "",
    price: "", date: "",
  });
  const [message, setMessage] = useState("");
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/search"); return; }
    fetchTrains();
  }, [user]);

  const fetchTrains = async () => {
    try {
      const res = await axios.get("/api/admin/trains", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrains(res.data.trains);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/trains", {
        ...form,
        totalSeats: Number(form.totalSeats),
        price: Number(form.price),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("✅ Train added successfully!");
      setForm({
        trainNumber: "", trainName: "", from: "", to: "",
        departureTime: "", arrivalTime: "", totalSeats: "",
        price: "", date: "",
      });
      fetchTrains();
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data?.error || "Failed to add train"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 bg-gray-800 rounded-xl p-4">
        <h1 className="text-2xl font-bold text-blue-400">🚂 Admin Panel</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-300">Admin: {user?.name}</span>
          <button onClick={() => { logout(); router.push("/login"); }} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
      </nav>

      {/* Add Train Form */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">➕ Add New Train</h2>
        {message && <p className="mb-4 bg-gray-900 p-3 rounded-lg">{message}</p>}
        <form onSubmit={handleAddTrain} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Train Number" value={form.trainNumber}
            onChange={(e) => setForm({ ...form, trainNumber: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="text" placeholder="Train Name" value={form.trainName}
            onChange={(e) => setForm({ ...form, trainName: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="text" placeholder="From (City)" value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="text" placeholder="To (City)" value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="text" placeholder="Departure Time (e.g. 08:00)" value={form.departureTime}
            onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="text" placeholder="Arrival Time (e.g. 14:00)" value={form.arrivalTime}
            onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="number" placeholder="Total Seats" value={form.totalSeats}
            onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="number" placeholder="Price per Seat (₹)" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <input type="date" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
          <button type="submit" className="md:col-span-3 bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold">
            Add Train
          </button>
        </form>
      </div>

      {/* Trains List */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-green-400 mb-4">🚆 All Trains ({trains.length})</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left p-3">Train</th>
                  <th className="text-left p-3">Route</th>
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Seats</th>
                  <th className="text-left p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train: any) => (
                  <tr key={train._id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3">
                      <p className="text-white font-semibold">{train.trainName}</p>
                      <p className="text-gray-400">{train.trainNumber}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-blue-400">{train.from}</p>
                      <p className="text-green-400">{train.to}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-300">{train.departureTime} → {train.arrivalTime}</p>
                    </td>
                    <td className="p-3 text-gray-300">{train.date}</td>
                    <td className="p-3">
                      <p className="text-gray-300">{train.availableSeats}/{train.totalSeats}</p>
                    </td>
                    <td className="p-3 text-yellow-400 font-semibold">₹{train.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}