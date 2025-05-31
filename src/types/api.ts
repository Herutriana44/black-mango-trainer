export interface HealthResponse {
    status: string;
    version: string;
}

export interface UploadResponse {
    success: boolean;
    fileId: string;
    message: string;
}

export interface TrainingConfig {
    modelType: string;
    epochs: number;
    batchSize: number;
    learningRate: number;
    maxGradNorm: number;
    warmupRatio: number;
    loggingSteps: number;
    validationSplit: number;
    finetuneType: 'lora' | 'qlora' | 'full';
    loraR?: number;
    loraAlpha?: number;
    loraDropout?: number;
    targetModules?: string[];
}

export interface TrainingResponse {
    success: boolean;
    trainingId: string;
    message: string;
}

export interface TrainingStatus {
    status: 'idle' | 'running' | 'completed' | 'failed';
    progress: number;
    currentEpoch: number;
    totalEpochs: number;
    message?: string;
    metrics?: {
        loss: number;
        accuracy: number;
    };
} 