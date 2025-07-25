import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Providers } from "@/components/providers"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Personal Blog",
  description: "A modern blog built with Next.js, Supabase, and NextAuth.js",
  keywords: ["blog", "Next.js", "React", "TypeScript", "Web Development"],
  authors: [{ name: "Jason.Zhang" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "My Personal Blog",
    description: "A modern blog built with Next.js, Supabase, and NextAuth.js",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script defer src="https://umami-five-iota.vercel.app/script.js" data-website-id="4bde982b-4a1d-4dfc-86c2-82119b34e1ad"></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="min-h-screen bg-background">
              <Header />
              <main>{children}</main>
            </div>
          </Providers>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
