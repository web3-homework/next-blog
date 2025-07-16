import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth" // Import getServerSession
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || []

export const authOptions: NextAuthOptions = {
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
    
    CredentialsProvider({
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.NEXTAUTH_SECRET) {
          return {
            id: "password-admin", // A unique ID for this user
            email: process.env.ADMIN_EMAIL, // Use ADMIN_EMAIL if set, otherwise a default
            name: "Admin User",
            role: "admin", // Explicitly set role for this provider
          }
        }
        return null
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.email ? ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user' : 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.role) {
          session.user.role = token.role;
        }
      }
      return session;
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
