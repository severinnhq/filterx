// app/thank-you/page.tsx
"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const amount = searchParams.get("amount")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You for Your Support!
          </h2>
          <p className="text-gray-600 mb-6">
            {amount 
              ? `Your generous donation of $${amount} helps us continue improving FilterX for everyone.`
              : "Your generous donation helps us continue improving FilterX for everyone."}
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ThankYouContent />
    </Suspense>
  )
}

function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  )
}