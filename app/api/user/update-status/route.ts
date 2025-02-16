import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userId = verifyToken(token);
    
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 
          status: "basic",          // Set the status to "basic"
          lastUpdated: new Date(),
          plan: "extension"         // Indicate the selected plan
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
