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
import { X } from "lucide-react"

export default function NewArticlePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<any[]>([]) // 使用模拟标签
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.role !== "admin") {
      router.push("/")
      return
    }

    fetchTags()
  }, [session, router])

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags")
      const tags = await res.json()
      setAvailableTags(tags)
    } catch (error) {
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const idx = Math.trunc(Math.random() * 10)

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          published,
          featured_image: `/placeholder${idx}.jpg`,
          tags: selectedTags.join(','),
        }),
      })

      if (res.ok) {
        router.push(`/admin/articles`)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  // 在加载或非管理员时显示加载或重定向
  if (status === "loading" || session?.user?.role !== "admin") {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto h-96 bg-muted animate-pulse rounded-lg shadow-custom-md" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto shadow-custom-md"> {/* 添加阴影 */}
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
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
              <Button type="submit" disabled={loading || !title || !content} className="shadow-custom-sm hover:shadow-custom-md"> {/* 添加阴影 */}
                {loading ? "Creating..." : "Create Article"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="shadow-custom-sm hover:shadow-custom-md"> {/* 添加阴影 */}
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
