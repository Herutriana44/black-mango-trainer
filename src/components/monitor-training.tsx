'use client';

import { useState, useEffect } from 'react';
import { getTrainingStatus } from '@/lib/api';
import { TrainingStatus } from '@/types/api';

export function MonitorTraining() {
    const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await getTrainingStatus('current');
                setTrainingStatus(response);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch training status');
                console.error('Error fetching training status:', err);
            }
        };

        // Fetch status immediately
        fetchStatus();

        // Set up polling every 5 seconds
        const interval = setInterval(fetchStatus, 5000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="p-6">
                <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    if (!trainingStatus) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Training Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Progress</h3>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-500 h-2.5 rounded-full"
                                style={{ width: `${trainingStatus.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                            {trainingStatus.progress.toFixed(1)}% complete
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Current Epoch</h3>
                        <p className="text-2xl font-bold">
                            {trainingStatus.currentEpoch} / {trainingStatus.totalEpochs}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Status</h3>
                        <p className={`text-lg font-medium ${trainingStatus.status === 'running' ? 'text-green-500' :
                            trainingStatus.status === 'completed' ? 'text-blue-500' :
                                trainingStatus.status === 'failed' ? 'text-red-500' :
                                    'text-yellow-500'
                            }`}>
                            {trainingStatus.status.charAt(0).toUpperCase() + trainingStatus.status.slice(1)}
                        </p>
                    </div>

                    {trainingStatus.metrics && (
                        <div>
                            <h3 className="text-lg font-medium mb-2">Metrics</h3>
                            <div className="space-y-2">
                                <p>Loss: {trainingStatus.metrics.loss.toFixed(4)}</p>
                                <p>Accuracy: {(trainingStatus.metrics.accuracy * 100).toFixed(2)}%</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {trainingStatus.message && (
                <div className="mt-6 p-4 bg-gray-800 rounded">
                    <h3 className="text-lg font-medium mb-2">Message</h3>
                    <p className="text-gray-300">{trainingStatus.message}</p>
                </div>
            )}
        </div>
    );
} 