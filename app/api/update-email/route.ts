import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, updateUserEmail } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
  }

  const userId = verifyToken(token)
  if (!userId) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
  }

  const { email } = await req.json()

  try {
    await updateUserEmail(userId, email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating email:", error)
    return NextResponse.json({ success: false, error: "Failed to update email" }, { status: 500 })
  }
}

