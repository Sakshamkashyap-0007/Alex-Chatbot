"use client"

import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import {
  IconPaperclip,
  IconPlayerStopFilled,
  IconSend,
  IconX
} from "@tabler/icons-react"
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react"

type ChatProvider = "google" | "openai"

type ChatSettings = {
  contextLength: number
  embeddingsProvider: "openai" | "local"
  includeProfileContext: boolean
  includeWorkspaceInstructions: boolean
  model: string
  prompt: string
  provider: ChatProvider
  temperature: number
}

type DefaultChatRole = "user" | "assistant"

type DefaultChatMessage = {
  id: string
  role: DefaultChatRole
  content: string
}

type ChatAttachment = {
  id: string
  name: string
  content: string
}

interface DefaultChatInputProps {
  attachments: ChatAttachment[]
  isGenerating: boolean
  isTyping: boolean
  onAttachFiles: (files: FileList | null) => void
  onCompositionEnd: () => void
  onCompositionStart: () => void
  onInputChange: (value: string) => void
  onRemoveAttachment: (id: string) => void
  onSendMessage: (messageContent: string) => void
  onStopMessage: () => void
  userInput: string
}

const DefaultChatInput = ({
  attachments,
  isGenerating,
  isTyping,
  onAttachFiles,
  onCompositionEnd,
  onCompositionStart,
  onInputChange,
  onRemoveAttachment,
  onSendMessage,
  onStopMessage,
  userInput
}: DefaultChatInputProps) => {
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      if (isGenerating) return
      onSendMessage(userInput)
    }
  }

  useHotkey("l", () => {
    chatInputRef.current?.focus()
  })

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-5 sm:pb-4 md:px-6">
      <div className="rounded-xl border border-white/10 bg-[#111318]/95 p-2.5 shadow-2xl shadow-black/20 backdrop-blur sm:rounded-2xl sm:p-3">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 border-b border-white/10 pb-2">
            {attachments.map(file => (
              <div
                key={file.id}
                className="flex max-w-full items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-zinc-300"
              >
                <span className="truncate">{file.name}</span>
                <button
                  aria-label={`Remove ${file.name}`}
                  className="text-zinc-500 transition-colors hover:text-zinc-200"
                  disabled={isGenerating}
                  onClick={() => onRemoveAttachment(file.id)}
                  type="button"
                >
                  <IconX size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 sm:gap-3">
          <input
            ref={fileInputRef}
            accept=".txt,.md,.markdown,.json,.csv,.log,.ts,.tsx,.js,.jsx,.py,.html,.css"
            className="hidden"
            multiple
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onAttachFiles(event.target.files)
              event.target.value = ""
            }}
            type="file"
          />

          <button
            aria-label="Attach files"
            className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isGenerating}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <IconPaperclip size={18} />
          </button>

          <textarea
            ref={chatInputRef}
            className="max-h-[35dvh] min-h-[48px] min-w-0 flex-1 resize-none rounded-lg border border-transparent bg-transparent px-2 py-3 text-[16px] leading-6 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-transparent disabled:cursor-not-allowed disabled:text-zinc-500 sm:min-h-[56px] sm:text-[15px]"
            placeholder={
              isGenerating ? "Alex is responding..." : "Message Alex..."
            }
            value={userInput}
            onChange={event => {
              if (isGenerating) return
              onInputChange(event.target.value)
            }}
            onKeyDown={handleKeyDown}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            disabled={isGenerating}
            rows={1}
          />

          <button
            className={cn(
              "mb-1 flex size-10 items-center justify-center rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
              !userInput.trim() &&
                !isGenerating &&
                "cursor-not-allowed bg-zinc-700 text-zinc-400 hover:bg-zinc-700"
            )}
            onClick={() => {
              if (isGenerating) {
                onStopMessage()
                return
              }

              if (!userInput.trim()) return
              onSendMessage(userInput)
            }}
            type="button"
            aria-label={isGenerating ? "Stop response" : "Send message"}
          >
            {isGenerating ? (
              <IconPlayerStopFilled size={18} />
            ) : (
              <IconSend size={18} />
            )}
          </button>
        </div>

        {isGenerating && (
          <div className="mt-2 px-2 text-xs leading-5 text-zinc-500">
            Alex is responding. You can stop the response to edit your message.
          </div>
        )}
      </div>
    </div>
  )
}

const EmptyState = () => (
  <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-8 pt-10 text-center sm:px-6 sm:pt-12">
    <h1 className="text-3xl font-semibold tracking-normal text-white sm:text-5xl">
      Alex
    </h1>
    <p className="mt-3 max-w-xl text-balance text-sm leading-6 text-zinc-400 sm:mt-4 sm:text-base sm:leading-7">
      A focused workspace for thoughtful, professional answers.
    </p>
  </div>
)

