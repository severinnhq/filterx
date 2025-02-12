// app/api/user/route.ts
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      email: string
      status: string
    }

    return NextResponse.json({
      user: {
        email: decoded.email,
        status: decoded.status
      }
    })
  } catch {
    // Remove the error parameter since we're not using it
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}