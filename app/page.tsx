"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "../components/header"
import { Button } from "@/components/ui/button"
import { Check, Clock, Mail  } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PreorderSection from "@/components/preorder-section"
import TweetDemo from "../components/TweetDemo"
import BasicSection from "@/components/basic"

export default function Page() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [userStatus, setUserStatus] = useState<string | null>(null)

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
  
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
  
      const data = await res.json()
  
      if (res.ok) {
        setMessage(data.message || 'Subscription successful!')
        setEmail('')
      } else {
        setMessage(data.message || 'Something went wrong.')
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      setMessage('An error occurred. Please try again.')
    }
  }



  const scrollToSection = (sectionId: string) => {
    console.log('Scrolling to:', sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      console.log('Section not found:', sectionId)
    }
  }

  useEffect(() => {
    setIsClient(true)
  
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.status) {
            setUserStatus(data.user.status)
          }
        })
        .catch(console.error)
    }
  }, [])

  const ComingSoonOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white/90">
      <div className="bg-white text-gray-900 text-lg font-bold py-2 px-6 rounded-full shadow-lg z-20 -rotate-12">
        Coming Soon
      </div>
    </div>
  )

  const PurchaseHandler = ({ 
    userStatus, 
    onScroll, 
    plan, 
    features, 
    paymentType = 'free',
    amount,
    className,
    children
  }: {
    userStatus: string | null
    onScroll: (section: string) => void
    plan: string
    features: string[]
    paymentType?: 'free' | 'custom'
    amount?: number
    className?: string
    children: React.ReactNode
  }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
  
    const handlePurchase = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
    
      try {
        if (!token) {
          localStorage.setItem("purchaseIntent", JSON.stringify({ plan, features }))
          router.push("/login")
          return
        }
    
        if (userStatus && userStatus !== "free") {
          if (userStatus === "basic") {
            onScroll('basic-section')
          } else if (userStatus === "preorder") {
            onScroll('preorder-section')
          }
          return
        }
    
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ plan, features, paymentType, amount }),
        })
    
        const data = await response.json()
    
        if (!response.ok) {
          if (data.error === "Invalid token") {
            localStorage.removeItem("token")
            localStorage.setItem("purchaseIntent", JSON.stringify({ plan, features }))
            router.push("/login")
            return
          }
          throw new Error(data.error || "Failed to process request")
        }
    
        if (data.success && data.status) {
          window.location.reload()
        } else if (data.url) {
          window.location.href = data.url
        }
      } catch (error) {
        console.error("Purchase error:", error)
        alert(`Error: ${error instanceof Error ? error.message : "Transaction failed"}`)
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Button
        onClick={handlePurchase}
        disabled={loading}
        className={className}
      >
        {loading ? "Processing..." : children}
      </Button>
    )
  }

  const extensionFeatures = [
    "Browser Extension Support",
    "Context-aware filtering",
    "1-minute no-code setup",
    "100% filtering rate"
  ]

  const bundleFeatures = [
    "Browser Extension Support",
    "Preorder AI Filtering ✨",
    "Context-aware filtering",
    "1-minute no-code setup",
    "100% filtering rate"
  ]
  if (!isClient) return null

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-grow font-sora">
        {/* Hero Section */}
        <section className="bg-white flex flex-col justify-between min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-0 flex flex-col lg:flex-row items-center justify-between flex-grow">
            <div className="lg:w-1/2 w-full max-w-[550px] mx-auto lg:mx-0 text-center lg:text-left mb-8 lg:mb-0">
              <div className="w-full">
                <h1 className="font-extrabold mb-6 text-gray-900 tracking-tight leading-tight">
                  <span className="block text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[2.5rem] xl:text-[2.75rem]">
                    Focus on your growth,
                  </span>
                  <span className="block text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[2.5rem] xl:text-[2.75rem]">
                    filter out all these
                  </span>
                  <span className="block text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[2.5rem] xl:text-[2.75rem]">
                    kinda shi...
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-700 mt-6 sm:mt-8 lg:mt-0">
                  Hide worthless tweets based on keywords
                  <br />
                  or your mood / thoughts.
                </p>
                
              <PurchaseHandler
  userStatus={userStatus}
  onScroll={scrollToSection}
  plan="bundle"
  features={bundleFeatures}
  paymentType="custom"
  className="bg-blue-600 text-white hover:bg-blue-700 text-lg py-6 px-8"
>
  Get FilterX
