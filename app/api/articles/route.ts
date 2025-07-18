import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    // 获取文章基本信息
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    // 获取标签基本信息
    const { data: tags } = await supabase
      .from('tags')
      .select('*')

    if (error) throw error

    const formatArticles = articles.map((article) => {
      const tagIds = article.tags.split(',')
      const tagsList = tagIds.map((tagId: string) => {
        const tag = tags ? tags.find((tag) => tag.id === tagId) : null
        return {
          id: tag.id,
          name: tag.name,
          slug: tag.slug
        }
      })
      return {
        ...article,
        tags: tagsList
      }
    })

    return NextResponse.json(formatArticles)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 检查数据库存储数量
    const { count: articleCount } = await supabase
      .from('articles')
      .select('id', { count: 'exact', head: true });

    // 2. 超过10条时返回错误
    if (articleCount && articleCount >= 10) {
      return NextResponse.json(
        { error: 'Maximum article limit reached (10 articles). Cannot add new articles.' },
        { status: 403 }
      );
    }

    const { title, content, published, featured_image, tags } = await request.json()

    // 验证必要字段
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // 开始事务 - 先插入文章
    const articleId = uuidv4()
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert([{
        id: articleId,
        title,
        content,
        tags,
        featured_image: featured_image || null,
        published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (articleError) throw articleError

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
