"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation" // 引入 useRouter
import { ArticleCard } from "@/components/article-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

// 模拟文章数据 (与之前保持一致)
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
  {
    id: "3",
    title: "Understanding React Hooks",
    slug: "understanding-react-hooks",
    content: "# React Hooks\n\nHooks let you use state and other React features without writing a class.",
    excerpt: "A deep dive into React Hooks and how they simplify component logic.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "4", name: "React", slug: "react", color: "#61DAFB" },
      { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4" },
    ],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "4",
    title: "TypeScript Best Practices",
    slug: "typescript-best-practices",
    content: "# TypeScript\n\nUsing TypeScript effectively can improve code quality.",
    excerpt: "Tips and tricks for writing clean and maintainable TypeScript code.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "5", name: "TypeScript", slug: "typescript", color: "#3178C6" },
      { id: "6", name: "Tips", slug: "tips", color: "#45B7D1" },
    ],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "5",
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
    id: "6",
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
  {
    id: "7",
    title: "Understanding React Hooks",
    slug: "understanding-react-hooks",
    content: "# React Hooks\n\nHooks let you use state and other React features without writing a class.",
    excerpt: "A deep dive into React Hooks and how they simplify component logic.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "4", name: "React", slug: "react", color: "#61DAFB" },
      { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4" },
    ],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "8",
    title: "TypeScript Best Practices",
    slug: "typescript-best-practices",
    content: "# TypeScript\n\nUsing TypeScript effectively can improve code quality.",
    excerpt: "Tips and tricks for writing clean and maintainable TypeScript code.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "5", name: "TypeScript", slug: "typescript", color: "#3178C6" },
      { id: "6", name: "Tips", slug: "tips", color: "#45B7D1" },
    ],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "9",
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
    id: "10",
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
  {
    id: "11",
    title: "Understanding React Hooks",
    slug: "understanding-react-hooks",
    content: "# React Hooks\n\nHooks let you use state and other React features without writing a class.",
    excerpt: "A deep dive into React Hooks and how they simplify component logic.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "4", name: "React", slug: "react", color: "#61DAFB" },
      { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4" },
    ],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "12",
    title: "TypeScript Best Practices",
    slug: "typescript-best-practices",
    content: "# TypeScript\n\nUsing TypeScript effectively can improve code quality.",
    excerpt: "Tips and tricks for writing clean and maintainable TypeScript code.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "5", name: "TypeScript", slug: "typescript", color: "#3178C6" },
      { id: "6", name: "Tips", slug: "tips", color: "#45B7D1" },
    ],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
]

// 模拟标签数据 (与之前保持一致)
const mockTags = [
  { id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6", created_at: new Date().toISOString() },
  { id: "2", name: "Next.js", slug: "nextjs", color: "#000000", created_at: new Date().toISOString() },
  { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4", created_at: new Date().toISOString() },
  { id: "4", name: "React", slug: "react", color: "#61DAFB", created_at: new Date().toISOString() },
  { id: "5", name: "TypeScript", slug: "typescript", color: "#3178C6", created_at: new Date().toISOString() },
  { id: "6", name: "Tips", slug: "tips", color: "#45B7D1", created_at: new Date().toISOString() },
]

export default function ArticlesPage() {
  const searchParams = useSearchParams()
  const router = useRouter() // 初始化 useRouter
  const [articles, setArticles] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>(mockTags) // 使用模拟标签
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTagSlug, setSelectedTagSlug] = useState(searchParams.get("tag") || "all") // 从 URL 读取标签

  useEffect(() => {
    // 模拟获取文章和标签
    setLoading(true)
    const filteredByTag =
      selectedTagSlug === "all"
        ? mockArticles
        : mockArticles.filter((article) => article.tags?.some((tag) => tag.slug === selectedTagSlug))
    setArticles(filteredByTag)
    setLoading(false)

    // 实际项目中这里会从 API 获取文章和标签
    // fetchArticles()
    // fetchTags()
  }, [selectedTagSlug]) // 依赖 selectedTagSlug

  // 处理标签选择变化
  const handleTagChange = (newTagSlug: string) => {
    setSelectedTagSlug(newTagSlug)
    // 更新 URL 查询参数
    const currentParams = new URLSearchParams(searchParams.toString())
    if (newTagSlug === "all") {
      currentParams.delete("tag")
    } else {
      currentParams.set("tag", newTagSlug)
    }
    router.push(`/articles?${currentParams.toString()}`)
  }

  const filteredBySearch = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const currentTagName = selectedTagSlug !== "all" ? tags.find((t) => t.slug === selectedTagSlug)?.name : null

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-muted-foreground">Explore all articles and find what interests you most.</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tag Filter */}
      <div className="mb-6">
        <Select value={selectedTagSlug} onValueChange={handleTagChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.slug}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {currentTagName && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active filter:</span>
          <Badge
            variant="secondary"
            className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleTagChange("all")}
          >
            {currentTagName} ×
          </Badge>
        </div>
      )}

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg shadow-custom-md" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBySearch.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!loading && filteredBySearch.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