</PurchaseHandler>
              </div>
            </div>
            <div className="lg:w-1/2 w-full max-w-[500px] lg:max-w-[450px] mx-auto mt-6 lg:mt-0">
              <TweetDemo />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How FilterX Works</h2>
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* YouTube Video */}
              <div className="lg:w-1/2 w-full">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                  <iframe 
                    src="https://youtube.com/embed/_3y0WYN_B9U"
                    className="w-full h-full"
                    style={{ minHeight: "400px" }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="How FilterX Works Video"
                  ></iframe>
                </div>
              </div>

              {/* HowWorks Image */}
              <div className="lg:w-1/2 w-full">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                  <img 
                    src="/howworks.png" 
                    alt="How FilterX Works" 
                    className="w-full h-auto object-cover"
                    style={{ minHeight: "400px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

 
{/* Pricing/Status Section */}
{userStatus === "preorder" ? (
  <PreorderSection />
) : userStatus === "basic" ? (
  <BasicSection />
) : (
  <section id="pricing-section" className="py-20 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Launch Discount</h2>

      {/* Feature Number Legend */}
      <div className="flex flex-col items-center mb-12 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 px-4 sm:px-6 py-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">1</span>
              <div>
                <p className="font-medium text-sm">Context-aware</p>
                <p className="text-gray-500 text-xs">Detects context, more info in the FAQ</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-gray-200 mx-2" />
          <div className="flex items-center gap-1.5 mt-4 sm:mt-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">2</span>
            <div>
              <p className="font-medium text-sm">AI Filtering</p>
              <p className="text-gray-500 text-xs">Filter with prompts, more info in the FAQ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards Container */}
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto mt-4 pt-8">
        {/* Free Plan Card */}
        <div className="w-full lg:w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg overflow-visible flex flex-col mb-8 lg:mb-0">
          <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
            <div className="bg-green-500 text-white text-[10px] tracking-wider uppercase font-semibold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
              Free Forever
            </div>
          </div>
          <div className="p-8 flex flex-col h-full">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold text-gray-800">Free</span>
                </div>
              </div>
              <div className="mt-2 bg-green-50 rounded-lg p-2">
                <p className="text-xs text-green-600">
                  <span className="font-semibold">Filterx extension, all features for free (AI Filtering not included)</span>
                </p>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="flex items-center font-normal">
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" alt="Chrome" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" alt="Firefox" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" alt="Edge" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png" alt="Opera" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" alt="Safari" className="w-5 h-5" />
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-normal">
                    Context-aware filtering
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs">1</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-normal">1-minute no-code setup</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-normal">Filter out ANY word or expression</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto space-y-3">
              <PurchaseHandler
                userStatus={userStatus}
                onScroll={scrollToSection}
                plan="extension"
                features={extensionFeatures}
                paymentType="free"
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                Get FilterX
              </PurchaseHandler>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500">Free, but you can buy me a coffee☕</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Plan */}
        <div className="w-full lg:w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg overflow-visible outline outline-2 outline-blue-500 relative flex flex-col mb-8 lg:mb-0">
          <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
            <div className="bg-blue-500 text-white text-[10px] tracking-wider uppercase font-semibold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
              🔒 Lock your price
            </div>
          </div>
          <div className="p-8 flex flex-col h-full">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-lg font-semibold line-through text-gray-500 mr-2">$12.99</span>
                  <span className="text-4xl font-extrabold text-gray-800">$4.99</span>
                </div>
              </div>
              <div className="mt-2 bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-blue-600">
                  <span className="font-semibold">Save $8!</span> Price will increase to $12.99 when AI Filtering launches
                </p>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="flex items-center font-normal">
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" alt="Chrome" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" alt="Firefox" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" alt="Edge" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png" alt="Opera" className="w-5 h-5 mr-1" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" alt="Safari" className="w-5 h-5" />
                  </span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-normal">
                    Preorder AI Filtering ✨
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs">2</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-normal">
                    Context-aware filtering
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs">1</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-normal">1-minute no-code setup</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-normal">Filter out ANY word or expression</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              <PurchaseHandler
                userStatus={userStatus}
                onScroll={scrollToSection}
                plan="bundle"
                features={bundleFeatures}
                paymentType="custom"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Get Complete Bundle
              </PurchaseHandler>
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">One time payment, yours forever!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Plan */}
        <div className="w-full lg:w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col">
          <ComingSoonOverlay />
          <div className="p-8 flex flex-col h-full">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-4xl font-extrabold text-gray-700">$12.99</span>
                </div>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="flex items-center font-normal">
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png" alt="Chrome" className="w-5 h-5 mr-1 opacity-80" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png" alt="Firefox" className="w-5 h-5 mr-1 opacity-80" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png" alt="Edge" className="w-5 h-5 mr-1 opacity-80" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png" alt="Opera" className="w-5 h-5 mr-1 opacity-80" />
                    <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png" alt="Safari" className="w-5 h-5 opacity-80" />
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="font-normal text-gray-700">
                    AI Filtering ✨
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs">2</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="font-normal text-gray-700">
                    Context-aware filtering
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs">1</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="font-normal text-gray-700">1-minute no-code setup</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="font-normal text-gray-700">Filter out ANY word or expression</span>
                </li>
              </ul>
            </div>


            <div className="mt-auto">
              <Button disabled className="w-full bg-gray-300 text-gray-700 cursor-not-allowed hover:bg-gray-300">
                Coming Soon
              </Button>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-600">One time payment, yours forever!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)}

        {/* FAQ Section */}
        <section id="faq" className="py-40 bg-white-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Why do I charge money?</AccordionTrigger>
                <AccordionContent>
                Because this service doesn&apos;t just hide posts with unwanted keyword/s - it checks for context. If a post has context, it stays visible (even if it contains the keyword/s). 
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Why are the discounts?</AccordionTrigger>
                <AccordionContent>
                The discounts let you buy cheaper before launch. Get the basic plan for $2.99 here (it&apos;ll be $3.99 on the Chrome Web Store) and preorder AI filtering for $5, saving $7.99 before it rises to $12.99. Once released, purchases will only be available on the Chrome Web Store at full price.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What is AI filtering?</AccordionTrigger>
                <AccordionContent>
                AI filtering lets you describe the type of posts you don&apos;t want to see, rather than just entering unwanted words. I&apos;ve tested it, and it works pretty accurately. 
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What is context-aware filtering?</AccordionTrigger>
                <AccordionContent>
                It checks for context. If a post has context, it stays visible (even if it contains the keyword/s). 
                </AccordionContent>
              </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="FilterX Logo" 
                width={32} 
                height={32} 
                className="mr-2"
              />
              <span className="text-2xl font-bold text-white">FilterX</span>
            </Link>
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail size={16} />
              <a
                href="mailto:filterxhq@gmail.com"
                className="text-sm hover:text-white transition-colors"
              >
                filterxhq@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              {/* X Logo */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <a
                href="https://x.com/severinnHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                @severinnHQ
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-3">
              <div>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  How it works
                </button>
              </div>
              <div>
                <button
                  onClick={() => scrollToSection('pricing-section')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FilterX
                </button>
              </div>
              <div>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  FAQ
                </button>
              </div>
            </nav>
          </div>
          
          {/* Legal */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <nav className="space-y-3">
              <div>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </div>
            </nav>
          </div>
          
          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 text-center sm:text-left">
              I document the whole journey
            </h3>

            <div className="flex justify-center sm:justify-start">
              <div className="w-full max-w-[320px] xs:max-w-sm sm:max-w-md md:w-full px-2 sm:px-4 md:px-0 space-y-6">
                {/* Text and Image Container */}
                <div className="flex flex-row max-[400px]:flex-col max-[1215px]:flex-row min-[1024px]:flex-row items-center max-[400px]:items-center gap-5">
                  <div className="w-[55%] max-[400px]:w-full max-[1215px]:w-[55%] min-[1024px]:w-[55%] text-left max-[400px]:text-center">
                    <p className="text-gray-400 whitespace-pre-line leading-tight text-sm md:text-sm lg:text-sm">
                      Watch me recreate<br />
                      this with my co-founder.
                    </p>
                  </div>

                  <div className="w-[45%] max-[400px]:w-[80%] max-[1215px]:w-[45%] min-[1024px]:w-[45%] h-24 relative">
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <Image 
                        src="/lambo.png" 
                        alt="Lambo" 
                        fill
                        style={{ 
                          objectFit: 'contain',
                          borderRadius: '8px' 
                        }}
                        quality={100}
                        sizes="(max-width: 400px) 80vw, (max-width: 640px) 45vw, (max-width: 768px) 30vw, 20vw"
                      />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubscribe} className="w-full space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-[#5c4ba3] hover:bg-[#4c3d8a] rounded text-white transition-colors text-sm"
                  >
                    Subscribe
                  </button>
                  {message && (
                    <div className={`text-sm ${
                      message.includes('Success') || message.includes('already subscribed') 
                        ? 'text-red-400' 
                        : 'text-green-400'
                    }`}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FilterX. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  )
}