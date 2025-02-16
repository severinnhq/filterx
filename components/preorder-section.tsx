import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PreorderSection() {
  return (
<section id="preorder-section" className="py-32 bg-white flex justify-center items-center">
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
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

          {/* Email Notification Section */}
          <div className="flex flex-col items-center space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-blue-600 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700 text-center">
              You'll be notified via email
              <br />
              when AI filtering launches!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}