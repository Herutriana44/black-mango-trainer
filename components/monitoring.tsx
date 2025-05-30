"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockLossData = [
  { epoch: 1, loss: 2.4 },
  { epoch: 2, loss: 1.8 },
  { epoch: 3, loss: 1.5 },
  { epoch: 4, loss: 1.2 },
  { epoch: 5, loss: 1.0 },
  { epoch: 6, loss: 0.9 },
  { epoch: 7, loss: 0.8 },
]

export function Monitoring() {
  const [progress, setProgress] = useState(65)
  const [currentEpoch, setCurrentEpoch] = useState(7)
  const [totalEpochs] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Training Monitoring</h1>
        <p className="text-gray-400">Monitor your fine-tuning progress in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Training Progress</CardTitle>
            <CardDescription className="text-gray-400">Overall completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-orange-400 font-medium">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-3 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-orange-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{currentEpoch}</div>
                <div className="text-sm text-gray-400">Current Epoch</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalEpochs}</div>
                <div className="text-sm text-gray-400">Total Epochs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">System Resources</CardTitle>
            <CardDescription className="text-gray-400">Memory and compute usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">GPU Memory</span>
                  <span className="text-orange-400">14.2 / 16.0 GB</span>
                </div>
                <Progress value={89} className="h-2 bg-gray-800 [&>div]:bg-orange-500" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">RAM Usage</span>
                  <span className="text-orange-400">24.1 / 32.0 GB</span>
                </div>
                <Progress value={75} className="h-2 bg-gray-800 [&>div]:bg-orange-500" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className="text-orange-400">45%</span>
                </div>
                <Progress value={45} className="h-2 bg-gray-800 [&>div]:bg-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Time Estimates</CardTitle>
            <CardDescription className="text-gray-400">Training time information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Elapsed Time</span>
                <span className="text-white font-medium">2h 34m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Time</span>
                <span className="text-orange-400 font-medium">1h 12m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Completion</span>
                <span className="text-white font-medium">15:42 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Epoch Time</span>
                <span className="text-white font-medium">22m 15s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Training Loss</CardTitle>
          <CardDescription className="text-gray-400">Loss progression over training epochs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="epoch" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={{ fill: "#F97316", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#F97316", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
