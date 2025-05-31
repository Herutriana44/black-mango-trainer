export interface HealthResponse {
    status: string;
    message: string;
}

export interface UploadResponse {
    success: boolean;
    fileId: string;
    message: string;
}

export interface TrainingConfig {
    modelType: string;
    epochs: number;
    [key: string]: any;
}

export interface TrainingResponse {
    success: boolean;
    trainingId: string;
    message: string;
}

export interface TrainingStatus {
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    currentEpoch: number;
    totalEpochs: number;
    metrics?: {
        loss: number;
        accuracy: number;
        [key: string]: number;
    };
    message?: string;
} 