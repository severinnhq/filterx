import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongodb"; // Ensure MongoDB connection is correctly imported
import { ObjectId } from "mongodb"; // Import ObjectId to properly handle MongoDB _id

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature")!;
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const { db } = await connectToDatabase(); // Connect to your xfilter DB
      const users = db.collection("users");

      const userId = session.client_reference_id;
      const plan = session.metadata?.plan;

      if (!userId || !plan) return;

      let status = "not_paid";
      if (plan === "extension") status = "basic";
      if (plan === "bundle") status = "preorder";

      // Make sure userId is converted to ObjectId here for the MongoDB query
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { status } }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
