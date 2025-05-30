"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Table, Plus, Trash2, Save } from "lucide-react"

interface DataEntry {
  id: number
  instruction: string
  input: string
  response: string
}

export function UploadDataset() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([{ id: 1, instruction: "", input: "", response: "" }])
  const [textData, setTextData] = useState("")
  const [dataSource, setDataSource] = useState<"upload" | "manual">("upload")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Mock preview data
      setPreviewData([
        {
          id: 1,
          instruction: "What is machine learning?",
          input: "Explain in simple terms",
          response: "Machine learning is a subset of AI...",
        },
        {
          id: 2,
          instruction: "Explain neural networks",
          input: "Basic explanation",
          response: "Neural networks are computing systems...",
        },
        {
          id: 3,
          instruction: "What is deep learning?",
          input: "Simple definition",
          response: "Deep learning is a subset of machine learning...",
        },
      ])
    }
  }

  const addDataEntry = () => {
    const newId = Math.max(...dataEntries.map((entry) => entry.id)) + 1
    setDataEntries([...dataEntries, { id: newId, instruction: "", input: "", response: "" }])
  }

  const removeDataEntry = (id: number) => {
    if (dataEntries.length > 1) {
      setDataEntries(dataEntries.filter((entry) => entry.id !== id))
    }
  }

  const updateDataEntry = (id: number, field: keyof DataEntry, value: string) => {
    setDataEntries(dataEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const saveManualData = () => {
    console.log("Saving manual data:", dataEntries)
    // Here you would save the data to your backend
  }

  const saveTextData = () => {
    console.log("Saving text data:", textData)
    // Here you would save the text data to your backend
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dataset Management</h1>
        <p className="text-gray-400">Upload or create your training data for fine-tuning</p>
      </div>

      {/* Data Source Selection */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Data Source</CardTitle>
          <CardDescription className="text-gray-400">Choose how you want to provide your training data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={dataSource === "upload" ? "default" : "outline"}
              onClick={() => setDataSource("upload")}
              className={
                dataSource === "upload"
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"
              }
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button
              variant={dataSource === "manual" ? "default" : "outline"}
              onClick={() => setDataSource("manual")}
              className={
                dataSource === "manual"
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Manual Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tabular" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="tabular" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Table className="w-4 h-4 mr-2" />
            Tabular
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tabular" className="space-y-6">
          {dataSource === "upload" ? (
            <>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Upload Tabular Data</CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload CSV or XLSX files containing your training data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="text-white">
                      Choose File
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileUpload}
                        className="bg-gray-800 border-gray-700 text-white file:bg-orange-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
                      />
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <p className="text-white font-medium">File: {uploadedFile.name}</p>
                      <p className="text-gray-400 text-sm">Size: {(uploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {previewData.length > 0 && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Data Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-3 text-orange-400 font-medium">ID</th>
                            <th className="text-left p-3 text-orange-400 font-medium">Instruction</th>
                            <th className="text-left p-3 text-orange-400 font-medium">Input</th>
                            <th className="text-left p-3 text-orange-400 font-medium">Response</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row) => (
                            <tr key={row.id} className="border-b border-gray-800">
                              <td className="p-3 text-gray-300">{row.id}</td>
                              <td className="p-3 text-gray-300 max-w-xs truncate">{row.instruction}</td>
                              <td className="p-3 text-gray-300 max-w-xs truncate">{row.input}</td>
                              <td className="p-3 text-gray-300 max-w-xs truncate">{row.response}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Manual Data Entry</CardTitle>
                    <CardDescription className="text-gray-400">
                      Create training data with instruction, input, and response format
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addDataEntry} className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Entry
                    </Button>
                    <Button
                      onClick={saveManualData}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Data
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {dataEntries.map((entry, index) => (
                    <div key={entry.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium">Entry #{index + 1}</h4>
                        {dataEntries.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDataEntry(entry.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <Label className="text-gray-300 text-sm">Instruction</Label>
                          <Input
                            value={entry.instruction}
                            onChange={(e) => updateDataEntry(entry.id, "instruction", e.target.value)}
                            placeholder="What task should the model perform?"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-gray-300 text-sm">Input</Label>
                          <Input
                            value={entry.input}
                            onChange={(e) => updateDataEntry(entry.id, "input", e.target.value)}
                            placeholder="Input context or question"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-gray-300 text-sm">Response</Label>
                          <Textarea
                            value={entry.response}
                            onChange={(e) => updateDataEntry(entry.id, "response", e.target.value)}
                            placeholder="Expected model response"
                            className="bg-gray-700 border-gray-600 text-white h-20 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          {dataSource === "upload" ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Upload Text Data</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload TXT or MD files containing your training text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-file-upload" className="text-white">
                    Choose File
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="text-file-upload"
                      type="file"
                      accept=".txt,.md"
                      className="bg-gray-800 border-gray-700 text-white file:bg-orange-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
                    />
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Text Preview</Label>
                  <div className="h-64 p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-auto">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Your uploaded text content will appear here for preview...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Manual Text Entry</CardTitle>
                    <CardDescription className="text-gray-400">Enter your training text directly</CardDescription>
                  </div>
                  <Button onClick={saveTextData} className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Text
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-white">Training Text</Label>
                  <Textarea
                    value={textData}
                    onChange={(e) => setTextData(e.target.value)}
                    placeholder="Enter your training text here. You can include multiple examples, conversations, or any text data you want to use for fine-tuning..."
                    className="h-80 bg-gray-800 border-gray-700 text-white resize-none"
                  />
                  <p className="text-gray-400 text-sm">
                    Characters: {textData.length} | Words:{" "}
                    {textData.split(/\s+/).filter((word) => word.length > 0).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
