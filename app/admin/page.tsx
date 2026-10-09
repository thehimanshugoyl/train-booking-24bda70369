"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function Admin() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedingMassive, setSeedingMassive] = useState(false);
  const [massiveProgress, setMassiveProgress] = useState(0);
  const [massiveStatus, setMassiveStatus] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [form, setForm] = useState({
    trainNumber: "",
    trainName: "",
    trainType: "Superfast Express",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    totalSeats: "",
    price: "",
    date: "",
  });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/search");
      return;
    }
    fetchStats();
    fetchTrains();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
      await axios.post(
        "/api/admin/trains",
        {
          ...form,
          totalSeats: Number(form.totalSeats),
          price: Number(form.price),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Train added successfully!");
      setForm({
        trainNumber: "",
        trainName: "",
        trainType: "Superfast Express",
        from: "",
        to: "",
        departureTime: "",
        arrivalTime: "",
        duration: "",
        totalSeats: "",
        price: "",
        date: "",
      });
      fetchTrains();
      fetchStats();
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data?.error || "Failed to add train"));
    }
  };

  const handleDeleteTrain = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove train "${name}"?`)) return;
    try {
      await axios.delete(`/api/admin/trains/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrains();
      fetchStats();
    } catch (err: any) {
      alert("Failed to delete train: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm("This will seed realistic Indian Railways routes (Vande Bharat, Rajdhani, Shatabdi) across dates. Proceed?")) return;
    setSeeding(true);
    try {
      const res = await axios.post("/api/seed");
      alert(res.data.message || "Database seeded successfully!");
      fetchTrains();
      fetchStats();
    } catch (err: any) {
      alert("Failed to seed: " + (err.response?.data?.error || err.message));
    } finally {
      setSeeding(false);
    }
  };

  const handleSeedAllIndiaTrains = async () => {
    if (
      !confirm(
        "This will seed 25,571 Indian Railways daily scheduled trains spanning all railway zones across India. Proceed?"
      )
    )
      return;

    setSeedingMassive(true);
    setMassiveProgress(5);
    setMassiveStatus("Initializing bulk ingestion of 25,571 daily trains...");

    try {
      let isDone = false;
      while (!isDone) {
        const res = await axios.post(
          "/api/admin/seed-massive?batchSize=3500&target=25571"
        );
        const prog = res.data.progress || 0;
        setMassiveProgress(prog);
        setMassiveStatus(
          `Imported ${res.data.totalTrainsInDB.toLocaleString()} / 25,571 daily trains (${prog}%)`
        );
        if (res.data.isComplete || prog >= 100) {
          isDone = true;
          alert(`🎉 Success! All 25,571 Indian Railways scheduled trains are now live in the database!`);
        }
      }
      fetchTrains();
      fetchStats();
    } catch (err: any) {
      alert("Massive seeding error: " + (err.response?.data?.error || err.message));
    } finally {
      setSeedingMassive(false);
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
      <nav className="flex flex-wrap justify-between items-center mb-8 bg-gray-800 rounded-xl p-4 gap-3">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <div className="flex flex-wrap gap-2.5 items-center">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={handleSeedAllIndiaTrains}
            disabled={seedingMassive}
            className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-md shadow-white/10 dark:bg-white dark:text-black light:bg-black light:text-white"
          >
            {seedingMassive ? `⏳ ${massiveProgress}% Imported` : "⚡ Seed All 25,571 Trains"}
          </button>
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 disabled:opacity-50 px-3 py-2 rounded-lg text-xs font-semibold text-white transition hidden sm:inline-block"
          >
            {seeding ? "⏳ Seeding..." : "🌱 Quick Sample (24+)"}
          </button>
          <span className="text-gray-300 text-sm hidden md:inline">👤 {user?.name}</span>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-zinc-800 hover:bg-red-900 border border-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Massive 25,571 Trains Live Progress Banner */}
      {seedingMassive && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 mb-6 shadow-2xl animate-pulse">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span>⚡ Bulk Ingestion: 25,571 Indian Railways Trains</span>
            </span>
            <span className="font-mono text-sm font-extrabold text-amber-300">
              {massiveProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-950 rounded-full h-3 overflow-hidden border border-gray-800 mb-2">
            <div
              className="bg-white h-3 transition-all duration-300"
              style={{ width: `${Math.max(5, massiveProgress)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 font-mono">{massiveStatus}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-gray-800 rounded-xl p-2 overflow-x-auto">
        {[
          { id: "stats", label: "📊 Statistics" },
          { id: "trains", label: "🚆 Fleet Management" },
          { id: "add", label: "➕ Add Train" },
          { id: "bookings", label: "🎫 Bookings" },
          { id: "users", label: "👥 Users" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-black shadow-md dark:bg-white dark:text-black light:bg-black light:text-white"
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-400">📊 Platform Statistics</h2>
            <button
              onClick={fetchStats}
              className="text-xs text-blue-400 hover:underline"
            >
              🔄 Refresh Data
            </button>
          </div>

          {statsLoading ? (
            <p className="text-gray-400 text-center py-10">Loading statistics...</p>
          ) : (
            <>
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon="👥"
                  label="Total Users"
                  value={stats?.totalUsers || 0}
                  sub="Registered accounts"
                  color="border-blue-500"
                />
                <StatCard
                  icon="🚆"
                  label="Total Trains"
                  value={stats?.totalTrains || 0}
                  sub="Active routes scheduled"
                  color="border-green-500"
                />
                <StatCard
                  icon="🎫"
                  label="Total Bookings"
                  value={stats?.totalBookings || 0}
                  sub={`${stats?.confirmedBookings || 0} confirmed`}
                  color="border-yellow-500"
                />
                <StatCard
                  icon="💰"
                  label="Total Revenue"
                  value={`₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`}
                  sub="From confirmed bookings"
                  color="border-purple-500"
                />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon="✅"
                  label="Confirmed"
                  value={stats?.confirmedBookings || 0}
                  sub="Active bookings"
                  color="border-green-500"
                />
                <StatCard
                  icon="❌"
                  label="Cancelled"
                  value={stats?.cancelledBookings || 0}
                  sub="Cancelled bookings"
                  color="border-red-500"
                />
                <StatCard
                  icon="🌐"
                  label="Total Visits"
                  value={stats?.totalVisits || 0}
                  sub="All time site visits"
                  color="border-cyan-500"
                />
                <StatCard
                  icon="📅"
                  label="Today's Visits"
                  value={stats?.todayVisits || 0}
                  sub="Visits today"
                  color="border-orange-500"
                />
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
                        {
                          metric: "Total Registered Users",
                          value: stats?.totalUsers || 0,
                          detail: "Users who have created accounts",
                        },
                        {
                          metric: "Total Train Routes",
                          value: stats?.totalTrains || 0,
                          detail: "Train routes available for booking",
                        },
                        {
                          metric: "Total Bookings Made",
                          value: stats?.totalBookings || 0,
                          detail: "All bookings including cancelled",
                        },
                        {
                          metric: "Confirmed Bookings",
                          value: stats?.confirmedBookings || 0,
                          detail: "Active/completed bookings",
                        },
                        {
                          metric: "Cancelled Bookings",
                          value: stats?.cancelledBookings || 0,
                          detail: "Bookings cancelled by users",
                        },
                        {
                          metric: "Total Revenue (INR)",
                          value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
                          detail: "Revenue from confirmed bookings only",
                        },
                        {
                          metric: "Total Site Visits",
                          value: stats?.totalVisits || 0,
                          detail: "All-time platform visits tracked",
                        },
                        {
                          metric: "Today's Visits",
                          value: stats?.todayVisits || 0,
                          detail: "Visits since midnight today",
                        },
                        {
                          metric: "Avg. Revenue per Booking",
                          value:
                            stats?.confirmedBookings > 0
                              ? `₹${Math.round(
                                  (stats?.totalRevenue || 0) / stats.confirmedBookings
                                ).toLocaleString("en-IN")}`
                              : "₹0",
                          detail: "Average ticket value",
                        },
                        {
                          metric: "Cancellation Rate",
                          value:
                            stats?.totalBookings > 0
                              ? `${Math.round(
                                  ((stats?.cancelledBookings || 0) / stats.totalBookings) * 100
                                )}%`
                              : "0%",
                          detail: "% of total bookings cancelled",
                        },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-700 ${
                            i % 2 === 0 ? "bg-gray-900/30" : ""
                          }`}
                        >
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-400">
              🚆 Fleet Routes ({trains.length})
            </h2>
            <button
              onClick={() => setActiveTab("add")}
              className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2 rounded-lg font-semibold"
            >
              ➕ Add New Train
            </button>
          </div>
          {loading ? (
            <p className="text-gray-400">Loading trains...</p>
          ) : trains.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No trains scheduled in database.</p>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 rounded-xl font-semibold text-sm"
              >
                🌱 Seed 10+ Realistic Trains
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left p-3">Train</th>
                    <th className="text-left p-3">Route</th>
                    <th className="text-left p-3">Schedule</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Seats</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((train: any) => (
                    <tr key={train._id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-white font-semibold">{train.trainName}</p>
                            <div className="flex gap-2 items-center text-xs text-gray-400">
                              <span className="font-mono">#{train.trainNumber}</span>
                              {train.trainType && (
                                <span className="bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded text-[10px]">
                                  {train.trainType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-blue-400">{train.from}</p>
                        <p className="text-green-400">{train.to}</p>
                      </td>
                      <td className="p-3 text-gray-300">
                        {train.departureTime} → {train.arrivalTime}
                        {train.duration && (
                          <span className="block text-xs text-gray-400">⏳ {train.duration}</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-300">{train.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            train.availableSeats > 20
                              ? "bg-green-900 text-green-400"
                              : train.availableSeats > 0
                              ? "bg-yellow-900 text-yellow-400"
                              : "bg-red-900 text-red-400"
                          }`}
                        >
                          {train.availableSeats}/{train.totalSeats}
                        </span>
                      </td>
                      <td className="p-3 text-yellow-400 font-semibold">₹{train.price}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteTrain(train._id, train.trainName)}
                          className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-md transition"
                        >
                          Delete
                        </button>
                      </td>
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
          <h2 className="text-xl font-semibold text-yellow-400 mb-4">➕ Add New Train Route</h2>
          {message && <p className="mb-4 bg-gray-900 p-3 rounded-lg">{message}</p>}
          <form onSubmit={handleAddTrain} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Train Number (e.g. 12952)"
              value={form.trainNumber}
              onChange={(e) => setForm({ ...form, trainNumber: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <input
              type="text"
              placeholder="Train Name (e.g. Tejas Rajdhani)"
              value={form.trainName}
              onChange={(e) => setForm({ ...form, trainName: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <select
              value={form.trainType}
              onChange={(e) => setForm({ ...form, trainType: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
            >
              <option value="Vande Bharat">Vande Bharat Express</option>
              <option value="Rajdhani Express">Rajdhani Express</option>
              <option value="Shatabdi Express">Shatabdi Express</option>
              <option value="Superfast Express">Superfast Express</option>
              <option value="Mail Express">Mail Express</option>
            </select>
            <input
              type="text"
              placeholder="From (Origin City)"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <input
              type="text"
              placeholder="To (Destination City)"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g. 8h 30m)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
            />
            <input
              type="text"
              placeholder="Departure Time (e.g. 06:00)"
              value={form.departureTime}
              onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <input
              type="text"
              placeholder="Arrival Time (e.g. 14:30)"
              value={form.arrivalTime}
              onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <input
              type="number"
              placeholder="Total Seats (e.g. 120)"
              value={form.totalSeats}
              onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <input
              type="number"
              placeholder="Base Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              required
            />
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-semibold text-white transition"
              >
                🚀 Publish Train Route
              </button>
            </div>
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
                  <th className="text-left p-3">PNR / ID</th>
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
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-400">
                      No bookings recorded yet
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((b: any) => (
                    <tr key={b._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3 font-mono text-xs text-yellow-400">
                        {b.pnr || b._id?.slice(-8)}
                      </td>
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            b.status === "confirmed"
                              ? "bg-green-900 text-green-400"
                              : "bg-red-900 text-red-400"
                          }`}
                        >
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
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-400">
                      No users recorded yet
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((u: any) => (
                    <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3 text-white font-medium">{u.name}</td>
                      <td className="p-3 text-gray-300">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-purple-900 text-purple-400"
                              : "bg-blue-900 text-blue-400"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "N/A"}
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