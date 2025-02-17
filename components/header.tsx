"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userStatus, setUserStatus] = useState<string | null>(null)
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
          if (data.user && data.user.status) {
            setUserStatus(data.user.status)
          }
        })
        .catch((error) => console.error("Error fetching user data:", error))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setUserEmail("")
    setUserStatus(null)
    router.push("/")
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const renderNavigationItem = (text: string, sectionId: string) => {
    if (text === "Pricing" && (userStatus === "preorder" || userStatus === "basic")) {
      return (
        <li>
          <button
            onClick={() => scrollToSection("preorder-section")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            FilterX
          </button>
        </li>
      )
    }

    return (
      <li>
        <button
          onClick={() => scrollToSection(sectionId)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {text}
        </button>
      </li>
    )
  }

  const renderMobileNavigationItem = (text: string, sectionId: string) => {
    if (text === "Pricing" && (userStatus === "preorder" || userStatus === "basic")) {
      return (
        <button
          onClick={() => scrollToSection("preorder-section")}
          className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
        >
          FilterX
        </button>
      )
    }

    return (
      <button
        onClick={() => scrollToSection(sectionId)}
        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
      >
        {text}
      </button>
    )
  }

  return (
    <header className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="FilterX Logo" width={32} height={32} className="mr-2" />
            <span className="text-2xl font-bold text-gray-900 font-geist">FilterX</span>
          </Link>

          {/* Center section - Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-4">
              {renderNavigationItem("How it works?", "how-it-works")}
              {renderNavigationItem("Pricing", "pricing-section")}
              {renderNavigationItem("FAQ", "faq")}
            </ul>
          </nav>

          {/* Right section - Auth */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">{userEmail}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Login
                </Button>
              )}
            </div>
            <div className="md:hidden ml-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderMobileNavigationItem("How it works?", "how-it-works")}
            {renderMobileNavigationItem("Pricing", "pricing-section")}
            {renderMobileNavigationItem("FAQ", "faq")}
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <p className="text-sm text-gray-600 px-3 truncate">{userEmail}</p>
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