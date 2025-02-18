// app/api/signup/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { z } from "zod"
import type { UserDocument } from "@/types/mongodb"
import { Db } from "mongodb"

// Define MongoConnection locally since it's not exported from "@/types/mongodb"
type MongoConnection = { db: Db }

// Define a new type for inserting a user (without the _id)
interface NewUser extends Omit<UserDocument, "_id"> {
  premiumUI: boolean
}

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  premiumUI: z.boolean().optional(), // New: Capture checkbox state (optional)
})

export const maxDuration = 5
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // Timeout for database connection
    const dbPromise = connectToDatabase()
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 4000)
    })

    // Use our locally defined MongoConnection type
    const { db } = await Promise.race([dbPromise, timeoutPromise]) as MongoConnection

    const body = await req.json()
    const validatedData = userSchema.parse(body)
    const { email, password, premiumUI } = validatedData

    // Check if user exists
    const existingUser = await db.collection<UserDocument>("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: NewUser = {
      email,
      password: hashedPassword,
      status: "free",
      premiumUI: premiumUI ?? true, // Default to true if not provided
      createdAt: new Date(),
    }

    await db.collection<NewUser>("users").insertOne(newUser)

    // If premiumUI is enabled, add the email to the emaillist
    if (newUser.premiumUI) {
      const existingSubscription = await db
        .collection("emaillist")
        .findOne({ email: newUser.email })

      if (!existingSubscription) {
        await db.collection("emaillist").insertOne({
          email: newUser.email,
          source: "signup",
          project: "filterx",
          subscribedAt: new Date(),
        })
      }
    }

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error("Signup error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    } else {
      console.error("Unknown signup error type:", error)
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === "Database connection timeout") {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again." },
        { status: 503 }
      )
    }

    if (
      error instanceof Error &&
      (error.message.includes("MongoServerError") ||
        error.message.includes("MongoError") ||
        error.message.includes("connect"))
    ) {
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
