import { type NextRequest, NextResponse } from "next/server"
import { validateUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await validateUser(body)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  return NextResponse.json(result)
}

