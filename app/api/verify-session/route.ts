import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { updateUserStatus } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(req: NextRequest) {
  const { session_id } = await req.json()

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status === "paid") {
      // Update user status
      if (session.client_reference_id) {
        await updateUserStatus(session.client_reference_id, "preorder")
      }

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Payment not completed" })
    }
  } catch (error) {
    console.error("Error verifying session:", error)
    return NextResponse.json({ success: false, error: "Error verifying session" })
  }
}

