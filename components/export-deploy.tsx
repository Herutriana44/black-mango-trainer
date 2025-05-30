"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Rocket, CheckCircle, ExternalLink, Copy, Download } from "lucide-react"

export function ExportDeploy() {
  const [isExported, setIsExported] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [endpointUrl, setEndpointUrl] = useState("")

  const handleExport = () => {
    // Simulate export process
    setTimeout(() => {
      setIsExported(true)
    }, 2000)
  }

  const handleDeploy = () => {
    // Simulate deployment process
    setTimeout(() => {
      setIsDeployed(true)
      setEndpointUrl("https://api-inference.huggingface.co/models/your-username/fine-tuned-model")
    }, 3000)
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Export & Deploy</h1>
        <p className="text-gray-400">Export your fine-tuned model and deploy it for inference</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Export to Hugging Face
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upload your fine-tuned model to Hugging Face Hub
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Hugging Face Token</Label>
              <Input
                type="password"
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Repository Name</Label>
              <Input placeholder="my-fine-tuned-model" className="bg-gray-800 border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Model Description</Label>
              <Textarea
                placeholder="A fine-tuned model for..."
                className="bg-gray-800 border-gray-700 text-white h-20 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleExport}
                disabled={isExported}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isExported ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Exported
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Export Model
                  </>
                )}
              </Button>

              {isExported && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Successfully exported</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Deploy as Endpoint
            </CardTitle>
            <CardDescription className="text-gray-400">Deploy your model as an API endpoint or chatbot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Deployment Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  API Endpoint
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Chatbot Interface
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleDeploy}
                disabled={!isExported || isDeployed}
                className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                {isDeployed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Deployed
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Model
                  </>
                )}
              </Button>

              {isDeployed && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live endpoint</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isDeployed && endpointUrl && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Deployment Successful
            </CardTitle>
            <CardDescription className="text-gray-400">Your model is now live and ready for inference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Endpoint URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={endpointUrl}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => navigator.clipboard.writeText(endpointUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open(endpointUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-lg font-bold text-green-400">Active</div>
                <div className="text-sm text-gray-400">Status</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-lg font-bold text-orange-400">0</div>
                <div className="text-sm text-gray-400">Requests/min</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-lg font-bold text-white">$0.00</div>
                <div className="text-sm text-gray-400">Cost today</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Model
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                View Logs
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                API Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
