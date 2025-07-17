import { use } from "react";
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; 
  const { id } = resolvedParams; 
  const { data: article, error } = await supabase
    .from("articles")
    .select('*')
    .eq("id", id)
    .single()
  if (error || !article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }
  return NextResponse.json(article)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, content, published, tags = [] } = body

    const { data: article, error: updateError } = await supabase
      .from("articles")
      .update({
        title,
        content,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update tags
    await supabase.from("article_tags").delete().eq("article_id", article.id)

    if (tags.length > 0) {
      const tagRelations = tags.map((tagId: string) => ({
        article_id: article.id,
        tag_id: tagId,
      }))

      await supabase.from("article_tags").insert(tagRelations)
    }

    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase.from("articles").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
