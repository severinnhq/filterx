"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [premiumUI, setPremiumUI] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Include the premiumUI value in the request body
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, premiumUI }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        throw new Error(textResponse || "An unexpected error occurred");
      }

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Automatically log the user in after signup
      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let loginData;
      const loginContentType = loginResponse.headers.get("content-type");
      if (loginContentType && loginContentType.includes("application/json")) {
        loginData = await loginResponse.json();
      } else {
        const textResponse = await loginResponse.text();
        throw new Error(textResponse || "Login after signup failed");
      }

      if (loginResponse.ok) {
        localStorage.setItem("token", loginData.token);
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container with a base padding of px-4,
    // and explicitly px-4 for screens below 520px (i.e. a bit more side padding).
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-4 px-4 max-[520px]:px-4 md:px-24">
      {/* Card container: default max-width is 400px on larger screens; on small screens it expands */}
      <div className="w-full max-w-[400px] max-[520px]:max-w-full overflow-visible">
        <Card className="w-full bg-white">
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
                className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 font-bold text-gray-800 bg-white border border-gray-800 rounded-full hover:bg-gray-100 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              {/* Checkbox and "watch me" text container */}
              <div className="relative flex items-center space-x-2 mt-4 group cursor-pointer pl-1 max-[520px]:pl-0 max-[520px]:justify-center">
                <input
                  type="checkbox"
                  checked={premiumUI}
                  onChange={(e) => setPremiumUI(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 underline">
                  Also watch me recreate this with my co-founder
                </span>
                {/* Hover image: default size is 48x48, reduced to 32x32 on screens under 520px */}
                <div className="absolute bottom-full right-0 mb-2 w-48 h-48 max-[520px]:w-32 max-[520px]:h-32 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100">
                  <Image
                    src="/lambo.png"
                    alt="Journey Image"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>
              </div>

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
    </div>
  );
}
