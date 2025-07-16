"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders()
        setProviders(res)
      } catch (error) {
        console.error("Failed to fetch providers:", error)
      }
    }
    fetchProviders()
  }, [])

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Choose your preferred sign-in method</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {providers && Object.values(providers).length > 0 ? (
            Object.values(providers).map((provider: any) => (
              <Button
                key={provider.name}
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => signIn(provider.id, { callbackUrl })}
              >
                {provider.name === "Google" && <Mail className="mr-2 h-4 w-4" />}
                {provider.name === "GitHub" && <Github className="mr-2 h-4 w-4" />}
                Continue with {provider.name}
              </Button>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No authentication providers configured.</p>
              <p className="text-sm mt-2">Please set up OAuth providers in your environment variables.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
