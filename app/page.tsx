import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, PenTool } from "lucide-react"

async function getLatestArticles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/articles?limit=6`, {
      cache: "no-store", // 避免缓存问题
    })

    if (!res.ok) {
      console.error("Failed to fetch articles:", res.status)
      return []
    }

    const data = await res.json()
    return data.articles || []
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

async function getPopularTags() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/tags`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch tags:", res.status)
      return []
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

export default async function HomePage() {
  const [articles, tags] = await Promise.all([getLatestArticles(), getPopularTags()])

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <div className="max-w-3xl mx-auto">
          <PenTool className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to My Blog</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sharing thoughts, tutorials, and insights about web development, technology, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/articles">
                Read Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tags">Browse Topics</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
          <Button variant="outline" asChild>
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

      {/* Popular Tags */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Popular Topics</h2>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.slice(0, 12).map((tag: any) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                asChild
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
