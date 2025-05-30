"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Settings, Activity, Rocket, Brain, MessageSquare } from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: "upload", label: "Upload Dataset", icon: Upload },
  { id: "prompt", label: "Prompt Template", icon: FileText },
  { id: "settings", label: "Fine-Tuning Settings", icon: Settings },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "chatbot", label: "Chatbot Interface", icon: MessageSquare },
  { id: "export", label: "Export & Deploy", icon: Rocket },
]

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LLM Tuner</h1>
            <p className="text-sm text-gray-400">Fine-tuning Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 text-left",
                  activeTab === item.id
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-800",
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
