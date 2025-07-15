import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User } from "lucide-react"

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt?: string
    featured_image?: string
    author?: {
      id: string
      name?: string
      image?: string
    }
    tags?: Array<{
      id: string
      name: string
      color: string
    }>
    created_at: string
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
      {article.featured_image && (
        <div className="relative h-48 w-full">
          <Image
            src={article.featured_image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
            onError={(e) => {
              // 处理图片加载错误
              const target = e.target as HTMLImageElement
              target.style.display = "none"
            }}
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {article.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
              {tag.name}
            </Badge>
          ))}
        </div>

        <Link href={`/articles/${article.slug}`}>
          <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">{article.title}</h3>
        </Link>
      </CardHeader>

      <CardContent className="pb-3">
        {article.excerpt && <p className="text-muted-foreground line-clamp-3 mb-4">{article.excerpt}</p>}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={article.author?.image || ""} />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>{article.author?.name || "Anonymous"}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
