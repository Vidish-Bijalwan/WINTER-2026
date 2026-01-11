import { useState, useEffect, useRef } from 'react';
import { WikipediaEvent } from './useWikipediaStream';
import { PersistencePoint } from '../lib/topologyAnalysis';
import { AnomalyScore } from '../lib/tda/multimodal';

export interface AdvancedTDAStats {
    score: AnomalyScore;
    diagram: PersistencePoint[];
    processingTime: number;
}

export function useAdvancedTDA(events: WikipediaEvent[]) {
    const [stats, setStats] = useState<AdvancedTDAStats | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const lastProcessedRef = useRef<number>(0);
    const isProcessingRef = useRef<boolean>(false);

    useEffect(() => {
        // Initialize Worker
        workerRef.current = new Worker(new URL('../workers/tda.worker.ts', import.meta.url), {
            type: 'module'
        });

        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;

            if (type === 'RESULT') {
                setStats(payload);
                isProcessingRef.current = false;
            } else if (type === 'ERROR') {
                console.error('TDA Worker Error:', payload.message);
                isProcessingRef.current = false;
            }
        };

        workerRef.current.postMessage({ type: 'INIT', payload: { windowSize: 50 } });

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    useEffect(() => {
        // Process every 2 seconds
        const now = Date.now();
        if (now - lastProcessedRef.current < 2000 || isProcessingRef.current) return;

        if (events.length < 10) return;

        isProcessingRef.current = true;
        lastProcessedRef.current = now;

        // Send data to worker
        // Note: Structured clone algorithm handles Date objects correctly
        workerRef.current?.postMessage({
            type: 'ANALYZE',
            payload: {
                events,
                windowMs: 30000
            }
        });

    }, [events]);

    return stats;
}
