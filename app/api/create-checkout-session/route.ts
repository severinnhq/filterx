import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: "2024-12-18.acacia" as const,
});

// Only use dynamic export
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Validate stripe key
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe key not configured" },
      { status: 500 }
    );
  }

  try {
    // Validate request body
    const body = await request.json();
    if (!body || typeof body.plan !== 'string') {
      return NextResponse.json(
        { error: "Invalid request body - plan is required" },
        { status: 400 }
      );
    }

    const { plan } = body;

    // Get the authorization header
    const rawAuthHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    
    if (!rawAuthHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ensure that rawAuthHeader is a string and extract the token properly
    let token: string;
    if (typeof rawAuthHeader === 'string' && rawAuthHeader.startsWith('Bearer ')) {
      token = rawAuthHeader.substring(7);
    } else if (typeof rawAuthHeader === 'string') {
      token = rawAuthHeader;
    } else {
      return NextResponse.json(
        { error: "Invalid authorization header format" },
        { status: 401 }
      );
    }

    // Ensure that a token was extracted
    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is missing" },
        { status: 401 }
      );
    }

    // Verify the token. (Ensure that verifyToken also checks for undefined/null values.)
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

    // Get base URL with fallback
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
      metadata: {
        plan,
      },
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
