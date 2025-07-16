import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth" // Import getServerSession
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

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

    // Credentials Provider for password login
    CredentialsProvider({
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if the provided password matches NEXTAUTH_SECRET
        if (credentials?.password === process.env.NEXTAUTH_SECRET) {
          // Return a user object. The email here is important if ADMIN_EMAIL is set,
          // as the signIn callback will check it.
          return {
            id: "password-admin", // A unique ID for this user
            email: process.env.ADMIN_EMAIL || "admin@example.com", // Use ADMIN_EMAIL if set, otherwise a default
            name: "Admin User",
            role: "admin", // Explicitly set role for this provider
          }
        }
        // If password does not match, return null
        return null
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      // If ADMIN_EMAIL is set, only allow sign-in if the user's email matches it.
      // This applies to all providers, including the CredentialsProvider.
      if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
        return false
      }
      // Otherwise, allow sign-in
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // If the user successfully signed in (meaning their email matched ADMIN_EMAIL
        // or they used the correct password), implicitly set their role to 'admin'.
        // The 'user' object from CredentialsProvider will already have role: 'admin'.
        token.role = (user as any).role || "admin"
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
