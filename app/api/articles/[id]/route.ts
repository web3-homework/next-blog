import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; 
    const { id } = resolvedParams; 
    const { data: article, error } = await supabase
      .from("articles")
      .select('*')
      .eq("id", id)
      .single()

    const { data: tags } = await supabase
      .from('tags')
      .select('*')

    const tagIds = article.tags.split(',')
    const tagsList = tagIds.map((tagId: string) => {
      const tag = tags ? tags.find((tag) => tag.id === tagId) : null
      return {
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      }
    })
    return NextResponse.json({
      ...article,
        tags: tagsList
    })
  } catch (error) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const resolvedParams = await params; 
    const { id } = resolvedParams; 
    
    const body = await request.json()
    const { title, content, published, tags } = body

    const { data: article } = await supabase
      .from("articles")
      .update({
        title,
        content,
        published,
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; 
  const { id } = resolvedParams; 
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await supabase.from("articles").delete().eq("id", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
