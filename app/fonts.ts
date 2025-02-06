import { Inter, Sora } from "next/font/google"
import localFont from "next/font/local"

export const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
})

// Use Inter as a fallback for Geist
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

// Load Geist as a local font
export const geist = localFont({
  src: [
    {
      path: "../public/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist",
})

