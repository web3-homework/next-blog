

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticleCard } from "@/components/article-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { LoadingAnimation } from "@/components/loading-animation"
import { Suspense } from "react"
import { ArticlesFilter } from "./components/articles-filter"




// 服务器端数据获取
async function getArticles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/articles`, {
      next: { revalidate: 60 } // 添加ISR配置，每60秒重新验证
    })
    if (!res.ok) throw new Error('Failed to fetch articles')
    return res.json()
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

async function getTags() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/tags`, {
      next: { revalidate: 60 } // 添加ISR配置
    })
    if (!res.ok) throw new Error('Failed to fetch tags')
    return res.json()
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

export default async function ArticlesPage() {
  // 并行获取数据
  const [articles, tags] = await Promise.all([getArticles(), getTags()])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-muted-foreground">Explore all articles and find what interests you most.</p>
      </div>

      {/* 使用Suspense包裹客户端筛选组件 */}
      <Suspense fallback={<LoadingAnimation />}>
        <ArticlesFilter 
          initialArticles={articles} 
          initialTags={tags} 
        />
      </Suspense>
    </div>
  )
}
