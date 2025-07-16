import { getSession } from "@/lib/auth" // Assuming getSession is available
import { forbidden } from "next/navigation" // Import forbidden
import { redirect } from "next/navigation"
import EditArticleClientPage from "./EditArticleClientPage"

export const metadata = {
  title: "Edit Article",
  description: "Edit your blog article",
}

interface EditArticlePageProps {
  params: { slug: string }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const session = await getSession()

  // If no session, redirect to sign-in.
  // If session exists, but the user is not an admin, then forbid access.
  if (!session) {
    redirect("/auth/signin")
  }
  if (session.user?.role !== "admin") {
    forbidden() // [^2]
  }

  return <EditArticleClientPage params={params} />
}
