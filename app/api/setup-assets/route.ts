import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const source1 = "C:\\Users\\himan\\.gemini\\antigravity\\brain\\eb044c51-70ed-465f-b3c7-3eb314ac7626\\train_hero_bg_1791541846747.jpg";
    const source2 = "C:\\Users\\himan\\.gemini\\antigravity\\brain\\eb044c51-70ed-465f-b3c7-3eb314ac7626\\railway_station_bg_1791541869553.jpg";
    const sourceLogo = "C:\\Users\\himan\\.gemini\\antigravity\\brain\\eb044c51-70ed-465f-b3c7-3eb314ac7626\\.user_uploaded\\media_1791540195181_d9fec51c.png";

    if (fs.existsSync(source1)) {
      fs.copyFileSync(source1, path.join(publicDir, "train_hero_bg.jpg"));
    }
    if (fs.existsSync(source2)) {
      fs.copyFileSync(source2, path.join(publicDir, "railway_station_bg.jpg"));
    }
    if (fs.existsSync(sourceLogo)) {
      fs.copyFileSync(sourceLogo, path.join(publicDir, "gaddvya_logo.png"));
    }

    return NextResponse.json({
      success: true,
      message: "Assets copied to /public successfully!",
      files: ["/train_hero_bg.jpg", "/railway_station_bg.jpg", "/gaddvya_logo.png"],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
