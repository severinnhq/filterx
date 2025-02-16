import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { createDonation } from "@/lib/donations";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature")!;
  const body = await request.text();

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Received webhook event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Processing completed checkout:", {
        sessionId: session.id,
        amount: session.amount_total,
        plan: session.metadata?.plan,
        userId: session.client_reference_id
      });

      // Extract common data from the session
      const plan = session.metadata?.plan;
      const userIdRaw = session.client_reference_id || session.metadata?.userId;
      const userId = userIdRaw ? userIdRaw.toString().trim() : "";
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      if (!userId || !plan) {
        console.error("Missing userId or plan in session:", {
          userId,
          plan,
          sessionId: session.id
        });
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
      }

      // Handle donations
      if (plan === "donation") {
        try {
          const customerEmail = session.customer_details?.email || "";
          
          // Create donation record
          await createDonation({
            userId,
            email: customerEmail,
            amount,
            sessionId: session.id,
            status: 'completed',
            createdAt: new Date()
          });

          return NextResponse.json({ 
            received: true,
            updated: true,
            type: "donation",
            amount
          });
        } catch (error) {
          console.error("Donation creation error:", {
            error,
            userId,
            sessionId: session.id
          });
          return NextResponse.json(
            { error: "Failed to process donation" },
            { status: 500 }
          );
        }
      }

      // Handle other plans (bundle/extension)
      // Determine new status based on plan and payment
      let newStatus: string;
      switch (plan) {
        case "bundle":
          newStatus = "preorder";
          break;
        case "extension":
          newStatus = session.amount_total === 0 ? "basic" : "paid";
          break;
        default:
          console.error("Invalid plan type:", plan);
          return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
      }

      try {
        const { db } = await connectToDatabase();
        
        // Get current user status
        const currentUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        
        console.log("Current user state:", {
          userId,
          currentStatus: currentUser?.status,
          newStatus,
          plan
        });

        // Update user status
        const updateResult = await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              status: newStatus,
              lastPayment: new Date(),
              paymentAmount: amount,
              plan,
              lastUpdated: new Date(),
              stripeSessionId: session.id
            },
          }
        );

        console.log("Update result:", {
          userId,
          matchedCount: updateResult.matchedCount,
          modifiedCount: updateResult.modifiedCount,
          newStatus
        });

        if (updateResult.matchedCount === 0) {
          throw new Error(`User ${userId} not found`);
        }

        return NextResponse.json({ 
          received: true,
          updated: true,
          status: newStatus,
          type: plan
        });
      } catch (error) {
        console.error("Database update error:", {
          error,
          userId,
          plan,
          newStatus
        });
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    }

    // Handle other webhook events if needed
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" }, 
      { status: 400 }
    );
  }
}