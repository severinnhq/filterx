// header.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface HeaderProps {
  userStatus?: string | null;
}

export default function Header({ userStatus }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
    if (token) {
      fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.email) {
            setUserEmail(data.user.email)
          }
        })
        .catch((error) => console.error("Error fetching user email:", error))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setUserEmail("")
    router.push("/")
  }

  return (
    <header className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="FilterX Logo" width={32} height={32} className="mr-2" />
              <span className="text-2xl font-bold text-gray-900 font-geist">FilterX</span>
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                  How it works?
                </Link>
              </li>
              <li>
                <Link href="#pricing-section" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600">{userEmail}</span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => router.push("/login")}>
                Login
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="#how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it works?
            </Link>
            <Link
              href="#pricing-section"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              FAQ
            </Link>
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <p className="text-sm text-gray-600 px-3">{userEmail}</p>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

