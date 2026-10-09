/**
 * GADDVYA Real-World PostgreSQL Database Layer for Supabase.
 * Uses native fetch to connect to Supabase PostgREST endpoints.
 * Includes automatic local resilient fallback if Supabase credentials are pending.
 */

import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_KEY &&
    !SUPABASE_URL.includes("your-project") &&
    !SUPABASE_KEY.includes("your_")
);

// Fallback Local Storage Path (when Supabase URL is not yet in .env.local)
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");

function getLocalData(collection: string): any[] {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    const filePath = path.join(LOCAL_DATA_DIR, `${collection}.json`);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    return [];
  }
}

function saveLocalData(collection: string, data: any[]): void {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    const filePath = path.join(LOCAL_DATA_DIR, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`[Local DB] Error saving ${collection}:`, err);
  }
}

// Low-level Supabase REST API Caller
async function supabaseRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: any; count?: number; error?: string }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: "SUPABASE_NOT_CONFIGURED" };
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    apikey: SUPABASE_KEY!,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: errText || res.statusText };
    }

    const contentRange = res.headers.get("content-range");
    let totalCount: number | undefined;
    if (contentRange && contentRange.includes("/")) {
      const parts = contentRange.split("/");
      totalCount = parseInt(parts[1], 10);
    }

    const data = await res.json();
    return { data, count: totalCount };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to reach Supabase" };
  }
}

