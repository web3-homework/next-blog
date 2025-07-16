"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail, Lock } from "lucide-react"
import { useSearchParams } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)
  const [password, setPassword] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

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

  const handlePasswordSignIn = async () => {
    const result = await signIn("credentials", {
      password,
      callbackUrl,
      redirect: false, // Prevent NextAuth.js from redirecting automatically
    })

    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Invalid password or unauthorized email.",
        variant: "destructive",
      })
    } else {
      // If successful, manually redirect
      window.location.href = callbackUrl
    }
    setIsPasswordDialogOpen(false)
    setPassword("") // Clear password field
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Choose your preferred sign-in method</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {providers && Object.values(providers).length > 0 ? (
            Object.values(providers).map((provider: any) => {
              // Exclude the 'credentials' provider from the direct buttons
              if (provider.id === "credentials") return null
              return (
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
              )
            })
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No authentication providers configured.</p>
              <p className="text-sm mt-2">Please set up OAuth providers in your environment variables.</p>
            </div>
          )}

          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Lock className="mr-2 h-4 w-4" />
                Sign in with Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sign in with Password</DialogTitle>
                <DialogDescription>Enter the secret password to gain admin access.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-3"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlePasswordSignIn()
                      }
                    }}
                  />
                </div>
              </div>
              <Button type="submit" onClick={handlePasswordSignIn}>
                Sign In
              </Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
