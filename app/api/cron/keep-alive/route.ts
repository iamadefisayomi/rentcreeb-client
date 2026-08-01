// app/api/cron/keep-alive/route.ts
import { dbConnection } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
    
  if (authHeader !== `Bearer ${process.env.CRON_JOB_TOKEN}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnection();
    // Optional: a small query to ensure the DB is actually awake
    const mongoose = await import("mongoose");
    const isConnected = mongoose.connection.readyState === 1;

    return NextResponse.json({
      success: true,
      database: isConnected ? "Online" : "Connecting" 
    })

  } catch (error) {
    return NextResponse.json({ success: false, error: "DB Connect Failed" }, { status: 500 });
  }
}