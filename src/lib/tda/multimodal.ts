// Multi-Modal Anomaly Detection
// Combines Topological Data Analysis (TDA) with statistical methods
// for robust anomaly detection with reduced false positives

import { PersistencePoint } from '../topologyAnalysis';
import { computeWassersteinDistance } from './wasserstein';
import { computePersistenceLandscapes, computeLandscapeNorm } from './landscapes';

export interface AnomalyScore {
    totalScore: number;
    components: {
        wasserstein: number;
        landscape: number;
        statistical: number;
    };
    isAnomaly: boolean;
    confidence: number;
}

export class MultiModalDetector {
    private baselineDiagrams: PersistencePoint[][] = [];
    private baselineLandscapes: number[] = []; // Norms
    private windowSize: number = 50;
    private threshold: number = 3.0; // Z-score threshold

    constructor(windowSize: number = 50) {
        this.windowSize = windowSize;
    }

    /**
     * Updates the baseline with a new "normal" diagram
     */
    addToBaseline(diagram: PersistencePoint[]) {
        if (this.baselineDiagrams.length >= this.windowSize) {
            this.baselineDiagrams.shift();
            this.baselineLandscapes.shift();
        }
        this.baselineDiagrams.push(diagram);

        // Compute landscape norm for this diagram
        const landscapes = computePersistenceLandscapes(diagram, 1, 50);
        const norm = landscapes.length > 0 ? computeLandscapeNorm(landscapes[0]) : 0;
        this.baselineLandscapes.push(norm);
    }

    /**
     * Detects anomalies in a new diagram by comparing against baseline
     * using multiple modalities (Wasserstein distance, Landscape norms, Statistical)
     */
    detect(currentDiagram: PersistencePoint[], rawDataMean?: number): AnomalyScore {
        if (this.baselineDiagrams.length < 5) {
            // Not enough data for baseline
            return {
                totalScore: 0,
                components: { wasserstein: 0, landscape: 0, statistical: 0 },
                isAnomaly: false,
                confidence: 0
            };
        }

        // 1. Wasserstein Distance Component
        // Compare current diagram to the average/median of recent baseline diagrams
        // For speed, just compare to the last few
        const recentBaseline = this.baselineDiagrams.slice(-5);
        let avgWasserstein = 0;
        for (const base of recentBaseline) {
            avgWasserstein += computeWassersteinDistance(currentDiagram, base);
        }
        avgWasserstein /= recentBaseline.length;

        // 2. Landscape Norm Component
        const landscapes = computePersistenceLandscapes(currentDiagram, 1, 50);
        const currentNorm = landscapes.length > 0 ? computeLandscapeNorm(landscapes[0]) : 0;

        // Calculate Z-score of landscape norm
        const meanNorm = this.baselineLandscapes.reduce((a, b) => a + b, 0) / this.baselineLandscapes.length;
        const stdNorm = Math.sqrt(
            this.baselineLandscapes.map(x => Math.pow(x - meanNorm, 2)).reduce((a, b) => a + b, 0) /
            this.baselineLandscapes.length
        ) || 1; // Avoid div by zero

        const landscapeZ = Math.abs((currentNorm - meanNorm) / stdNorm);

        // 3. Statistical Component (Placeholder if raw data stats not provided)
        // In a real system, we'd check if raw data values are outliers
        const statisticalScore = rawDataMean ? Math.abs(rawDataMean) : 0; // Simplified

        // Combine scores (Weighted average or Max)
        // We normalize Wasserstein roughly to Z-scale
        const wassersteinScore = avgWasserstein * 10; // Scaling factor (heuristic)

        const totalScore = (wassersteinScore * 0.4) + (landscapeZ * 0.4) + (statisticalScore * 0.2);

        // Determine anomaly
        // Adaptive threshold could be implemented here
        const isAnomaly = totalScore > this.threshold;

        // Calculate confidence (0-1)
        // Higher score = higher confidence
        const confidence = Math.min(1, Math.max(0, (totalScore - this.threshold) / 2 + 0.5));

        return {
            totalScore,
            components: {
                wasserstein: wassersteinScore,
                landscape: landscapeZ,
                statistical: statisticalScore
            },
            isAnomaly,
            confidence: isAnomaly ? confidence : 0
        };
    }
}
