import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, PenTool } from "lucide-react"
import { Metadata } from 'next';
import { meta } from "@/lib/metadata"

export const metadata: Metadata = meta

async function getLatestArticles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/articles`)

    if (!res.ok) {
      return []
    }
    return (await res.json() || []).slice(0, 3)
  } catch (error) {
    return []
  }
}

async function getPopularTags() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/tags`)

    if (!res.ok) {
      return []
    }

    return await res.json()
  } catch (error) {
    return []
  }
}

export default async function HomePage() {
  const [articles, tags] = await Promise.all([getLatestArticles(), getPopularTags()])

  return (
    <div className="container py-8">
      <section className="text-center py-16 md:py-24 mb-12 bg-gradient-to-b from-background to-muted/20 rounded-lg">
        <div className="max-w-3xl mx-auto px-4">
          <PenTool className="h-16 w-16 mx-auto mb-6 text-primary animate-bounce-slow" />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Welcome to My Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sharing thoughts, tutorials, and insights about web development, technology, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="shadow-custom-sm hover:shadow-custom-md">
              <Link href="/articles">
                Read Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="shadow-custom-sm hover:shadow-custom-md bg-transparent"
            >
              <Link href="/tags">View Tags</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
          <Button variant="outline" asChild className="transition-colors hover:text-primary bg-transparent">
            <Link href="/articles">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles available yet.</p>
          </div>
        )}
      </section>

      <section className="py-8">
        
        <h2 className="text-3xl font-bold mb-8">All Tags</h2>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag: any) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                <Link href={`/articles?tag=${tag.slug}`}>{tag.name}</Link>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tags available yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
