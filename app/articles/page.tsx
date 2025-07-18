"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticleCard } from "@/components/article-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { LoadingAnimation } from "@/components/loading-animation"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTagSlug, setSelectedTagSlug] = useState("all")
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  
  // 获取URL参数和路由实例
  const searchParams = useSearchParams();
  const router = useRouter();

  // 初始化：从URL获取tag参数
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setSelectedTagSlug(tagFromUrl);
    } else {
      setSelectedTagSlug("all");
    }

    fetchArticles()
    fetchTags()
  }, [searchParams])

  // 根据文章和选中的标签筛选文章
  useEffect(() => {
    let data = [...articles];
    
    // 标签筛选
    if (selectedTagSlug !== "all") {
      data = data.filter((article) => 
        article.tags?.some((tag: any) => tag.slug === selectedTagSlug)
      );
    }
    
    // 搜索词筛选
    if (searchTerm) {
      data = data.filter((article) => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredArticles(data);
  }, [articles, selectedTagSlug, searchTerm])

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // 可以选择在这里添加tag参数到API请求，减少数据传输
      const res = await fetch(`/api/articles`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data || []);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      if (res.ok) {
        const data = await res.json();
        setTags(data || []);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }

  // 处理标签选择变化 - 更新状态和URL
  const handleTagChange = (newTagSlug: string) => {
    setSelectedTagSlug(newTagSlug);
    
    // 更新URL参数
    const params = new URLSearchParams(searchParams);
    if (newTagSlug === "all") {
      params.delete('tag');
    } else {
      params.set('tag', newTagSlug);
    }
    
    // 移除搜索参数（可选，根据需求决定）
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    router.push(`/articles?${params.toString()}`);
  }

  // 处理搜索变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  // 清除所有筛选条件
  const clearAllFilters = () => {
    setSelectedTagSlug("all");
    setSearchTerm("");
    router.push(`/articles`);
  }

  // 检查是否有活跃的筛选条件
  const hasActiveFilters = selectedTagSlug !== "all" || searchTerm;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-muted-foreground">Explore all articles and find what interests you most.</p>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Tag Filter */}
        <Select value={selectedTagSlug} onValueChange={handleTagChange}>
          <SelectTrigger className="w-full">
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

      {/* {loading ? (
        <LoadingAnimation />
      ) : ( */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      {/* )}

      {!loading && filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="mt-4"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )} */}
    </div>
  )
}
