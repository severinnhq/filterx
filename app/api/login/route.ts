// app/api/login/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { MongoConnection, UserDocument } from "@/types/mongodb"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const maxDuration = 5 // Set max duration to 5 seconds
export const dynamic = 'force-dynamic' // Prevent static optimization

export async function POST(req: Request) {
  try {
    // Add timeout to the database connection
    const dbPromise = connectToDatabase()
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 4000)
    })

    const { db } = await Promise.race([dbPromise, timeoutPromise]) as MongoConnection
    
    const body = await req.json()
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData
    
    // Find user with timeout
    const user = await db.collection<UserDocument>("users").findOne({ email })
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
        { error: "Invalid input data" },
        { status: 400 }
      )
    }
    // Handle timeout error specifically
    if (error instanceof Error && error.message === 'Database connection timeout') {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again." },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}