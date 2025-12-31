import { useEffect, useRef, useState, useCallback } from 'react';

export interface AnalysisResult {
    betti_numbers: { h0: number; h1: number; h2: number };
    anomaly_score: number;
    is_anomaly: boolean;
    window_size: number;
}

export interface TopoForgeResponse {
    type: 'analysis';
    data: AnalysisResult;
    original_event: any;
}

export function useTopoForge(url: string = 'ws://localhost:8000/ws/stream') {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;

        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('[TopoForge] Connected to AI Core');
            setIsConnected(true);
        };

        ws.current.onclose = () => {
            console.log('[TopoForge] Disconnected from AI Core');
            setIsConnected(false);
            // Auto-reconnect after 3s if component is still mounted
            setTimeout(() => {
                if (ws.current?.readyState === WebSocket.CLOSED) {
                    connect();
                }
            }, 3000);
        };

        ws.current.onmessage = (event) => {
            try {
                const response: TopoForgeResponse = JSON.parse(event.data);
                if (response.type === 'analysis') {
                    setLastAnalysis(response.data);
                }
            } catch (e) {
                console.error('[TopoForge] Failed to parse message', e);
            }
        };
    }, [url]);

    useEffect(() => {
        connect();
        return () => {
            if (ws.current) {
                ws.current.onclose = null; // Prevent reconnect on unmount
                ws.current.close();
            }
        };
    }, [connect]);

    const sendEvent = useCallback((event: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(event));
        }
    }, []);

    return { isConnected, lastAnalysis, sendEvent };
}
