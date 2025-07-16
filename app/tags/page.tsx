import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TagIcon } from "lucide-react"

// 模拟标签数据
const mockTags = [
  { id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6", created_at: new Date().toISOString() },
  { id: "2", name: "Next.js", slug: "nextjs", color: "#000000", created_at: new Date().toISOString() },
  { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4", created_at: new Date().toISOString() },
  { id: "4", name: "React", slug: "react", color: "#61DAFB", created_at: new Date().toISOString() },
  { id: "5", name: "TypeScript", slug: "typescript", color: "#3178C6", created_at: new Date().toISOString() },
  { id: "6", name: "JavaScript", slug: "javascript", color: "#F7DF1E", created_at: new Date().toISOString() },
  { id: "7", name: "Web Development", slug: "web-development", color: "#FF6B6B", created_at: new Date().toISOString() },
  { id: "8", name: "Tips", slug: "tips", color: "#45B7D1", created_at: new Date().toISOString() },
  { id: "9", name: "Performance", slug: "performance", color: "#96CEB4", created_at: new Date().toISOString() },
]

async function getTags() {
  // 模拟从 API 获取标签数据
  return mockTags
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Topics</h1>
        <p className="text-muted-foreground">Explore articles by topic and find content that interests you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.map((tag) => (
          <Card key={tag.id} className="hover:shadow-custom-md transition-shadow">
            {" "}
            {/* 增强悬停效果 */}
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-5 w-5" style={{ color: tag.color }} />
                <CardTitle className="text-lg">{tag.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color }} asChild>
                <Link
                  href={`/articles?tag=${tag.slug}`}
                  className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {" "}
                  {/* 添加悬停效果 */}
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
