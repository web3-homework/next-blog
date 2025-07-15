import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"
import remarkPrism from "remark-prism"

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(remarkGfm).use(remarkPrism).use(html, { sanitize: false }).process(markdown)

  return result.toString()
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

export function generateExcerpt(content: string, maxLength = 160): string {
  const plainText = content.replace(/[#*`_~]/g, "").replace(/\n/g, " ")
  return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
}
