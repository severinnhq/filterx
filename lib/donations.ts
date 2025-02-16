// lib/donations.ts
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

interface DonationData {
  userId: string;
  email: string;  // Added email field
  amount: number;
  sessionId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export async function createDonation(data: DonationData) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("donations").insertOne({
      ...data,
      userId: new ObjectId(data.userId),
    });
    return { donationId: result.insertedId };
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
}

export async function updateDonationStatus(sessionId: string, status: 'completed' | 'failed') {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("donations").updateOne(
      { sessionId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating donation status:", error);
    throw error;
  }
}