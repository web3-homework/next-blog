"use client"

import type React from "react"
import { useState } from "react"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MarkdownEditor } from "@/components/markdown-editor"
import { X } from "lucide-react"
import { mockTags, mockArticles } from "@/app/articles/[slug]/page"

interface EditArticlePageProps {
  params: { slug: string }
}

export default function EditArticleClientPage({ params }: EditArticlePageProps) {
  const router = useRouter()

  // In a real application, you would fetch the article from your database here
  const article = mockArticles.find((a) => a.slug === params.slug)

  if (!article) {
    notFound()
  }

  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [published, setPublished] = useState(article.published)
  const [selectedTags, setSelectedTags] = useState<string[]>(article.tags?.map((tag: any) => tag.id) || [])
  const [availableTags, setAvailableTags] = useState<any[]>(mockTags) // 使用模拟标签
  const [loading, setLoading] = useState(false) // This state is not used here as loading is handled by parent SC
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null) // This state is not used here as error is handled by parent SC

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

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto shadow-custom-md">
        <CardHeader>
          <CardTitle>Edit Article: {article.title}</CardTitle>
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
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Suspense fallback={<div>Loading editor...</div>}>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your article content in Markdown..."
                />
              </Suspense>
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
