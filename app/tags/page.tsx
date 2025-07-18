import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TagIcon } from "lucide-react"
import type { Tag } from "@/types"

async function getTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/tags`)

    if (!res.ok) return []

    return res.json()
  } catch {
    return []
  }
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Tags</h1>
        <p className="text-muted-foreground">Explore articles by topic and find content that interests you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.map((tag) => (
          <Card key={tag.id} className="hover:shadow-custom-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5" style={{ color: tag.color }} />
                <CardTitle className="text-lg">{tag.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                <Link
                  href={`/articles?tag=${tag.slug}`}
                  className="cursor-pointer transition-colors"
                >
                  View Articles
                </Link>
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12">
          <TagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No tags available yet.</p>
        </div>
      )}
    </div>
  )
}
