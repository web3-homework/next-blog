import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ArrowLeft, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
// import { CommentSection } from "@/components/comment-section" // Uncomment when database is integrated
import { markdownToHtml } from "@/lib/markdown"

// Mock data for articles and tags
export const mockTags = [
  { id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6", created_at: new Date().toISOString() },
  { id: "2", name: "Next.js", slug: "nextjs", color: "#000000", created_at: new Date().toISOString() },
  { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4", created_at: new Date().toISOString() },
  { id: "4", name: "React", slug: "react", color: "#61DAFB", created_at: new Date().toISOString() },
  { id: "5", name: "TypeScript", slug: "typescript", color: "#3178C6", created_at: new Date().toISOString() },
]

export const mockArticles = [
  {
    id: "1",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    content:
      "# Welcome\n\nThis is your first blog post! It's written in Markdown.\n\n## Features\n\n- **Responsive Design**: Adapts to various screen sizes.\n- **Authentication**: Secure login with NextAuth.js.\n- **Admin Dashboard**: Manage articles with CRUD operations.\n\nEnjoy exploring!",
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
    featured_image: "/placeholder.svg?height=600&width=1200",
  },
  {
    id: "2",
    title: "Getting Started with Next.js",
    slug: "getting-started-nextjs",
    content:
      "# Getting Started\n\nNext.js is a powerful React framework...\n\n- Item 1\n- Item 2\n\n```python\nprint('Hello from Python')\n```",
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
    featured_image: "/placeholder.svg?height=600&width=1200",
  },
]

interface ArticlePageProps {
  params: { slug: string }
}

async function getArticle(slug: string) {
  // 模拟从 API 获取文章数据
  const article = mockArticles.find((a) => a.slug === slug)
  return article || null
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt || "",
      images: article.featured_image ? [article.featured_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const content = await markdownToHtml(article.content)

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6 transition-colors hover:text-primary">
        <Link href="/articles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          {article.featured_image && (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-custom-md">
              {/* 添加阴影 */}
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
            {article.tags?.map((tag) => (
              <Badge key={tag.id} variant="secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                <Link
                  href={`/articles?tag=${tag.slug}`}
                  className="transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {/* 添加悬停效果 */}
                  {tag.name}
                </Link>
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>

          <div className="flex items-center justify-between text-muted-foreground mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.author?.image || ""} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{article.author?.name}</p>
                <div className="flex items-center space-x-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(article.created_at).toLocaleDateString("en-US", {
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

        {/* Article Content */}
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
