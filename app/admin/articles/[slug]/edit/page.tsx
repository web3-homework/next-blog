"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MarkdownEditor } from "@/components/markdown-editor"
import { X, Ban } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 模拟标签数据 (与 app/admin/articles/new/page.tsx 保持一致)
const mockTags = [
  { id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6", created_at: new Date().toISOString() },
  { id: "2", name: "Next.js", slug: "nextjs", color: "#000000", created_at: new Date().toISOString() },
  { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4", created_at: new Date().toISOString() },
  { id: "4", name: "React", slug: "react", color: "#61DAFB", created_at: new Date().toISOString() },
  { id: "5", name: "TypeScript", slug: "typescript", color: "#3178C6", created_at: new Date().toISOString() },
]

// 模拟文章数据 (与 app/api/articles/route.ts 保持一致)
const mockArticles = [
  {
    id: "1",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    content: "# Welcome\n\nThis is your first blog post!",
    excerpt: "Welcome to my personal blog where I share thoughts and tutorials.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [{ id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Getting Started with Next.js",
    slug: "getting-started-nextjs",
    content: "# Getting Started\n\nNext.js is a powerful React framework...",
    excerpt: "Learn the basics of Next.js and how to build modern web applications.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "2", name: "Next.js", slug: "nextjs", color: "#000000" },
      { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4" },
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

interface EditArticlePageProps {
  params: { slug: string }
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<any[]>(mockTags) // 使用模拟标签
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return

    // Simplified check: if there's no session, redirect to sign-in.
    // The `signIn` callback in `lib/auth.ts` now enforces who can log in.
    if (!session) {
      router.push("/auth/signin?callbackUrl=/admin/articles")
      return
    }

    const fetchArticleAndTags = async () => {
      setLoading(true)
      setError(null)
      try {
        // 模拟获取文章数据
        const article = mockArticles.find((a) => a.slug === params.slug)
        if (!article) {
          throw new Error("Article not found.")
        }

        setTitle(article.title)
        setContent(article.content)
        setPublished(article.published)
        setSelectedTags(article.tags?.map((tag: any) => tag.id) || [])

        // 实际项目中这里会从 API 获取标签
        // const tagsRes = await fetch("/api/tags")
        // const tagsData = await tagsRes.json()
        // setAvailableTags(tagsData)
      } catch (err: any) {
        setError(err.message || "Failed to load article data.")
      } finally {
        setLoading(false)
      }
    }

    fetchArticleAndTags()
  }, [params.slug, session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // 模拟文章更新
      console.log("Updating article (simulated):", { title, content, published, tags: selectedTags })
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟网络请求

      // 模拟成功后跳转
      router.push(`/admin/articles`)
    } catch (err: any) {
      setError(err.message || "Failed to update article.")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  if (status === "loading" || loading) {
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

  if (error && !loading) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto shadow-custom-md">
        <CardHeader>
          <CardTitle>Edit Article</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Write your article content in Markdown..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting || !title || !content}
                className="shadow-custom-sm hover:shadow-custom-md"
              >
                {submitting ? "Updating..." : "Update Article"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="shadow-custom-sm hover:shadow-custom-md"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
