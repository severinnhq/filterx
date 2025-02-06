import { verifyToken } from "@/lib/auth"; // Ensure you define this function in your auth helper
import { connectToDatabase } from "@/lib/mongodb"; // Make sure this is set up correctly
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId to handle MongoDB _id

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return new Response("Unauthorized", { status: 401 });

  try {
    const userId = verifyToken(token); // Assuming this function is defined in your auth helper
    const { db } = await connectToDatabase(); // Ensure this returns the database connection
    if (!userId) throw new Error("Invalid user ID");
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) }); // Using ObjectId to ensure proper ID handling
    
    return NextResponse.json({ user: { status: user?.status || "not_paid" } });
  } catch (err) {
    console.error(err); // Log the error if needed
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
