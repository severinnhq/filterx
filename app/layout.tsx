import "./globals.css"
import localFont from "next/font/local"
import { Sora } from "next/font/google"

const geist = localFont({
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

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  )
}

