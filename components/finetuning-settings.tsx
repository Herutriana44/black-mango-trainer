"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Eye, EyeOff, Play } from "lucide-react"

export function FineTuningSettings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [epochs, setEpochs] = useState([3])
  const [batchSize, setBatchSize] = useState([4])
  const [learningRate, setLearningRate] = useState([0.0001])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Fine-Tuning Settings</h1>
        <p className="text-gray-400">Configure your model and training parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Model Configuration</CardTitle>
            <CardDescription className="text-gray-400">Set up your Hugging Face model and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">HuggingFace Repo URL</Label>
              <Input placeholder="microsoft/DialoGPT-medium" className="bg-gray-800 border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">HuggingFace API Key</Label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="bg-gray-800 border-gray-700 text-white pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Fine-Tuning Method</Label>
              <Select defaultValue="lora">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="full" className="text-white hover:bg-gray-700">
                    Full Fine-Tuning
                  </SelectItem>
                  <SelectItem value="lora" className="text-white hover:bg-gray-700">
                    LoRA
                  </SelectItem>
                  <SelectItem value="qlora" className="text-white hover:bg-gray-700">
                    QLoRA
                  </SelectItem>
                  <SelectItem value="sft" className="text-white hover:bg-gray-700">
                    SFT (Supervised Fine-Tuning)
                  </SelectItem>
                  <SelectItem value="dpo" className="text-white hover:bg-gray-700">
                    DPO (Direct Preference Optimization)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Training Hyperparameters</CardTitle>
            <CardDescription className="text-gray-400">Adjust training parameters for optimal results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-white">Epochs</Label>
                <span className="text-orange-400 font-medium">{epochs[0]}</span>
              </div>
              <Slider
                value={epochs}
                onValueChange={setEpochs}
                max={10}
                min={1}
                step={1}
                className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-white">Batch Size</Label>
                <span className="text-orange-400 font-medium">{batchSize[0]}</span>
              </div>
              <Slider
                value={batchSize}
                onValueChange={setBatchSize}
                max={32}
                min={1}
                step={1}
                className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-white">Learning Rate</Label>
                <span className="text-orange-400 font-medium">{learningRate[0]}</span>
              </div>
              <Slider
                value={learningRate}
                onValueChange={setLearningRate}
                max={0.001}
                min={0.00001}
                step={0.00001}
                className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Cutoff Sequence Length</Label>
              <Input type="number" defaultValue="512" className="bg-gray-800 border-gray-700 text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Optimizer</Label>
                <Select defaultValue="adamw">
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="adamw" className="text-white hover:bg-gray-700">
                      AdamW
                    </SelectItem>
                    <SelectItem value="adam" className="text-white hover:bg-gray-700">
                      Adam
                    </SelectItem>
                    <SelectItem value="sgd" className="text-white hover:bg-gray-700">
                      SGD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Scheduler</Label>
                <Select defaultValue="linear">
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="linear" className="text-white hover:bg-gray-700">
                      Linear
                    </SelectItem>
                    <SelectItem value="cosine" className="text-white hover:bg-gray-700">
                      Cosine
                    </SelectItem>
                    <SelectItem value="constant" className="text-white hover:bg-gray-700">
                      Constant
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-3">
            <Play className="w-5 h-5 mr-2" />
            Start Fine-Tuning
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
