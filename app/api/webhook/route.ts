import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { updateUserStatus } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === "paid") {
      // Update user status
      if (session.client_reference_id) {
        try {
          await updateUserStatus(session.client_reference_id, "preorder")
          console.log(`User ${session.client_reference_id} status updated to preorder`)
        } catch (error) {
          console.error("Error updating user status:", error)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}

