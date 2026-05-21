import { IconLoader2 } from "@tabler/icons-react"

export default function Loading() {
  return (
    <div className="bg-background flex size-full flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="border-border bg-card flex size-12 items-center justify-center rounded-lg border shadow-sm">
          <IconLoader2 className="text-muted-foreground size-5 animate-spin" />
        </div>

        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">Loading Alex</p>
          <p className="text-muted-foreground text-xs">
            Setting up your workspace
          </p>
        </div>
      </div>
    </div>
  )
}
