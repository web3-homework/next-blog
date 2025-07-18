"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticleCard } from "@/components/article-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface ArticlesFilterProps {
  initialArticles: any[];
  initialTags: any[];
}

export function ArticlesFilter({
  initialArticles, 
  initialTags, 
}: ArticlesFilterProps) {
  const [articles, setArticles] = useState(initialArticles)
  const [tags, setTags] = useState(initialTags)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTagSlug, setSelectedTagSlug] = useState("all")
  const [filteredArticles, setFilteredArticles] = useState(initialArticles)
  
  const router = useRouter();
  const clientSearchParams = useSearchParams();

  // 从URL参数初始化筛选条件
  useEffect(() => {
    const tagFromUrl = clientSearchParams.get('tag') || 'all';
    const searchFromUrl = clientSearchParams.get('search') || '';
    
    setSelectedTagSlug(tagFromUrl);
    setSearchTerm(searchFromUrl);
  }, [clientSearchParams])

  // 应用筛选条件
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

  // 处理标签选择变化
  const handleTagChange = (newTagSlug: string) => {
    setSelectedTagSlug(newTagSlug);
    
    // 更新URL参数
    const params = new URLSearchParams(clientSearchParams);
    if (newTagSlug === "all") {
      params.delete('tag');
    } else {
      params.set('tag', newTagSlug);
    }
    
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
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
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
      )}
    </>
  )
}