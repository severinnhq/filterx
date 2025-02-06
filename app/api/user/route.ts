import { type NextRequest, NextResponse } from "next/server"
import { getUserById, verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  const userId = verifyToken(token)
  if (!userId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  const result = await getUserById(userId)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json(result)
}

