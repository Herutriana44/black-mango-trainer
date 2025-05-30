"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Copy } from "lucide-react"

const promptTemplates = {
  instruction: `### Instruction:
{instruction}

### Response:
{response}`,
  conversational: `<|im_start|>user
{user_message}<|im_end|>
<|im_start|>assistant
{assistant_message}<|im_end|>`,
  translational: `Translate the following text from {source_language} to {target_language}:

Source: {source_text}
Translation: {translation}`,
}

export function PromptTemplate() {
  const [selectedFormat, setSelectedFormat] = useState("instruction")
  const [customPrompt, setCustomPrompt] = useState(promptTemplates.instruction)

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format)
    setCustomPrompt(promptTemplates[format as keyof typeof promptTemplates])
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Prompt Template</h1>
        <p className="text-gray-400">Configure the prompt format for your fine-tuning task</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Template Format</CardTitle>
            <CardDescription className="text-gray-400">Choose a pre-defined template format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Format Type</Label>
              <Select value={selectedFormat} onValueChange={handleFormatChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="instruction" className="text-white hover:bg-gray-700">
                    Instruction Tuning
                  </SelectItem>
                  <SelectItem value="conversational" className="text-white hover:bg-gray-700">
                    Conversational Tuning
                  </SelectItem>
                  <SelectItem value="translational" className="text-white hover:bg-gray-700">
                    Translational Tuning
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-medium">Template Variables</h4>
              <div className="space-y-2 text-sm">
                {selectedFormat === "instruction" && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{instruction}"}</span>
                      <span className="text-gray-400">- The input instruction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{response}"}</span>
                      <span className="text-gray-400">- The expected response</span>
                    </div>
                  </>
                )}
                {selectedFormat === "conversational" && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{user_message}"}</span>
                      <span className="text-gray-400">- User's message</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{assistant_message}"}</span>
                      <span className="text-gray-400">- Assistant's response</span>
                    </div>
                  </>
                )}
                {selectedFormat === "translational" && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{source_language}"}</span>
                      <span className="text-gray-400">- Source language</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{target_language}"}</span>
                      <span className="text-gray-400">- Target language</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{source_text}"}</span>
                      <span className="text-gray-400">- Text to translate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-mono">{"{translation}"}</span>
                      <span className="text-gray-400">- Translation result</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Prompt Editor</CardTitle>
            <CardDescription className="text-gray-400">Customize your prompt template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Template Content</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="h-64 bg-gray-800 border-gray-700 text-white font-mono text-sm resize-none"
                placeholder="Enter your custom prompt template..."
              />
            </div>

            <div className="flex gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Copy className="w-4 h-4 mr-2" />
                Copy Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
