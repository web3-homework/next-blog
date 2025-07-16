"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { markdownToHtml } from "@/lib/markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [preview, setPreview] = useState("")

  const handlePreview = async () => {
    const html = await markdownToHtml(value)
    setPreview(html)
  }

  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview" onClick={handlePreview}>
          Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="write" className="mt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[400px] font-mono" /* 优化焦点样式 */
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        <div
          className="min-h-[400px] p-4 border rounded-md prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </TabsContent>
    </Tabs>
  )
}
