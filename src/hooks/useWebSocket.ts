import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useWebSocket = () => {
    let socket: Socket | null = null;

    useEffect(() => {
        // Initialize socket connection
        socket = io(SOCKET_URL);

        // Connection event handlers
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const subscribeToTraining = useCallback((trainingId: string) => {
        if (socket) {
            socket.emit('subscribe_training', { trainingId });
        }
    }, []);

    const onTrainingUpdate = useCallback((callback: (data: any) => void) => {
        if (socket) {
            socket.on('training_update', callback);
        }
    }, []);

    return {
        subscribeToTraining,
        onTrainingUpdate,
    };
}; 