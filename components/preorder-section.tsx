import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function PreorderSection() {
  return (
    <section id="preorder-section" className="py-24 bg-white flex justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl px-4">
        <div className="flex items-center justify-center mb-12">
          <h2 className="text-3xl font-bold font-geist flex items-center">
            Your
            <Image
              src="/logo.png"
              alt="FilterX Logo"
              width={40}
              height={40}
              className="ml-3 mr-1"
            />
            FilterX
          </h2>
        </div>
        <div className="flex justify-center">
          <Card className="!border-none !shadow-none w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center flex-grow px-8 py-6">
              <Button
                onClick={() =>
                  window.open(
                    "https://chromewebstore.google.com/detail/filterx/kegilgkpidbclopebioomgbgilahejgo?authuser=2&hl=en",
                    "_blank"
                  )
                }
                className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap text-lg px-10 py-5"
              >
                Filter out all that shi
              </Button>
              <p className="mt-4 text-sm text-gray-500 text-center">
                You can access your extension anytime, but only with this link!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}