import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { plan }: { plan: string } = await req.json();
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new Error("Authentication required");
    }

    const userId = verifyToken(token);
    if (!userId) {
      throw new Error("Invalid token");
    }

    let price: number;
    if (plan === "extension") {
      price = 299;
    } else if (plan === "bundle") {
      price = 599;
    } else {
      throw new Error("Invalid plan selected");
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

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Stripe error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