// High-Level PostgreSQL Database Interface for GADDVYA
export const db = {
  users: {
    async findByEmail(email: string) {
      const cleanEmail = email.trim().toLowerCase();
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(
          `users?email=eq.${encodeURIComponent(cleanEmail)}&limit=1`
        );
        return res.data?.[0] || null;
      }
      const list = getLocalData("users");
      return list.find((u) => u.email?.toLowerCase() === cleanEmail) || null;
    },

    async findByPhone(phone: string) {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(
          `users?phone=eq.${encodeURIComponent(cleanPhone)}&limit=1`
        );
        return res.data?.[0] || null;
      }
      const list = getLocalData("users");
      return list.find((u) => u.phone === cleanPhone) || null;
    },

    async findById(id: string) {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(`users?id=eq.${id}&limit=1`);
        return res.data?.[0] || null;
      }
      const list = getLocalData("users");
      return list.find((u) => u.id === id || u._id === id) || null;
    },

    async create(userData: any) {
      const newUser = {
        ...userData,
        email: userData.email?.toLowerCase().trim(),
        phone: userData.phone?.replace(/\D/g, "").slice(-10),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const res = await supabaseRequest("users", {
          method: "POST",
          body: JSON.stringify(newUser),
        });
        if (res.error) throw new Error(res.error);
        return res.data?.[0];
      }

      const list = getLocalData("users");
      const localId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const saved = { id: localId, _id: localId, ...newUser };
      list.push(saved);
      saveLocalData("users", list);
      return saved;
    },

    async count() {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest("users?select=count", {
          headers: { Prefer: "count=exact" },
        });
        return res.count || (Array.isArray(res.data) ? res.data.length : 0);
      }
      return getLocalData("users").length;
    },

    async findRecent(limit = 5) {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(
          `users?select=*&order=created_at.desc&limit=${limit}`
        );
        return res.data || [];
      }
      return getLocalData("users").slice(-limit).reverse();
    },
  },

  otps: {
    async create(otpData: {
      identifier: string;
      code: string;
      type: "email" | "phone";
      purpose: "register" | "login";
      expiresAt: Date;
    }) {
      const record = {
        identifier: otpData.identifier.trim().toLowerCase(),
        code: otpData.code,
        type: otpData.type,
        purpose: otpData.purpose,
        expires_at: otpData.expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        // delete previous
        await supabaseRequest(
          `otps?identifier=eq.${encodeURIComponent(record.identifier)}&purpose=eq.${record.purpose}`,
          { method: "DELETE" }
        );
        const res = await supabaseRequest("otps", {
          method: "POST",
          body: JSON.stringify(record),
        });
        return res.data?.[0];
      }

      let list = getLocalData("otps");
      list = list.filter(
        (o) =>
          !(
            o.identifier?.toLowerCase() === record.identifier &&
            o.purpose === record.purpose
          )
      );
      list.push(record);
      saveLocalData("otps", list);
      return record;
    },

    async verify(identifier: string, code: string, purpose: string) {
      const cleanId = identifier.trim().toLowerCase();
      const now = new Date().toISOString();

      if (isSupabaseConfigured) {
        const res = await supabaseRequest(
          `otps?identifier=eq.${encodeURIComponent(cleanId)}&code=eq.${code}&purpose=eq.${purpose}&expires_at=gt.${now}&limit=1`
        );
        return res.data?.[0] || null;
      }

      const list = getLocalData("otps");
      const match = list.find(
        (o) =>
          o.identifier?.toLowerCase() === cleanId &&
          o.code === code &&
          o.purpose === purpose &&
          new Date(o.expires_at) > new Date()
      );
      return match || null;
    },

    async delete(identifier: string, purpose: string) {
      const cleanId = identifier.trim().toLowerCase();
      if (isSupabaseConfigured) {
        await supabaseRequest(
          `otps?identifier=eq.${encodeURIComponent(cleanId)}&purpose=eq.${purpose}`,
          { method: "DELETE" }
        );
        return;
      }
      let list = getLocalData("otps");
      list = list.filter(
        (o) => !(o.identifier?.toLowerCase() === cleanId && o.purpose === purpose)
      );
      saveLocalData("otps", list);
    },
  },

  trains: {
    async search({
      from,
      to,
      date,
      limit = 50,
      page = 1,
    }: {
      from?: string;
      to?: string;
      date?: string;
      limit?: number;
      page?: number;
    }) {
      const offset = (page - 1) * limit;

      if (isSupabaseConfigured) {
        let query = `trains?select=*`;
        if (from) query += `&from_station=ilike.*${encodeURIComponent(from)}*`;
        if (to) query += `&to_station=ilike.*${encodeURIComponent(to)}*`;
        if (date) query += `&or=(date.eq.${date},runs_on.eq.Daily)`;
        query += `&order=departure_time.asc&limit=${limit}&offset=${offset}`;

        const res = await supabaseRequest(query, {
          headers: { Prefer: "count=exact" },
        });

        return {
          trains: (res.data || []).map((t: any) => ({
            ...t,
            _id: t.id,
            from: t.from_station,
            to: t.to_station,
            totalSeats: t.total_seats,
            availableSeats: t.available_seats,
            departureTime: t.departure_time,
            arrivalTime: t.arrival_time,
            trainNumber: t.train_number,
            trainName: t.train_name,
            trainType: t.train_type,
          })),
          totalMatching: res.count || res.data?.length || 0,
        };
      }

      // Local fallback
      let list = getLocalData("trains");
      if (from) {
        const fLower = from.toLowerCase();
        list = list.filter((t) =>
          (t.from || t.from_station)?.toLowerCase().includes(fLower)
        );
      }
      if (to) {
        const tLower = to.toLowerCase();
        list = list.filter((t) =>
          (t.to || t.to_station)?.toLowerCase().includes(tLower)
        );
      }
      if (date) {
        list = list.filter((t) => t.date === date || t.runs_on === "Daily");
      }

      const totalMatching = list.length;
      const paginated = list.slice(offset, offset + limit).map((t) => ({
        ...t,
        _id: t.id || t._id,
        from: t.from || t.from_station,
        to: t.to || t.to_station,
        totalSeats: t.totalSeats || t.total_seats,
        availableSeats: t.availableSeats || t.available_seats,
        departureTime: t.departureTime || t.departure_time,
        arrivalTime: t.arrivalTime || t.arrival_time,
        trainNumber: t.trainNumber || t.train_number,
        trainName: t.trainName || t.train_name,
        trainType: t.trainType || t.train_type,
      }));

      return { trains: paginated, totalMatching };
    },

    async findById(id: string) {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(`trains?id=eq.${id}&limit=1`);
        const t = res.data?.[0];
        if (!t) return null;
        return {
          ...t,
          _id: t.id,
          from: t.from_station,
          to: t.to_station,
          totalSeats: t.total_seats,
          availableSeats: t.available_seats,
          departureTime: t.departure_time,
          arrivalTime: t.arrival_time,
          trainNumber: t.train_number,
          trainName: t.train_name,
        };
      }
      const list = getLocalData("trains");
      const found = list.find((t) => t.id === id || t._id === id);
      if (!found) return null;
      return {
        ...found,
        _id: found.id || found._id,
        from: found.from || found.from_station,
        to: found.to || found.to_station,
        totalSeats: found.totalSeats || found.total_seats,
        availableSeats: found.availableSeats || found.available_seats,
        departureTime: found.departureTime || found.departure_time,
        arrivalTime: found.arrivalTime || found.arrival_time,
        trainNumber: found.trainNumber || found.train_number,
        trainName: found.trainName || found.train_name,
      };
    },

    async create(trainData: any) {
      const record = {
        train_number: trainData.trainNumber || trainData.train_number,
        train_name: trainData.trainName || trainData.train_name,
        train_type: trainData.trainType || trainData.train_type,
        from_station: trainData.from || trainData.from_station,
        to_station: trainData.to || trainData.to_station,
        departure_time: trainData.departureTime || trainData.departure_time,
        arrival_time: trainData.arrivalTime || trainData.arrival_time,
        duration: trainData.duration,
        total_seats: Number(trainData.totalSeats || trainData.total_seats),
        available_seats: Number(
          trainData.availableSeats || trainData.available_seats || trainData.totalSeats
        ),
        price: Number(trainData.price),
        date: trainData.date || new Date().toISOString().split("T")[0],
        runs_on: trainData.runsOn || "Daily",
        classes: trainData.classes || [],
        intermediate_stations: trainData.intermediateStations || [],
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const res = await supabaseRequest("trains", {
          method: "POST",
          body: JSON.stringify(record),
        });
        if (res.error) throw new Error(res.error);
        return res.data?.[0];
      }

      const list = getLocalData("trains");
      const localId = `trn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const saved = { id: localId, _id: localId, ...record };
      list.push(saved);
      saveLocalData("trains", list);
      return saved;
    },

    async bulkUpsert(trains: any[]) {
      if (isSupabaseConfigured) {
        const rows = trains.map((t) => ({
          train_number: t.trainNumber || t.train_number,
          train_name: t.trainName || t.train_name,
          train_type: t.trainType || t.train_type,
          from_station: t.from || t.from_station,
          to_station: t.to || t.to_station,
          departure_time: t.departureTime || t.departure_time,
          arrival_time: t.arrivalTime || t.arrival_time,
          duration: t.duration,
          total_seats: Number(t.totalSeats || t.total_seats),
          available_seats: Number(t.availableSeats || t.totalSeats || 500),
          price: Number(t.price),
          date: t.date || new Date().toISOString().split("T")[0],
          runs_on: t.runsOn || "Daily",
          classes: t.classes || [],
          intermediate_stations: t.intermediateStations || [],
        }));

        const res = await supabaseRequest("trains?on_conflict=train_number", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates" },
          body: JSON.stringify(rows),
        });
        return res.data || [];
      }

      // Local storage bulk upsert
      const list = getLocalData("trains");
      const map = new Map();
      list.forEach((t) => map.set(t.trainNumber || t.train_number, t));
      trains.forEach((t) => {
        const num = t.trainNumber || t.train_number;
        const id = map.get(num)?.id || `trn_${num}`;
        map.set(num, { id, _id: id, ...t });
      });
      const updated = Array.from(map.values());
      saveLocalData("trains", updated);
      return updated;
    },

    async count() {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest("trains?select=count", {
          headers: { Prefer: "count=exact" },
        });
        return res.count || 0;
      }
      return getLocalData("trains").length;
    },

    async delete(id: string) {
      if (isSupabaseConfigured) {
        await supabaseRequest(`trains?id=eq.${id}`, { method: "DELETE" });
        return;
      }
      let list = getLocalData("trains");
      list = list.filter((t) => t.id !== id && t._id !== id);
      saveLocalData("trains", list);
    },
  },

  bookings: {
    async create(bookingData: any) {
      const record = {
        pnr: bookingData.pnr,
        user_id: bookingData.userId || bookingData.user_id,
        train_id: bookingData.trainId || bookingData.train_id,
        train_number: bookingData.trainNumber || bookingData.train_number,
        train_name: bookingData.trainName || bookingData.train_name,
        from_station: bookingData.from || bookingData.from_station,
        to_station: bookingData.to || bookingData.to_station,
        date: bookingData.date,
        class_type: bookingData.classType || bookingData.class_type,
        seats: bookingData.seats || [],
        passengers: bookingData.passengers || [],
        total_price: Number(bookingData.totalPrice || bookingData.total_price),
        status: bookingData.status || "Confirmed",
        payment_status: bookingData.paymentStatus || "Completed",
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const res = await supabaseRequest("bookings", {
          method: "POST",
          body: JSON.stringify(record),
        });
        if (res.error) throw new Error(res.error);
        return res.data?.[0];
      }

      const list = getLocalData("bookings");
      const localId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const saved = { id: localId, _id: localId, ...record };
      list.push(saved);
      saveLocalData("bookings", list);
      return saved;
    },

    async findByPnr(pnr: string) {
      const cleanPnr = pnr.trim();
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(`bookings?pnr=eq.${cleanPnr}&limit=1`);
        const b = res.data?.[0];
        if (!b) return null;
        return {
          ...b,
          _id: b.id,
          totalPrice: b.total_price,
          classType: b.class_type,
          train: {
            trainNumber: b.train_number,
            trainName: b.train_name,
            from: b.from_station,
            to: b.to_station,
          },
        };
      }
      const list = getLocalData("bookings");
      const found = list.find((b) => b.pnr === cleanPnr);
      if (!found) return null;
      return {
        ...found,
        _id: found.id || found._id,
        totalPrice: found.totalPrice || found.total_price,
        classType: found.classType || found.class_type,
        train: {
          trainNumber: found.train_number || found.trainNumber,
          trainName: found.train_name || found.trainName,
          from: found.from_station || found.from,
          to: found.to_station || found.to,
        },
      };
    },

    async findByUserId(userId: string) {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(
          `bookings?user_id=eq.${userId}&order=created_at.desc`
        );
        return (res.data || []).map((b: any) => ({
          ...b,
          _id: b.id,
          totalPrice: b.total_price,
          classType: b.class_type,
          train: {
            trainNumber: b.train_number,
            trainName: b.train_name,
            from: b.from_station,
            to: b.to_station,
          },
        }));
      }
      const list = getLocalData("bookings");
      return list
        .filter((b) => b.user_id === userId || b.userId === userId)
        .reverse()
        .map((b) => ({
          ...b,
          _id: b.id || b._id,
          totalPrice: b.totalPrice || b.total_price,
          classType: b.classType || b.class_type,
          train: {
            trainNumber: b.train_number || b.trainNumber,
            trainName: b.train_name || b.trainName,
            from: b.from_station || b.from,
            to: b.to_station || b.to,
          },
        }));
    },

    async findById(id: string) {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(`bookings?id=eq.${id}&limit=1`);
        return res.data?.[0] || null;
      }
      const list = getLocalData("bookings");
      return list.find((b) => b.id === id || b._id === id) || null;
    },

    async update(id: string, updates: any) {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(`bookings?id=eq.${id}`, {
          method: "PATCH",
          body: JSON.stringify(updates),
        });
        return res.data?.[0];
      }
      const list = getLocalData("bookings");
      const idx = list.findIndex((b) => b.id === id || b._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        saveLocalData("bookings", list);
        return list[idx];
      }
      return null;
    },

    async count() {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest("bookings?select=count", {
          headers: { Prefer: "count=exact" },
        });
        return res.count || 0;
      }
      return getLocalData("bookings").length;
    },

    async findRecent(limit = 5) {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest(
          `bookings?select=*&order=created_at.desc&limit=${limit}`
        );
        return (res.data || []).map((b: any) => ({
          ...b,
          _id: b.id,
          totalPrice: b.total_price,
          classType: b.class_type,
          train: {
            trainNumber: b.train_number,
            trainName: b.train_name,
          },
        }));
      }
      return getLocalData("bookings").slice(-limit).reverse();
    },
  },

  visits: {
    async track(page: string) {
      const record = { page, visited_at: new Date().toISOString() };
      if (isSupabaseConfigured) {
        await supabaseRequest("visits", {
          method: "POST",
          body: JSON.stringify(record),
        });
        return;
      }
      const list = getLocalData("visits");
      list.push(record);
      saveLocalData("visits", list);
    },

    async count() {
      if (isSupabaseConfigured) {
        const res = await supabaseRequest("visits?select=count", {
          headers: { Prefer: "count=exact" },
        });
        return res.count || 0;
      }
      return getLocalData("visits").length;
    },
  },
};
