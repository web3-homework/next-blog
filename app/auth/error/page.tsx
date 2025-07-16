"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"

const errorMessages: Record<string, string> = {
  Configuration: "服务器配置错误，请联系站点管理员。",
  AccessDenied: "访问被拒绝，您没有权限执行此操作。",
  Verification: "邮箱验证失败或链接已过期。",
  OAuthSignin: "无法连接到第三方登录提供商。",
  OAuthCallback: "第三方登录回调出错。",
  OAuthCreateAccount: "创建账户时发生错误。",
  OAuthAccountNotLinked: "此邮箱已绑定到其他登录方式，请使用原方式登录。",
  EmailSignin: "邮件发送失败，请稍后再试。",
  CredentialsSignin: "邮箱或密码错误。",
  Unknown: "发生未知错误，请稍后再试。",
}

export default function AuthErrorPage() {
  const params = useSearchParams()
  const router = useRouter()
  // ?error=OAuthCallback 之类
  const errorType = params.get("error") ?? "Unknown"
  const message = errorMessages[errorType] ?? errorMessages.Unknown

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="h-6 w-6" />
        <AlertTitle className="text-xl">登录出错</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>{message}</p>

          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-muted-foreground">
              {/* 开发环境下把完整错误类型打印出来，方便调试 */}
              错误码：<span className="font-mono">{errorType}</span>
            </p>
          )}
        </AlertDescription>
      </Alert>

      <div className="mt-8 flex gap-4">
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回上一页
        </Button>
        <Button asChild variant="outline">
          <Link href="/">回到首页</Link>
        </Button>
      </div>
    </div>
  )
}
