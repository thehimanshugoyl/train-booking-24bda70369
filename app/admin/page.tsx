"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [form, setForm] = useState({
    trainNumber: "", trainName: "", from: "", to: "",
    departureTime: "", arrivalTime: "", totalSeats: "",
    price: "", date: "",
  });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/search"); return; }
    fetchStats();
    fetchTrains();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.stats);
      setRecentBookings(res.data.recentBookings || []);
      setRecentUsers(res.data.recentUsers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

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
      setForm({ trainNumber: "", trainName: "", from: "", to: "", departureTime: "", arrivalTime: "", totalSeats: "", price: "", date: "" });
      fetchTrains();
      fetchStats();
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data?.error || "Failed to add train"));
    }
  };

  const StatCard = ({ icon, label, value, sub, color }: any) => (
    <div className={`bg-gray-800 rounded-xl p-5 border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 bg-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚂</span>
          <h1 className="text-xl font-bold text-blue-400">Admin Panel</h1>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-gray-300 text-sm">👤 {user?.name}</span>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-gray-800 rounded-xl p-2">
        {[
          { id: "stats", label: "📊 Statistics" },
          { id: "trains", label: "🚆 Trains" },
          { id: "add", label: "➕ Add Train" },
          { id: "bookings", label: "🎫 Bookings" },
          { id: "users", label: "👥 Users" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── STATISTICS TAB ── */}
      {activeTab === "stats" && (
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">📊 Platform Statistics</h2>

          {statsLoading ? (
            <p className="text-gray-400 text-center py-10">Loading statistics...</p>
          ) : (
            <>
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon="👥" label="Total Users" value={stats?.totalUsers || 0}
                  sub="Registered accounts" color="border-blue-500" />
                <StatCard icon="🚆" label="Total Trains" value={stats?.totalTrains || 0}
                  sub="Active routes" color="border-green-500" />
                <StatCard icon="🎫" label="Total Bookings" value={stats?.totalBookings || 0}
                  sub={`${stats?.confirmedBookings || 0} confirmed`} color="border-yellow-500" />
                <StatCard icon="💰" label="Total Revenue"
                  value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
                  sub="From confirmed bookings" color="border-purple-500" />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon="✅" label="Confirmed" value={stats?.confirmedBookings || 0}
                  sub="Active bookings" color="border-green-500" />
                <StatCard icon="❌" label="Cancelled" value={stats?.cancelledBookings || 0}
                  sub="Cancelled bookings" color="border-red-500" />
                <StatCard icon="🌐" label="Total Visits" value={stats?.totalVisits || 0}
                  sub="All time site visits" color="border-cyan-500" />
                <StatCard icon="📅" label="Today's Visits" value={stats?.todayVisits || 0}
                  sub="Visits today" color="border-orange-500" />
              </div>

              {/* Summary Table */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">📈 Summary Overview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="text-left p-3">Metric</th>
                        <th className="text-left p-3">Value</th>
                        <th className="text-left p-3">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { metric: "Total Registered Users", value: stats?.totalUsers || 0, detail: "Users who have created accounts" },
                        { metric: "Total Train Routes", value: stats?.totalTrains || 0, detail: "Train routes available for booking" },
                        { metric: "Total Bookings Made", value: stats?.totalBookings || 0, detail: "All bookings including cancelled" },
                        { metric: "Confirmed Bookings", value: stats?.confirmedBookings || 0, detail: "Active/completed bookings" },
                        { metric: "Cancelled Bookings", value: stats?.cancelledBookings || 0, detail: "Bookings cancelled by users" },
                        { metric: "Total Revenue (INR)", value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, detail: "Revenue from confirmed bookings only" },
                        { metric: "Total Site Visits", value: stats?.totalVisits || 0, detail: "All-time platform visits" },
                        { metric: "Today's Visits", value: stats?.todayVisits || 0, detail: "Visits since midnight today" },
                        { metric: "Avg. Revenue per Booking", value: stats?.confirmedBookings > 0 ? `₹${Math.round((stats?.totalRevenue || 0) / stats.confirmedBookings).toLocaleString('en-IN')}` : "₹0", detail: "Average ticket value" },
                        { metric: "Cancellation Rate", value: stats?.totalBookings > 0 ? `${Math.round(((stats?.cancelledBookings || 0) / stats.totalBookings) * 100)}%` : "0%", detail: "% of bookings cancelled" },
                      ].map((row, i) => (
                        <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? "bg-gray-900/30" : ""}`}>
                          <td className="p-3 text-white font-medium">{row.metric}</td>
                          <td className="p-3 text-yellow-400 font-bold">{row.value}</td>
                          <td className="p-3 text-gray-400">{row.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── TRAINS TAB ── */}
      {activeTab === "trains" && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            🚆 All Trains ({trains.length})
          </h2>
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
                        <p className="text-gray-400 text-xs">{train.trainNumber}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-blue-400">{train.from}</p>
                        <p className="text-green-400">{train.to}</p>
                      </td>
                      <td className="p-3 text-gray-300">{train.departureTime} → {train.arrivalTime}</td>
                      <td className="p-3 text-gray-300">{train.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${train.availableSeats > 20 ? "bg-green-900 text-green-400" : train.availableSeats > 0 ? "bg-yellow-900 text-yellow-400" : "bg-red-900 text-red-400"}`}>
                          {train.availableSeats}/{train.totalSeats}
                        </span>
                      </td>
                      <td className="p-3 text-yellow-400 font-semibold">₹{train.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ADD TRAIN TAB ── */}
      {activeTab === "add" && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4">➕ Add New Train</h2>
          {message && <p className="mb-4 bg-gray-900 p-3 rounded-lg">{message}</p>}
          <form onSubmit={handleAddTrain} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "trainNumber", placeholder: "Train Number (e.g. 12301)" },
              { key: "trainName", placeholder: "Train Name" },
              { key: "from", placeholder: "From (City)" },
              { key: "to", placeholder: "To (City)" },
              { key: "departureTime", placeholder: "Departure (e.g. 08:00)" },
              { key: "arrivalTime", placeholder: "Arrival (e.g. 20:00)" },
              { key: "totalSeats", placeholder: "Total Seats" },
              { key: "price", placeholder: "Price per Seat (₹)" },
            ].map((field) => (
              <input key={field.key} type="text" placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
            ))}
            <input type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" required />
            <button type="submit"
              className="md:col-span-3 bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold">
              Add Train
            </button>
          </form>
        </div>
      )}

      {/* ── BOOKINGS TAB ── */}
      {activeTab === "bookings" && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">🎫 Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Train</th>
                  <th className="text-left p-3">Route</th>
                  <th className="text-left p-3">Seats</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-400">No bookings yet</td></tr>
                ) : (
                  recentBookings.map((b: any) => (
                    <tr key={b._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3">
                        <p className="text-white">{b.user?.name || "N/A"}</p>
                        <p className="text-gray-400 text-xs">{b.user?.email || ""}</p>
                      </td>
                      <td className="p-3 text-white">{b.train?.trainName || "N/A"}</td>
                      <td className="p-3">
                        <span className="text-blue-400">{b.train?.from}</span>
                        <span className="text-gray-500"> → </span>
                        <span className="text-green-400">{b.train?.to}</span>
                      </td>
                      <td className="p-3 text-gray-300">{b.seats}</td>
                      <td className="p-3 text-yellow-400 font-semibold">₹{b.totalPrice}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === "confirmed" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === "users" && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">👥 Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-400">No users yet</td></tr>
                ) : (
                  recentUsers.map((u: any) => (
                    <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3 text-white font-medium">{u.name}</td>
                      <td className="p-3 text-gray-300">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-purple-900 text-purple-400" : "bg-blue-900 text-blue-400"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}