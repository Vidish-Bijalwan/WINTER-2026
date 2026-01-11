// TDA Computation Worker
// Offloads heavy topological analysis to a background thread
// to keep the main UI thread responsive (60fps)

import { computePersistenceDiagram } from '../lib/topologyAnalysis';
import { MultiModalDetector } from '../lib/tda/multimodal';
import { WikipediaEvent } from '../hooks/useWikipediaStream';

// State within the worker
let detector: MultiModalDetector | null = null;

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'INIT') {
        detector = new MultiModalDetector(payload.windowSize || 50);
        self.postMessage({ type: 'INIT_COMPLETE' });
    } else if (type === 'ANALYZE') {
        if (!detector) {
            detector = new MultiModalDetector(50);
        }

        const { events, windowMs } = payload;
        const startTime = performance.now();

        try {
            // 1. Compute Persistence Diagram
            const diagram = computePersistenceDiagram(events, windowMs);

            // 2. Update Baseline (randomly sample for baseline)
            if (Math.random() < 0.1) {
                detector.addToBaseline(diagram);
            }

            // 3. Detect Anomalies
            const editRate = events.length / (windowMs / 1000);
            const score = detector.detect(diagram, editRate);

            const endTime = performance.now();

            self.postMessage({
                type: 'RESULT',
                payload: {
                    score,
                    diagram,
                    processingTime: endTime - startTime
                }
            });
        } catch (error) {
            console.error('TDA Worker Error:', error);
            self.postMessage({
                type: 'ERROR',
                payload: { message: (error as Error).message }
            });
        }
    }
};
