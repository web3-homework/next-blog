"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ArticleActionsProps {
  article: {
    id: string
    slug: string
    title: string
  }
}

export function ArticleActions({ article }: ArticleActionsProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      // In a real application, you would call your API to delete the article
      // const res = await fetch(`/api/articles/${article.slug}`, { method: "DELETE" });
      // if (!res.ok) {
      //   throw new Error("Failed to delete article");
      // }
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

      toast({
        title: "Article Deleted",
        description: `Article "${article.title}" has been deleted.`,
      })
      router.refresh() // Refresh the page to update the article list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/articles/${article.slug}/edit`}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your article &quot;
              {article.title}&quot; and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
