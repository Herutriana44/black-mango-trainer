"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { UploadDataset } from "@/components/upload-dataset"
import { PromptTemplate } from "@/components/prompt-template"
import { FineTuningSettings } from "@/components/finetuning-settings"
import { Monitoring } from "@/components/monitoring"
import { ExportDeploy } from "@/components/export-deploy"
import { ChatbotInterface } from "@/components/chatbot-interface"

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload")

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <UploadDataset />
      case "prompt":
        return <PromptTemplate />
      case "settings":
        return <FineTuningSettings />
      case "monitoring":
        return <Monitoring />
      case "chatbot":
        return <ChatbotInterface />
      case "export":
        return <ExportDeploy />
      default:
        return <UploadDataset />
    }
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}
