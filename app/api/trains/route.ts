import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { INDIAN_STATIONS, generateIndianTrainDocument } from "@/lib/indianRailwaysData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // Return unique station list for autocomplete dropdowns
    if (action === "stations") {
      const stationNamesFromData = INDIAN_STATIONS.map((s) => s.name);
      const stationCitiesFromData = INDIAN_STATIONS.map((s) => s.city);

      const uniqueSet = new Set<string>([
        ...stationNamesFromData,
        ...stationCitiesFromData,
      ]);

      const sortedStations = Array.from(uniqueSet).filter(Boolean).sort();
      return NextResponse.json({ stations: sortedStations });
    }

    const from = searchParams.get("from")?.trim();
    const to = searchParams.get("to")?.trim();
    const date = searchParams.get("date")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(10, Number(searchParams.get("limit") || 50)));

    // Check if trains exist in db
    const totalCount = await db.trains.count();
    if (totalCount === 0) {
      // Auto seed first 100 Indian high-speed routes so search immediately works!
      const initialBatch = [];
      for (let i = 0; i < 100; i++) {
        initialBatch.push(generateIndianTrainDocument(i));
      }
      await db.trains.bulkUpsert(initialBatch);
    }

    const { trains, totalMatching } = await db.trains.search({
      from,
      to,
      date,
      limit,
      page,
    });

    return NextResponse.json({
      trains,
      total: totalMatching,
      page,
      totalPages: Math.ceil(totalMatching / limit),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}