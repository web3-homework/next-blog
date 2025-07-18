import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/comment-section';
import { markdownToHtml } from '@/lib/markdown';
import { supabase } from '@/lib/supabase';

// 定义页面元数据，实现SEO优化
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticle(params.id);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found',
    };
  }

  return {
    title: `${article.title} | Your Blog Name`,
    description: article.content.substring(0, 160).replace(/\n/g, ' '),
    openGraph: {
      title: article.title,
      description: article.content.substring(0, 160).replace(/\n/g, ' '),
      type: 'article',
      authors: [article.author?.name || 'Unknown Author'],
      ...(article.featured_image && {
        images: [{
          url: article.featured_image,
          alt: article.title,
        }],
      }),
    },
  };
}

// 服务器端数据获取函数
async function getArticle(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/articles/${id}`, {
      next: { revalidate: 3600 }, // ISR
    })

    if (!res.ok) return null

    return res.json()
  } catch(error) {}
}

// 服务器组件 - 无"use client"指令
export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  // 服务器端渲染Markdown内容
  const content = await markdownToHtml(article.content);

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
          {article.featured_image && (
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
            {article.tags?.map((tag: any) => (
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
                  <time dateTime={article.created_at}>
                    {new Date(article.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content }} />

        <Separator className="my-8" />

        {/* 评论区作为客户端组件导入 */}
        {/* <CommentSection articleId={article.id} /> */}
      </article>
    </div>
  );
}
