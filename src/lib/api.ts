import axios from 'axios';
import {
    HealthResponse,
    UploadResponse,
    TrainingConfig,
    TrainingResponse,
    TrainingStatus,
} from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Health check
export async function checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
        throw new Error('Health check failed');
    }
    return response.json();
}

// Upload related functions
export async function uploadFile(file: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    return response.json();
}

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
export async function startTraining(config: TrainingConfig): Promise<{ trainingId: string }> {
    const response = await fetch(`${API_BASE_URL}/train`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
    });

    if (!response.ok) {
        throw new Error('Failed to start training');
    }

    return response.json();
}

// Monitor related functions
export async function getTrainingStatus(trainingId: string): Promise<TrainingStatus> {
    const response = await fetch(`${API_BASE_URL}/training/${trainingId}/status`);
    if (!response.ok) {
        throw new Error('Failed to get training status');
    }
    return response.json();
}

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