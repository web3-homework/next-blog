"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2, Loader2, Ban } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminArticlesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/articles")
      if (!res.ok) {
        throw new Error(`Failed to fetch articles: ${res.statusText}`)
      }
      const data = await res.json()
      setArticles(data.articles)
    } catch (err: any) {
      setError(err.message || "Failed to load articles.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading") return

    // Simplified check: if there's no session, redirect to sign-in.
    // The `signIn` callback in `lib/auth.ts` now enforces who can log in.
    if (!session) {
      router.push("/auth/signin?callbackUrl=/admin/articles")
      return
    }

    fetchArticles()
  }, [session, status, router])

  const handleDelete = async (slug: string) => {
    setDeletingId(slug)
    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error(`Failed to delete article: ${res.statusText}`)
      }

      setArticles((prev) => prev.filter((article) => article.slug !== slug))
    } catch (err: any) {
      setError(err.message || "Failed to delete article.")
    } finally {
      setDeletingId(null)
    }
  }

  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto h-96 bg-muted animate-pulse rounded-lg shadow-custom-md" />
      </div>
    )
  }

  // If there's no session after loading, it means the user is not the allowed admin.
  if (!session) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <Ban className="h-6 w-6" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view this page. Please sign in with the authorized account.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto shadow-custom-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Articles</CardTitle>
          <Button asChild className="shadow-custom-sm hover:shadow-custom-md">
            <Link href="/admin/articles/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No articles found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        <Link href={`/articles/${article.slug}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={article.published ? "default" : "secondary"}>
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {article.tags?.map((tag: any) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/articles/${article.slug}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={deletingId === article.slug}>
                                {deletingId === article.slug ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your article &quot;
                                  {article.title}&quot; and remove its data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(article.slug)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
