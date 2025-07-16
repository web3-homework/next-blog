import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key",

  providers: [
    // 只有在环境变量存在时才添加提供商
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

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
      // Only allow sign-in if the user's email matches the ADMIN_EMAIL environment variable
      if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
        return true
      }
      // Deny sign-in for any other email
      return false
    },
    async jwt({ token, user }) {
      if (user) {
        // If the user successfully signed in (meaning their email matched ADMIN_EMAIL),
        // we can implicitly set their role to 'admin' in the token.
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
    error: "/auth/error", // 👈 新增，让错误跳转到友好的页面
  },
}
