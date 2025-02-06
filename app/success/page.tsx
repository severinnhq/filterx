"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const router = useRouter()
  const searchParams = useSearchParams()
  const session_id = searchParams.get("session_id")

  useEffect(() => {
    if (session_id) {
      // Verify the session and update user status
      fetch("/api/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("success")
          } else {
            setStatus("error")
          }
        })
        .catch(() => setStatus("error"))
    } else {
      setStatus("error")
    }
  }, [session_id])

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {status === "success" ? "Payment Successful!" : "Payment Error"}
      </h1>
      {status === "success" ? (
        <>
          <p className="text-lg mb-6 text-center">
            Thank you for your purchase. Your FilterX bundle will be available soon.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => router.push("/")} className="bg-blue-600 text-white">
              Return to Home
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg mb-6 text-center">
            There was an error processing your payment. Please try again or contact support.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => router.push("/")} className="bg-blue-600 text-white">
              Return to Home
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

