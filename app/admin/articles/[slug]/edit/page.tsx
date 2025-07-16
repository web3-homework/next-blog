import { getSession } from "@/lib/auth"
import { forbidden } from "next/navigation"
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
  if (!session) {
    redirect("/auth/signin")
  }
  // If session exists, but the user is not an admin, then forbid access.
  if (session.user?.role !== "admin") {
    forbidden() // [^2]
  }

  return <EditArticleClientPage params={params} />
}
