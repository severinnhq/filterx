// app/success/page.tsx
import { Suspense } from "react"
import { redirect } from "next/navigation"
import Stripe from "stripe"
import { SuccessContent, Loading } from "./components/success-content"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-12-18.acacia",
})

// Server component to validate the session
async function ValidateSession({ 
  sessionId 
}: { 
  sessionId: string 
}) {
  try {
    if (!sessionId) {
      redirect('/')
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status !== 'paid') {
      redirect('/')
    }

    return <SuccessContent plan={session.metadata?.plan} />
  } catch (error) {
    console.error('Error validating session:', error)
    redirect('/')
  }
}

// Main page component (Server Component)
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const sessionId = searchParams.session_id as string

  if (!sessionId) {
    redirect('/')
  }

  return (
    <Suspense fallback={<Loading />}>
      <ValidateSession sessionId={sessionId} />
    </Suspense>
  )
}