const DefaultChatMessages = ({
  messages
}: {
  messages: DefaultChatMessage[]
}) => (
  <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-8">
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5">
      {messages.map(message => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-sm sm:max-w-[75%]",
              message.role === "user"
                ? "rounded-br-md bg-blue-500/15 text-blue-50 ring-1 ring-blue-500/20"
                : "rounded-bl-md bg-[#15171c] text-zinc-100 ring-1 ring-white/10"
            )}
          >
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              {message.role === "assistant" ? "Alex" : "You"}
            </div>

            {message.content ? (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            ) : (
              <div className="flex items-center gap-1 py-1">
                <span className="size-1.5 rounded-full bg-zinc-500" />
                <span className="size-1.5 rounded-full bg-zinc-500" />
                <span className="size-1.5 rounded-full bg-zinc-500" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function DefaultChatPage() {
  useHotkey("o", () => handleNewChat())

  const [chatMessages, setChatMessages] = useState<DefaultChatMessage[]>([])
  const [userInput, setUserInput] = useState("")
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gemini-2.5-flash",
    prompt: "You are Alex, a concise and professional AI assistant.",
    provider: "google",
    temperature: 0.7,
    contextLength: 4000,
    includeProfileContext: false,
    includeWorkspaceInstructions: false,
    embeddingsProvider: "openai"
  })

  const handleNewChat = () => {
    setChatMessages([])
    setUserInput("")
    setAttachments([])
    setIsGenerating(false)
  }

  const handleStopMessage = () => {
    abortController?.abort()
  }

  const handleAttachFiles = async (files: FileList | null) => {
    if (!files || isGenerating) return

    const readableFiles = await Promise.all(
      Array.from(files).map(async file => {
        const content = await file.text()

        return {
          id: crypto.randomUUID(),
          name: file.name,
          content: content.slice(0, 12000)
        }
      })
    )

    setAttachments(prev => [...prev, ...readableFiles])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(file => file.id !== id))
  }

  const handleSendMessage = async (messageContent: string) => {
    if (isGenerating) return
    if (!messageContent.trim()) return

    const userMessage: DefaultChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageContent
    }
    const assistantMessage: DefaultChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: ""
    }

    try {
      setUserInput("")
      setIsGenerating(true)
      setChatMessages(prev => [...prev, userMessage, assistantMessage])

      const newAbortController = new AbortController()
      setAbortController(newAbortController)
      const fileContext =
        attachments.length > 0
          ? `\n\nUse the following attached file context when it is relevant. If the answer is not in the files, say so briefly.\n\n${attachments
              .map(file => `File: ${file.name}\n${file.content}`)
              .join("\n\n---\n\n")}`
          : ""

      const response = await fetch("/api/chat/default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatSettings,
          messages: [
            { role: "system", content: `${chatSettings.prompt}${fileContext}` },
            ...chatMessages.map(message => ({
              role: message.role,
              content: message.content
            })),
            { role: "user", content: messageContent }
          ]
        }),
        signal: newAbortController.signal
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          fullText += decoder.decode(value, { stream: true })
          setChatMessages(prev =>
            prev.map(message =>
              message.id === assistantMessage.id
                ? { ...message, content: fullText }
                : message
            )
          )
        }
      }
      setAttachments([])
    } catch (error) {
      setUserInput(messageContent)
      setChatMessages(prev =>
        prev.filter(message => message.id !== assistantMessage.id)
      )
      console.error("Error sending message:", error)
    } finally {
      setIsGenerating(false)
      setAbortController(null)
    }
  }

  return (
    <main className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[#0b0d12] text-zinc-100">
      <header className="shrink-0 border-b border-white/10 bg-[#0b0d12]/95 px-3 py-2.5 backdrop-blur sm:px-5 sm:py-3 md:px-6">
        <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="min-w-0" />

          <div className="truncate text-center text-sm font-semibold tracking-wide text-white">
            Alex
          </div>

          {chatMessages.length > 0 && (
            <button
              className="justify-self-end whitespace-nowrap rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:px-3"
              onClick={handleNewChat}
              type="button"
            >
              New chat
            </button>
          )}
        </div>
      </header>

      {chatMessages.length === 0 ? (
        <EmptyState />
      ) : (
        <DefaultChatMessages messages={chatMessages} />
      )}

      <div className="shrink-0 border-t border-white/10 bg-[#0b0d12]/95 pt-2.5 backdrop-blur sm:pt-3">
        <DefaultChatInput
          attachments={attachments}
          isGenerating={isGenerating}
          isTyping={isTyping}
          onAttachFiles={handleAttachFiles}
          onCompositionEnd={() => setIsTyping(false)}
          onCompositionStart={() => setIsTyping(true)}
          onInputChange={setUserInput}
          onRemoveAttachment={handleRemoveAttachment}
          onSendMessage={handleSendMessage}
          onStopMessage={handleStopMessage}
          userInput={userInput}
        />
      </div>
    </main>
  )
}
