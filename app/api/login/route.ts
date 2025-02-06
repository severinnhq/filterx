// app/api/login/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    const { email, password } = validatedData
    
    const { db } = await connectToDatabase()
    
    // Find user
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        status: user.status
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )
    
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Login error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}