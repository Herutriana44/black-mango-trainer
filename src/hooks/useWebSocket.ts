import { useEffect, useCallback } from 'react';
import { TrainingStatus } from '../types/api';

type TrainingUpdateCallback = (data: TrainingStatus) => void;

export function useWebSocket() {
    const subscribeToTraining = useCallback((trainingId: string) => {
        // TODO: Implement WebSocket connection
        console.log('Subscribing to training updates:', trainingId);
    }, []);

    const onTrainingUpdate = useCallback((callback: TrainingUpdateCallback) => {
        // TODO: Implement WebSocket event listener
        console.log('Setting up training update callback');
    }, []);

    return {
        subscribeToTraining,
        onTrainingUpdate,
    };
} 