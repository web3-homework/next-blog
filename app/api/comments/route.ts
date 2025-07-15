import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const articleId = searchParams.get("articleId")

  if (!articleId) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
  }

  const { data: comments, error } = await supabaseAdmin
    .from("comments")
    .select(`
      *,
      user:users(id, name, image)
    `)
    .eq("article_id", articleId)
    .is("parent_id", null)
    .order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(comments || [])
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { content, articleId, parentId } = body

    const { data: comment, error } = await supabaseAdmin
      .from("comments")
      .insert({
        content,
        article_id: articleId,
        user_id: session.user.id,
        parent_id: parentId || null,
      })
      .select(`
        *,
        user:users(id, name, image)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
