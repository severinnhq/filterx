import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: "2024-12-18.acacia" as const,
});

export const dynamic = 'force-dynamic';

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
    const { plan, features } = body;

    const rawAuthHeader =
      (request.headers.get("authorization") ||
        request.headers.get("Authorization")) ?? "";

    if (rawAuthHeader === "") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let token: string;
    if (typeof rawAuthHeader === "string" && rawAuthHeader.startsWith("Bearer ")) {
      token = rawAuthHeader.substring(7);
    } else {
      token = rawAuthHeader;
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    let price: number;
    let productName: string;
    const productDescription: string = "Filter out tweets that do not serve your growth.";

    if (plan === "extension") {
      price = 299; // $2.99
      productName = "FilterX Extension";
    } else if (plan === "bundle") {
      price = 499; // $4.99
      productName = "Lifetime access to FilterX";
    } else {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://filterx.vercel.app/');

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      billing_address_collection: 'required',
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: productDescription,
              metadata: {
                features: JSON.stringify(features),
              },
            },
            unit_amount: price,
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
        features: JSON.stringify(features),
        userId,
      },
      custom_text: {
        submit: {
          message: "By completing this purchase, you agree to our terms of service and privacy policy.",
        },
      },
      phone_number_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      locale: 'auto',
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

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