"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    // Redirect to a default chat page
    router.push("/default/chat")
  }, [router])

  return (
    <div className="bg-background flex size-full flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="border-border bg-card flex size-16 items-center justify-center rounded-lg border shadow-sm">
          <ChatbotUISVG
            theme={theme === "dark" ? "dark" : "light"}
            scale={0.18}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-foreground text-3xl font-semibold">Alex</h1>
          <p className="text-muted-foreground text-sm">
            Preparing your workspace
          </p>
        </div>

        <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
          <div className="bg-foreground h-full w-1/3 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  )
}
