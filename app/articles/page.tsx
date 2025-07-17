"use client"

import { useState, useEffect } from "react"
import { ArticleCard } from "@/components/article-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTagSlug, setSelectedTagSlug] = useState("all") 
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])

  useEffect(() => {
    fetchArticles()
    fetchTags()
  }, [])

  useEffect(() => {
    let data = []
    if (selectedTagSlug === "all") {
      data = articles
    } else {
      data = articles.filter((article) => article.tags?.some((tag: any) => tag.slug === selectedTagSlug))
    }
    setFilteredArticles(data)
  }, [articles, selectedTagSlug])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/articles`)
      if (res.ok) {
        const data = await res.json()
        setArticles(data || [])
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags")
      if (res.ok) {
        const data = await res.json()
        setTags(data || [])
      }
    } catch (error) {
    }
  }

  // 处理标签选择变化
  const handleTagChange = (newTagSlug: string) => {
    console.log('newTagSlug', newTagSlug)
    setSelectedTagSlug(newTagSlug)
  }

  const filteredBySearch = articles.filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()))

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
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!loading && filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
