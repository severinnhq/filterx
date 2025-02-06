import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate request body
    const body = await req.json();
    if (!body || typeof body.plan !== 'string') {
      return NextResponse.json(
        { error: "Invalid request body - plan is required" },
        { status: 400 }
      );
    }

    const { plan } = body;

    // Safely extract the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || typeof authHeader !== 'string') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Safely extract the token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return NextResponse.json(
        { error: "Invalid authorization format" },
        { status: 401 }
      );
    }

    const token = parts[1];
    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Validate plan and set price
    let price: number;
    if (plan === "extension") {
      price = 299;
    } else if (plan === "bundle") {
      price = 599;
    } else {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_URL) {
      throw new Error("NEXT_PUBLIC_URL environment variable is not set");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan === "extension" ? "FilterX Extension" : "FilterX Complete Bundle",
            },
            unit_amount: price * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
      client_reference_id: userId,
      metadata: {
        plan,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe checkout session");
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}