"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/header"
import { Button } from "@/components/ui/button"
import { Check, Play, Clock } from "lucide-react" // Removed unused icons
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PreorderSection from "@/components/preorder-section"
import TweetDemo from "../components/TweetDemo"

const ComingSoonOverlay = () => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
  >
    <div className="bg-white text-gray-900 text-lg font-bold py-2 px-6 rounded-full shadow-lg z-20 -rotate-12">
      Coming Soon
    </div>
  </div>
)
export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [userStatus, setUserStatus] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user.status) {
            setUserStatus(data.user.status)
            console.log("User status:", data.user.status)
          }
        })
        .catch((error) => console.error("Error fetching user data:", error))
    }
  }, [])

  const handlePurchase = async (plan: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create checkout session")
        }

        const { url } = await response.json()
        if (url) {
          window.location.href = url
        } else {
          throw new Error("Invalid response from server")
        }
      } catch (error: unknown) {
        console.error("Error:", error)
        const message = error instanceof Error ? error.message : "An unknown error occurred"
        alert(`An error occurred: ${message}. Please try again later.`)
      }
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-grow font-sora">
        {/* Hero Section */}
        <section className="bg-white flex items-center pt-16 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="lg:w-1/2 w-full max-w-[650px] mx-auto lg:mx-0 text-center lg:text-left pt-8 sm:pt-12 md:pt-16 lg:pt-0">
            <div className="w-full">
            <h1 className="font-bold mb-6 text-gray-900 tracking-wide leading-tight">
      <span className="block text-[2.25rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[2.75rem] xl:text-[3rem] mb-1">
        Focus on your growth,
      </span>
      <span className="block text-[2.25rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[2.75rem] xl:text-[3rem]">
        filter out this shi...
      </span>
    </h1>
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-700">
                Experience a straightforward approach to social media interactions with FilterX.
              </p>
              <Button
                size="lg"
                className="bg-blue-600 text-white"
                onClick={() => {
                  const token = localStorage.getItem("token")
                  if (!token) {
                    router.push("/login")
                  }
                }}
              >
                Get FilterX
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 w-full max-w-[500px] lg:max-w-[450px] mx-auto">
            <TweetDemo />
          </div>
        </div>
      </div>
    </section>
        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How FilterX Works</h2>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="lg:w-1/2 w-full">
                <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium">
                    How FilterX Works
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="text-xl font-semibold mb-4">v0.1 Filtered Words</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="font-medium">Let&aposs connect</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="font-medium">Let&aposs Connect</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="font-medium">Lets connect</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="font-medium">Lets Connect</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h5 className="text-lg font-semibold mb-2">Creative Alternative</h5>
                    <div className="bg-blue-100 p-4 rounded-lg text-center">
                      <p className="text-xl font-bold text-blue-600">🤝 Let&aposs Collaborate!</p>
                      <p className="text-sm text-blue-500 mt-2">
                        Building meaningful connections, one interaction at a time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing or Download Section */}
        {userStatus === "preorder" ? (
          <PreorderSection />
        ) : userStatus === "onlyextension" ? (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Download FilterX Extension</h2>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    window.open("https://chrome.google.com/webstore/detail/filterx/your-extension-id", "_blank")
                  }}
                  className="bg-blue-600 text-white"
                  size="lg"
                >
                  Download Extension
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Launch Discount</h2>
        
            {/* Feature Number Legend */}
            <div className="flex flex-col items-center mb-12 space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">1</span>
                    <div>
                      <p className="font-medium text-sm">Context-aware</p>
                      <p className="text-gray-500 text-xs">Detects content, more info in the FAQ</p>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200 mx-2" />
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">2</span>
                  <div>
                    <p className="font-medium text-sm">AI Filtering</p>
                    <p className="text-gray-500 text-xs">Filter with prompts, more info in the FAQ</p>
                  </div>
                </div>
              </div>
            </div>
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto mt-4 pt-8">
      {/* Extension Only Plan */}
      <div className="w-full md:w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg overflow-visible flex flex-col">
        <div className="p-8 flex flex-col h-full">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-gray-800">$2.99</span>
              </div>
            </div>
            <div className="mt-2 bg-blue-50 rounded-lg p-2">
              <p className="text-xs text-blue-600">
                <span className="font-semibold">Save $1!</span> Price will be $3.99 on Chrome Web Store
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
                <span className="font-normal">100% filtering rate</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto">
            <Button onClick={() => handlePurchase("extension")} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Get Extension Access
            </Button>
            <div className="mt-2 text-center">
              <span className="text-sm text-gray-500">One time payment, yours forever!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Plan */}
      <div className="w-full md:w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg overflow-visible outline outline-2 outline-blue-500 relative flex flex-col">
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
                <span className="font-normal">100% filtering rate</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto">
            <Button onClick={() => handlePurchase("bundle")} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Get Complete Bundle
            </Button>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">One time payment, yours forever!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Plan */}
      <div className="w-full md:w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col">
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
                <span className="font-normal text-gray-700">100% filtering rate</span>
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
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-5">
      <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
      <AccordionContent>
        While we don&apos;t currently offer a free trial, we do have a satisfaction guarantee. 
        If you&apos;re not happy with FilterX within the first 30 days of purchase, 
        we&apos;ll provide a full refund.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-5">
      <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
      <AccordionContent>
        While we don&apos;t currently offer a free trial, we do have a satisfaction guarantee. 
        If you&apos;re not happy with FilterX within the first 30 days of purchase, 
        we&apos;ll provide a full refund.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-5">
      <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
      <AccordionContent>
        While we don&apos;t currently offer a free trial, we do have a satisfaction guarantee. 
        If you&apos;re not happy with FilterX within the first 30 days of purchase, 
        we&apos;ll provide a full refund.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-5">
      <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
      <AccordionContent>
        While we don&apos;t currently offer a free trial, we do have a satisfaction guarantee. 
        If you&apos;re not happy with FilterX within the first 30 days of purchase, 
        we&apos;ll provide a full refund.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-5">
      <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
      <AccordionContent>
        While we don&apos;t currently offer a free trial, we do have a satisfaction guarantee. 
        If you&apos;re not happy with FilterX within the first 30 days of purchase, 
        we&apos;ll provide a full refund.
      </AccordionContent>
    </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2023 FilterX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

