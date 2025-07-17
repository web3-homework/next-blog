"use client"

import React from "react"
import { useState, useEffect, use } from "react"
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
import type { Tag, Article } from "@/types"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default function EditArticleClientPage({ params }: EditArticlePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticle()
    fetchTags()
  }, [id])

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${id}`)
      if (res.ok) {
        const articleData = await res.json()
        console.log('xx', articleData)
        setArticle(articleData)
        setTitle(articleData.title)
        setContent(articleData.content)
        setPublished(articleData.published)
        setSelectedTags(articleData.tags?.split(','))
      } else {
        notFound()
      }
    } catch (error) {
      setError("Failed to load article")
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags")
      if (res.ok) {
        const tags = await res.json()
        setAvailableTags(tags)
      }
    } catch (error) {
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          published,
          tags: selectedTags,
        }),
      })

      if (res.ok) {
        router.push(`/articles/${id}`)
      } else {
        throw new Error("Failed to update article")
      }
    } catch (err: any) {
      setError(err.message || "Failed to update article.")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto h-96 bg-muted animate-pulse rounded-lg shadow-custom-md" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-red-500">{error || "Article not found"}</p>
        </div>
      </div>
    )
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
