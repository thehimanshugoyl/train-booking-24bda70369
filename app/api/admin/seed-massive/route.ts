import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { generateIndianTrainDocument } from "@/lib/indianRailwaysData";

export const maxDuration = 60; // Max allowable timeout on Next.js serverless

export async function GET(req: NextRequest) {
  return handleMassiveSeed(req);
}

export async function POST(req: NextRequest) {
  return handleMassiveSeed(req);
}

async function handleMassiveSeed(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetCount = Number(searchParams.get("target") || 25571);
    const batchSize = Number(searchParams.get("batchSize") || 3000);

    const currentCount = await db.trains.count();
    if (currentCount >= targetCount) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${currentCount} trains scheduled (Target: ${targetCount}).`,
        totalTrainsInDB: currentCount,
        targetCount,
        progress: 100,
        isComplete: true,
      });
    }

    const remainingToInsert = targetCount - currentCount;
    const countThisRun = Math.min(remainingToInsert, batchSize);

    const trainsBatch = [];
    const startIndex = currentCount;

    for (let i = 0; i < countThisRun; i++) {
      trainsBatch.push(generateIndianTrainDocument(startIndex + i));
    }

    await db.trains.bulkUpsert(trainsBatch);

    const newCount = await db.trains.count();
    const progress = Math.min(100, Math.round((newCount / targetCount) * 100));

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${countThisRun} Indian Railways trains! Current fleet: ${newCount} / ${targetCount}`,
      insertedInThisBatch: countThisRun,
      totalTrainsInDB: newCount,
      targetCount,
      progress,
      isComplete: newCount >= targetCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
