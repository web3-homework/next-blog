import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { getSession } from "@/lib/auth" // Assuming getSession is available
import { redirect } from "next/navigation" // Use redirect from next/navigation
import { forbidden } from "next/navigation" // Import forbidden

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArticleActions } from "./article-actions"
import { mockArticles } from "@/app/articles/[slug]/page" // Using mock data for now

export const metadata = {
  title: "Admin Articles",
  description: "Manage your blog articles",
}

export default async function AdminArticlesPage() {
  const session = await getSession()

  // If no session, redirect to sign-in.
  // If session exists, but the user is not an admin (which should not happen
  // if ADMIN_EMAIL is set and login is enforced, but good for robustness),
  // then forbid access.
  if (!session) {
    redirect("/auth/signin")
  }
  // Since the login process now ensures that any logged-in user is an admin
  // (either via ADMIN_EMAIL or password login), we can simplify this check.
  // However, keeping the role check here adds an extra layer of security
  // if the session somehow gets an incorrect role.
  if (session.user?.role !== "admin") {
    forbidden() // [^2]
  }

  // In a real application, you would fetch articles from your database here
  // For now, we use mock data
  const articles = mockArticles

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article List</CardTitle>
          <CardDescription>Manage your blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading articles...</div>}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.slug}</TableCell>
                    <TableCell>
                      <Badge variant={article.published ? "default" : "secondary"}>
                        {article.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {article.tags?.map((tag) => (
                          <Badge key={tag.id} variant="outline">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ArticleActions article={article} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
