import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    // Fetch fresh user data from database
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ 
      _id: new ObjectId(decoded.userId) 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        email: user.email,
        status: user.status  // This status will be used to determine which section to display
      }
    });
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
