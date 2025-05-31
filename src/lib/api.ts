import axios from 'axios';
import {
    HealthResponse,
    UploadResponse,
    TrainingConfig,
    TrainingResponse,
    TrainingStatus,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Health check
export const checkHealth = async (): Promise<HealthResponse> => {
    try {
        const response = await api.get<HealthResponse>('/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};

// Upload related functions
export const uploadFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('File upload failed:', error);
        throw error;
    }
};

// Model related functions
export const getModels = async () => {
    try {
        const response = await api.get('/models');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch models:', error);
        throw error;
    }
};

// Training related functions
export const startTraining = async (config: TrainingConfig): Promise<TrainingResponse> => {
    try {
        const response = await api.post<TrainingResponse>('/training/start', config);
        return response.data;
    } catch (error) {
        console.error('Failed to start training:', error);
        throw error;
    }
};

// Monitor related functions
export const getTrainingStatus = async (trainingId: string): Promise<TrainingStatus> => {
    try {
        const response = await api.get<TrainingStatus>(`/monitor/${trainingId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to get training status:', error);
        throw error;
    }
};

// Export related functions
export const exportModel = async (modelId: string) => {
    try {
        const response = await api.get(`/export/${modelId}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Failed to export model:', error);
        throw error;
    }
}; 