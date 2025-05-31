'use client';

import { useState } from 'react';
import { startTraining } from '@/lib/api';
import { TrainingConfig } from '@/types/api';

export function ModelTraining() {
    const [config, setConfig] = useState<TrainingConfig>({
        modelType: 'default',
        epochs: 3,
        batchSize: 4,
        learningRate: 2e-4,
        maxGradNorm: 0.3,
        warmupRatio: 0.03,
        loggingSteps: 10,
        validationSplit: 0.1,
        finetuneType: 'lora',
        loraR: 16,
        loraAlpha: 32,
        loraDropout: 0.05,
        targetModules: ['q_proj', 'v_proj']
    });

    const [isTraining, setIsTraining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: name === 'epochs' || name === 'batchSize' || name === 'loggingSteps' ||
                name === 'loraR' || name === 'loraAlpha' ? parseInt(value) :
                name === 'learningRate' || name === 'maxGradNorm' || name === 'warmupRatio' ||
                    name === 'validationSplit' || name === 'loraDropout' ? parseFloat(value) :
                    value
        }));
    };

    const handleStartTraining = async () => {
        try {
            setIsTraining(true);
            setError(null);
            const response = await startTraining(config);
            console.log('Training started:', response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start training');
            console.error('Training error:', err);
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Model Training Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Model Type</label>
                        <select
                            name="modelType"
                            value={config.modelType}
                            onChange={handleConfigChange}
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        >
                            <option value="default">Default</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Fine-tuning Type</label>
                        <select
                            name="finetuneType"
                            value={config.finetuneType}
                            onChange={handleConfigChange}
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        >
                            <option value="lora">LoRA</option>
                            <option value="qlora">QLoRA</option>
                            <option value="full">Full Fine-tuning</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Number of Epochs</label>
                        <input
                            type="number"
                            name="epochs"
                            value={config.epochs}
                            onChange={handleConfigChange}
                            min="1"
                            max="100"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Batch Size</label>
                        <input
                            type="number"
                            name="batchSize"
                            value={config.batchSize}
                            onChange={handleConfigChange}
                            min="1"
                            max="32"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Learning Rate</label>
                        <input
                            type="number"
                            name="learningRate"
                            value={config.learningRate}
                            onChange={handleConfigChange}
                            step="0.0001"
                            min="0.0001"
                            max="0.1"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Max Gradient Norm</label>
                        <input
                            type="number"
                            name="maxGradNorm"
                            value={config.maxGradNorm}
                            onChange={handleConfigChange}
                            step="0.1"
                            min="0.1"
                            max="1.0"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Warmup Ratio</label>
                        <input
                            type="number"
                            name="warmupRatio"
                            value={config.warmupRatio}
                            onChange={handleConfigChange}
                            step="0.01"
                            min="0"
                            max="0.5"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Validation Split</label>
                        <input
                            type="number"
                            name="validationSplit"
                            value={config.validationSplit}
                            onChange={handleConfigChange}
                            step="0.1"
                            min="0"
                            max="0.5"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>
                </div>
            </div>

            {(config.finetuneType === 'lora' || config.finetuneType === 'qlora') && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">LoRA Rank (r)</label>
                        <input
                            type="number"
                            name="loraR"
                            value={config.loraR}
                            onChange={handleConfigChange}
                            min="1"
                            max="64"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">LoRA Alpha</label>
                        <input
                            type="number"
                            name="loraAlpha"
                            value={config.loraAlpha}
                            onChange={handleConfigChange}
                            min="1"
                            max="64"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">LoRA Dropout</label>
                        <input
                            type="number"
                            name="loraDropout"
                            value={config.loraDropout}
                            onChange={handleConfigChange}
                            step="0.01"
                            min="0"
                            max="0.5"
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                    {error}
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={handleStartTraining}
                    disabled={isTraining}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isTraining ? 'Starting Training...' : 'Start Training'}
                </button>
            </div>
        </div>
    );
} 