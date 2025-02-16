import { MongoClient, ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const uri = process.env.MONGODB_URI
const clientPromise = new MongoClient(uri!).connect()
const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables")
}

export async function createUser(body: { email: string; password: string }) {
  const { email, password } = body
  const client = await clientPromise
  const db = client.db("filterx")
  const existingUser = await db.collection("users").findOne({ email })
  
  if (existingUser) {
    return { error: "User already exists" }
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    status: "free",
  })
  
  return { userId: result.insertedId }
}

export async function validateUser(body: { email: string; password: string }) {
  const { email, password } = body
  const client = await clientPromise
  const db = client.db("filterx")
  const user = await db.collection("users").findOne({ email })
  
  if (!user) {
    return { error: "Invalid credentials" }
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return { error: "Invalid credentials" }
  }
  
  const token = jwt.sign(
    { 
      userId: user._id.toString(), // Convert the ObjectId to a string
      email: user.email, 
      status: user.status 
    }, 
    JWT_SECRET, 
    { expiresIn: "1d" }
  );
  return { token, user: { id: user._id, email: user.email, status: user.status } }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

export async function getUserById(userId: string) {
  const client = await clientPromise
  const db = client.db("filterx")
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  
  if (!user) {
    return { error: "User not found" }
  }
  
  return { user: { id: user._id, email: user.email, status: user.status } }
}

export async function updateUserStatus(userId: string, status: string) {
  const client = await clientPromise;
  const db = client.db("filterx");
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { status: status } }
  );
  
  if (result.matchedCount === 0) {
    throw new Error("User not found");
  }
  
  return { message: "User status updated successfully" };
}

export async function updateUserEmail(userId: string, email: string) {
  try {
    const client = await clientPromise
    const db = client.db("filterx")
   
    // Validate email
    if (!email || !email.includes('@')) {
      throw new Error("Invalid email format")
    }
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { email: email } }
    )
    console.log("Update Result:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    })
    if (result.matchedCount === 0) {
      throw new Error("User not found")
    }
    return { message: "User email updated successfully" }
  } catch (error) {
    console.error("Detailed updateUserEmail Error:", {
      message: error instanceof Error ? error.message : String(error),
      userId,
      email
    })
    throw error
  }
}