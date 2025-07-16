import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",

  providers: [
    // Google Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // GitHub Provider
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      // If ADMIN_EMAIL is set, only allow sign-in if the user's email matches it.
      if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
        return false
      }
      // Otherwise, allow sign-in
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // If the user successfully signed in (meaning their email matched ADMIN_EMAIL),
        // implicitly set their role to 'admin'.
        token.role = "admin"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ""
        // Assign the role from the token (which will be 'admin' if signIn was successful)
        session.user.role = (token.role as string) || "user"
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}

// Helper function to get session on the server
export async function getSession() {
  return await getServerSession(authOptions)
}
