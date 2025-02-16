"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Download, Heart, Coffee } from "lucide-react";

const BasicSection = () => {
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDonation = async (amount: number) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }
  
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          plan: "donation",
          amount: amount
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }
  
      if (data.url) {
        // Use window.location.href to ensure full page reload
        window.location.href = data.url;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleCustomDonation = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 0.5) {
      alert("Please enter a valid amount (minimum $0.50)");
      return;
    }
    handleDonation(amount);
  };

  return (
    <section id="basic-section" className="py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to FilterX</h2>
            <p className="text-gray-600">You can now use the extension and optionally support me.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Download Card */}
{/* Download Section */}
<div className="p-6 flex flex-col items-center justify-center text-center">
  <div className="mb-4">
    <h3 className="text-xl font-semibold flex items-center gap-2 justify-center">
      <Download className="w-5 h-5" />
      Filter out all that shi
    </h3>
    <p className="text-gray-600 text-sm mt-1">Get started with FilterX extension</p>
  </div>
  <Button 
    onClick={() => window.open("https://chromewebstore.google.com/detail/filterx/kegilgkpidbclopebioomgbgilahejgo?authuser=2&hl=en", "_blank")}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    size="lg"
  >
    Filter out all that shi
  </Button>
</div>

            {/* Donation Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Support FilterX
                </h3>
                <p className="text-gray-600 text-sm mt-1">Help me improve and maintain FilterX</p>
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={() => handleDonation(1.99)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  size="lg"
                  disabled={isLoading}
                >
                  <Coffee className="w-5 h-5" />
                  {isLoading ? 'Processing...' : 'Buy me a coffee ($1.99)'}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or enter custom amount</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="Enter amount ($)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                  <Button 
                    onClick={handleCustomDonation}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Donate'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicSection;