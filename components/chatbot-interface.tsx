"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Settings, Trash2, Download } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your fine-tuned model. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modelStatus, setModelStatus] = useState<"online" | "offline" | "loading">("online")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate API call to your fine-tuned model
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `I understand you're asking about "${inputMessage}". This is a response from your fine-tuned model. The model has been trained on your specific dataset and should provide relevant responses based on that training.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "Hello! I'm your fine-tuned model. How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }

  const exportChat = () => {
    const chatData = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    }))

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Chatbot Interface</h1>
        <p className="text-gray-400">Test and interact with your fine-tuned model</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-3 bg-gray-900 border-gray-800 h-[600px] flex flex-col">
          <CardHeader className="border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-orange-400" />
                  Fine-Tuned Model Chat
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Interact with your trained model in real-time
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    modelStatus === "online"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : modelStatus === "offline"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}
                >
                  {modelStatus === "online" ? "● Online" : modelStatus === "offline" ? "● Offline" : "● Loading"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={exportChat} className="text-gray-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-400 hover:text-white">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-gray-800 p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled={isLoading || modelStatus === "offline"}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading || modelStatus === "offline"}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Settings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Chat Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Model Temperature</label>
                <Input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="0.7"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Max Tokens</label>
                <Input
                  type="number"
                  min="1"
                  max="4096"
                  defaultValue="512"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Top P</label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.9"
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">System Prompt</label>
                <textarea
                  className="w-full h-20 mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm resize-none"
                  placeholder="You are a helpful assistant..."
                  defaultValue="You are a helpful assistant trained on specific data."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Messages</span>
                  <span className="text-white">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tokens Used</span>
                  <span className="text-white">
                    ~{messages.reduce((acc, msg) => acc + msg.content.length, 0) * 0.75}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">1.2s avg</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
