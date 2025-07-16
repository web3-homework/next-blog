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

  if (!session || session.user?.role !== "admin") {
    redirect("/auth/signin")
  }

  return <EditArticleClientPage params={params} />
}
