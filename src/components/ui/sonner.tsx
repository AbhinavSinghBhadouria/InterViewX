"use client"

import type { CSSProperties } from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "border border-blue-400/45 bg-gradient-to-r from-[#04070f] via-[#0a1633] to-[#0f2f72] text-blue-50 shadow-[0_0_22px_rgba(37,99,235,0.45)] backdrop-blur-md",
          title: "font-semibold text-blue-100",
          description: "text-blue-200/90",
          closeButton:
            "border-blue-400/50 bg-[#0a1633] text-blue-100 hover:bg-[#0f2f72]",
          actionButton:
            "bg-blue-600 text-white hover:bg-blue-500",
          cancelButton:
            "bg-[#1e293b] text-blue-100 hover:bg-[#334155]",
          success: "border-blue-400/55",
          error: "border-blue-500/55",
          warning: "border-blue-300/55",
          info: "border-cyan-400/55",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "rgba(6, 12, 28, 0.97)",
          "--normal-text": "rgb(219 234 254)",
          "--normal-border": "rgba(96, 165, 250, 0.5)",
          "--success-bg": "rgba(10, 25, 56, 0.97)",
          "--success-border": "rgba(59, 130, 246, 0.55)",
          "--error-bg": "rgba(18, 35, 74, 0.97)",
          "--error-border": "rgba(37, 99, 235, 0.6)",
          "--warning-bg": "rgba(14, 30, 67, 0.97)",
          "--warning-border": "rgba(96, 165, 250, 0.6)",
          "--info-bg": "rgba(8, 47, 73, 0.97)",
          "--info-border": "rgba(56, 189, 248, 0.55)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
