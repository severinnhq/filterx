// app/api/create-checkout-session/route.ts
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";

// Initialize Stripe with your secret key (make sure it's set)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: "2024-12-18.acacia" as const,
});

// Force dynamic rendering (if required)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Ensure the Stripe key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe key not configured" },
      { status: 500 }
    );
  }

  try {
    // Parse and validate the request body
    const body = await request.json();
    if (!body || typeof body.plan !== 'string') {
      return NextResponse.json(
        { error: "Invalid request body - plan is required" },
        { status: 400 }
      );
    }
    const { plan } = body;

    // Retrieve the authorization header and default to an empty string if missing
    const rawAuthHeader =
      (request.headers.get("authorization") ||
        request.headers.get("Authorization")) ?? "";

    // If the header is an empty string, return an authentication error
    if (rawAuthHeader === "") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Safely extract the token
    let token: string;
    if (typeof rawAuthHeader === "string" && rawAuthHeader.startsWith("Bearer ")) {
      token = rawAuthHeader.substring(7);
    } else {
      token = rawAuthHeader;
    }

    // Verify the token
    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Determine the price based on the selected plan
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

    // Get the base URL (fallback to localhost)
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // Create the Stripe checkout session 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan === "extension" ? "FilterX Extension" : "FilterX Complete Bundle",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      client_reference_id: userId,
      metadata: { plan },
    });

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
