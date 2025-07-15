export interface User {
  id: string
  name?: string
  email: string
  image?: string
  role: "admin" | "user"
  bio?: string
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  published: boolean
  author_id: string
  author?: User
  tags?: Tag[]
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  color: string
  created_at: string
}

export interface Comment {
  id: string
  content: string
  article_id: string
  user_id: string
  user?: User
  parent_id?: string
  replies?: Comment[]
  created_at: string
  updated_at: string
}
