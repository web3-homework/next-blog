"use client"

import { use } from "react"
import { redirect } from "next/navigation"
import EditArticleClientPage from "./EditArticleClientPage"
import { useSession } from "next-auth/react"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { data: session } = useSession()
  
  if (!session || session.user?.role !== "admin") {
    redirect("/auth/signin")
  }
  return <EditArticleClientPage params={params} />
}
