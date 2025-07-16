"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react" 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react"

export function Header() {
  const { data: session, status } = useSession() 

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          My Blog
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/articles" className="text-sm font-medium hover:underline">
            Articles
          </Link>
          <Link href="/tags" className="text-sm font-medium hover:underline">
            Tags
          </Link>
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {/* Conditionally render Admin Dashboard link based on role */}
                {session.user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/articles">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
