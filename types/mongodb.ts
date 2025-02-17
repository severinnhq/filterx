// /types/mongodb.ts
import { Db, ObjectId } from "mongodb"

export interface UserDocument {
  _id: ObjectId
  email: string
  password: string
  status: "free" | "premium"
  premiumUI: boolean
  createdAt: Date
}

export interface MongoConnection {
  db: Db
}
