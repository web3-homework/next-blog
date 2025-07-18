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
    content?: string
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
      slug: string
    }>
    created_at: string
  }
  index: number
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-custom-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={article.featured_image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover"
          priority={true}
        />
      </div>
      <CardHeader className="py-3">
        <Link href={`/articles/${article.id}`}>
          <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors pl-2">{article.title}</h3>
        </Link>
        <div className="flex flex-wrap gap-1 mb-2">
          {article.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
              <Link href={`/articles?tag=${tag.slug}`}>{tag.name}</Link>
            </Badge>
          ))}
        </div>
      </CardHeader>
      {/* <CardContent className="pb-3">
        {article.content && <p className="text-muted-foreground line-clamp-3 mb-4">{article.content}</p>}
      </CardContent> */}
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
