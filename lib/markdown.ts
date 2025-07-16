import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeHighlight from "rehype-highlight" // 用于代码高亮
import rehypeStringify from "rehype-stringify" // 用于将 HTML AST 转换为字符串

export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse) // 将 Markdown 字符串解析为 Markdown 抽象语法树 (AST)
    .use(remarkGfm) // 支持 GitHub Flavored Markdown (GFM)
    .use(remarkRehype) // 将 Markdown AST 转换为 HTML AST
    .use(rehypeHighlight) // 对代码块进行语法高亮
    .use(rehypeStringify) // 将 HTML AST 转换为 HTML 字符串
    .process(markdown)

  return result.toString()
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 移除所有非字母数字、非空格、非连字符的字符
    .replace(/\s+/g, "-") // 将所有空格替换为单个连字符
    .trim() // 移除字符串两端的空白
}

export function generateExcerpt(content: string, maxLength = 160): string {
  // 移除 Markdown 格式（如 # * ` _ ~）并替换换行符为空格
  const plainText = content.replace(/[#*`_~]/g, "").replace(/\n/g, " ")
  // 如果纯文本内容超过最大长度，则截断并添加省略号
  return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
}
