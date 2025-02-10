import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, updateUserEmail } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  console.log("Received Token:", token)

  if (!token) {
    return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
  }

  const userId = verifyToken(token)
  console.log("Verified UserId:", userId)

  if (!userId) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
  }

  const { email } = await req.json()
  console.log("Received Email:", email)

  try {
    await updateUserEmail(userId, email)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Route Handler Error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}