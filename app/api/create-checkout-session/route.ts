import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: "2024-12-18.acacia" as const,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    if (!body || typeof body.plan !== 'string') {
      return NextResponse.json(
        { error: "Invalid request body - plan is required" },
        { status: 400 }
      );
    }

    const { plan, features, paymentType, amount } = body;

    // Authentication validation
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userId = verifyToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get the base URL for success/cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_URL || 
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://filterx.vercel.app");

    // Handle free extension plan
    if (plan === "extension" && paymentType === 'free') {
      try {
        const { db } = await connectToDatabase();

        const result = await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          { 
            $set: { 
              status: "basic",
              plan: "extension",
              lastUpdated: new Date(),
            }
          }
        );

        if (result.matchedCount === 0) {
          throw new Error("User not found");
        }

        return NextResponse.json({ 
          success: true,
          status: "basic",
          message: "Status updated successfully"
        });
      } catch (error) {
        console.error("Database update error:", error);
        return NextResponse.json(
          { error: "Failed to update user status" },
          { status: 500 }
        );
      }
    }

    // Handle bundle plan
    if (plan === "bundle") {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "required",
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "FilterX AI Bundle",
              description: "Preorder AI Filtering + Extension Access",
            },
            unit_amount: 499,
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/`,
        client_reference_id: userId,
        metadata: {
          plan: "bundle",
          features: JSON.stringify(features),
          userId,
        },
        custom_text: {
          submit: {
            message: "Continue to FilterX",
          },
        },
      };

      const session = await stripe.checkout.sessions.create(sessionParams);
      return NextResponse.json({ url: session.url });
    }

    if (plan === "donation" && amount) {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "required",
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "FilterX Donation",
              description: "Support FilterX development",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}&amount=${amount}`,
        cancel_url: `${baseUrl}/`,
        client_reference_id: userId,
        metadata: {
          plan: "donation",
          amount: amount.toString(),
          userId,
        },
        custom_text: {
          submit: {
            message: "Thank you for your support!",
          },
        },
      };
    
      const session = await stripe.checkout.sessions.create(sessionParams);
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Invalid plan selected" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
