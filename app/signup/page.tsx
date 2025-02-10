// Signup Page
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const textResponse = await response.text()
        throw new Error(textResponse || "An unexpected error occurred")
      }

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let loginData
      const loginContentType = loginResponse.headers.get("content-type")
      if (loginContentType && loginContentType.includes("application/json")) {
        loginData = await loginResponse.json()
      } else {
        const textResponse = await loginResponse.text()
        throw new Error(textResponse || "Login after signup failed")
      }

      if (loginResponse.ok) {
        localStorage.setItem("token", loginData.token)
        router.push("/")
      } else {
        router.push("/login")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold flex items-center justify-center text-gray-900">
            <Link href="/">
              <Home size={32} className="text-gray-800 mr-2 cursor-pointer" />
            </Link>
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <button
  type="submit"
  disabled={loading}
  className="w-full px-4 py-2 font-bold text-gray-800 bg-white border border-gray-800 rounded-full hover:bg-gray-100 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Creating Account..." : "Sign Up"}
</button>
            <div className="text-center text-sm text-gray-800">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}