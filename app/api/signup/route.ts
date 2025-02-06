// app/api/signup/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { MongoConnection, UserDocument } from "@/types/mongodb"

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
    const validatedData = userSchema.parse(body)
    const { email, password } = validatedData
    
    // Check if user exists with timeout
    const existingUser = await db.collection<UserDocument>("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }
    
    // Hash password (bcrypt is already naturally limited in time)
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    await db.collection<UserDocument>("users").insertOne({
      email,
      password: hashedPassword,
      status: "free",
      createdAt: new Date(),
    } as UserDocument)
    
    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
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