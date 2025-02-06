import { NextRequest, NextResponse } from "next/server"
import { validateUser } from "@/lib/auth"

export const POST = async function handler(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const body = await req.json()

    // Validate request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.email || !body.password || 
        typeof body.email !== 'string' || 
        typeof body.password !== 'string') {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const result = await validateUser(body)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}