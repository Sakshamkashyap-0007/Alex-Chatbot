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
    <div className="animate-fade-in flex size-full flex-col items-center justify-center">
      <div className="animate-float">
        <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
      </div>

      <div className="neon-text mt-2 text-4xl font-bold">Alex</div>

      <div className="mt-4 text-lg">Loading...</div>
    </div>
  )
}
