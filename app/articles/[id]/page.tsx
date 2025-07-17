"use client"

import { notFound } from "next/navigation"
import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CommentSection } from "@/components/comment-section" 
import { markdownToHtml } from "@/lib/markdown"
import type { Tag, Article } from "@/types"

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

async function getArticle(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/articles/${id}`, {
      next: { revalidate: 3600 }, // ISR
    })

    if (!res.ok) return null

    return res.json()
  } catch {
    return null
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params)
  console.log('ArticlePage', id)

  const [ article, setArticle ] = useState<Article | null>(null)
  const [ content, setContent ] = useState<string>('')

  useEffect(() => {
    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    const article = await getArticle(id)
    if (!article) {
      notFound()
    }
    setArticle(article) 
    const content = await markdownToHtml(article.content)
    setContent(content)
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6 transition-colors hover:text-primary">
        <Link href="/articles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          {article && article.featured_image && (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-custom-md">
              <Image
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {article && article.tags?.map((tag: { id: string | number; name: string; slug: string; color: string }) => (
              <Badge key={tag.id} variant="secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                <Link
                  href={`/articles?tag=${tag.slug}`}
                  className="transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {tag.name}
                </Link>
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article?.title}</h1>

          <div className="flex items-center justify-between text-muted-foreground mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article?.author?.image || ""} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{article?.author?.name}</p>
                <div className="flex items-center space-x-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {article && new Date(article.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content }} />

        <Separator className="my-8" />

        {/* Comments Section */}
        {/* 暂时注释掉评论区，因为它依赖数据库 */}
        {/* <CommentSection articleId={article.id} /> */}
        <div className="text-center py-8 text-muted-foreground">
          <p>评论功能已暂时禁用，请在集成数据库后启用。</p>
        </div>
      </article>
    </div>
  )
}
