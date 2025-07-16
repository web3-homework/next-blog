import { NextResponse } from "next/server"

// 模拟数据，避免数据库连接错误
const mockArticles = [
  {
    id: "1",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    content: "# Welcome\n\nThis is your first blog post!",
    excerpt: "Welcome to my personal blog where I share thoughts and tutorials.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [{ id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Getting Started with Next.js",
    slug: "getting-started-nextjs",
    content: "# Getting Started\n\nNext.js is a powerful React framework...",
    excerpt: "Learn the basics of Next.js and how to build modern web applications.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [
      { id: "2", name: "Next.js", slug: "nextjs", color: "#000000" },
      { id: "3", name: "Tutorial", slug: "tutorial", color: "#4ECDC4" },
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    content: "# Welcome\n\nThis is your first blog post!",
    excerpt: "Welcome to my personal blog where I share thoughts and tutorials.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [{ id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    content: "# Welcome\n\nThis is your first blog post!",
    excerpt: "Welcome to my personal blog where I share thoughts and tutorials.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [{ id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    content: "# Welcome\n\nThis is your first blog post!",
    excerpt: "Welcome to my personal blog where I share thoughts and tutorials.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [{ id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    content: "# Welcome\n\nThis is your first blog post!",
    excerpt: "Welcome to my personal blog where I share thoughts and tutorials.",
    published: true,
    author: {
      id: "1",
      name: "Blog Author",
      image: "/placeholder.svg?height=40&width=40",
    },
    tags: [{ id: "1", name: "Welcome", slug: "welcome", color: "#3B82F6" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      articles: mockArticles,
      pagination: {
        page: 1,
        limit: 10,
        total: mockArticles.length,
        totalPages: 1,
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
