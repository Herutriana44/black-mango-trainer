"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "../components/sidebar"
import { UploadDataset } from "../components/upload-dataset"
import { FineTuningSettings } from "../components/finetuning-settings"
import { Monitoring } from "../components/monitoring"
import { ExportDeploy } from "../components/export-deploy"
import { ChatbotInterface } from "../components/chatbot-interface"
import { checkHealth, uploadFile, startTraining, getTrainingStatus } from '../src/lib/api'
import { useWebSocket } from '../src/hooks/useWebSocket'
import { HealthResponse, TrainingStatus } from '../src/types/api'

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload")
  const [health, setHealth] = useState<string>("Checking...")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null)
  const { subscribeToTraining, onTrainingUpdate } = useWebSocket()

  useEffect(() => {
    // Check backend health on component mount
    checkHealth()
      .then((response: HealthResponse) => setHealth(response.status))
      .catch((error: Error) => setHealth("Error: " + error.message))
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      const response = await uploadFile(selectedFile)
      console.log("Upload successful:", response)
      // Handle successful upload
    } catch (error) {
      console.error("Upload failed:", error)
      // Handle upload error
    }
  }

  const handleStartTraining = async () => {
    try {
      const response = await startTraining({
        modelType: "default",
        epochs: 10,
        batchSize: 4,
        learningRate: 2e-4,
        maxGradNorm: 0.3,
        warmupRatio: 0.03,
        loggingSteps: 10,
        validationSplit: 0.1,
        finetuneType: "lora",
        loraR: 16,
        loraAlpha: 32,
        loraDropout: 0.05,
        targetModules: ["q_proj", "v_proj"]
      })
      console.log("Training started:", response)

      // Subscribe to training updates
      if (response.trainingId) {
        subscribeToTraining(response.trainingId)
        onTrainingUpdate((data: TrainingStatus) => {
          setTrainingStatus(data)
        })
      }
    } catch (error) {
      console.error("Failed to start training:", error)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <UploadDataset />
      case "training":
        return <FineTuningSettings />
      case "monitor":
        return <Monitoring />
      case "export":
        return <ExportDeploy />
      case "chatbot":
        return <ChatbotInterface />
      default:
        return <UploadDataset />
    }
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8">Model Training Dashboard</h1>

          <div className="mb-8">
            <h2 className="text-2xl mb-4">Backend Status</h2>
            <p>Status: {health}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl mb-4">Upload Dataset</h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-4"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              Upload
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl mb-4">Training</h2>
            <button
              onClick={handleStartTraining}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Start Training
            </button>

            {trainingStatus && (
              <div className="mt-4">
                <h3 className="text-xl mb-2">Training Status</h3>
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify(trainingStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  )
}
