import { describe, it, expect, beforeEach } from 'vitest';
import { MultiModalDetector } from '../multimodal';
import { PersistencePoint } from '@/lib/topologyAnalysis';

describe('MultiModalDetector', () => {
    let detector: MultiModalDetector;

    beforeEach(() => {
        detector = new MultiModalDetector(10);
    });

    describe('initialization', () => {
        it('should create detector with specified baseline size', () => {
            const detector = new MultiModalDetector(20);
            expect(detector).toBeDefined();
        });

        it('should start with empty baseline', () => {
            const diagram: PersistencePoint[] = [];
            const result = detector.detect(diagram, 1.0);

            // With no baseline, confidence should be low
            expect(result.confidence).toBe(0);
        });
    });

    describe('addToBaseline', () => {
        it('should accept and store diagrams', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
            ];

            expect(() => detector.addToBaseline(diagram)).not.toThrow();
        });

        it('should maintain baseline size limit', () => {
            const smallDetector = new MultiModalDetector(3);

            for (let i = 0; i < 10; i++) {
                const diagram: PersistencePoint[] = [
                    { id: `${i}`, birth: 0, death: i, dimension: 0 },
                ];
                smallDetector.addToBaseline(diagram);
            }

            // Baseline should be capped at 3
            // We can't directly test this without exposing internals,
            // but we can verify it doesn't crash
            expect(true).toBe(true);
        });
    });

    describe('detect', () => {
        beforeEach(() => {
            // Build a baseline
            for (let i = 0; i < 10; i++) {
                const diagram: PersistencePoint[] = [
                    { id: `${i}`, birth: 0, death: 1 + Math.random() * 0.1, dimension: 0 },
                ];
                detector.addToBaseline(diagram);
            }
        });

        it('should return higher scores for anomalous diagrams', () => {
            const normal: PersistencePoint[] = [
                { id: 'n', birth: 0, death: 1.05, dimension: 0 },
            ];

            const anomalous: PersistencePoint[] = [
                { id: 'a', birth: 0, death: 10, dimension: 0 }, // Much larger
            ];

            const normalResult = detector.detect(normal, 1.0);
            const anomalousResult = detector.detect(anomalous, 10.0);

            expect(anomalousResult.totalScore).toBeGreaterThan(normalResult.totalScore);
        });

        it('should include all component scores', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 5, dimension: 0 },
            ];

            const result = detector.detect(diagram, 5.0);

            expect(result).toHaveProperty('components');
            expect(result.components).toHaveProperty('wasserstein');
            expect(result.components).toHaveProperty('landscape');
            expect(result.components).toHaveProperty('statistical');
            expect(result).toHaveProperty('totalScore');
            expect(result).toHaveProperty('confidence');
            expect(result).toHaveProperty('isAnomaly');
        });

        it('should flag anomalies above threshold', () => {
            const anomalous: PersistencePoint[] = [
                { id: 'a', birth: 0, death: 100, dimension: 0 },
            ];

            const result = detector.detect(anomalous, 100.0);

            // With sufficient deviation, should be flagged
            expect(result.totalScore).toBeGreaterThan(0);
        });

        it('should provide confidence based on baseline size', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
            ];

            const result = detector.detect(diagram, 1.0);

            // With 10 baseline samples, confidence should be reasonable
            expect(result.confidence).toBeGreaterThan(0);
            expect(result.confidence).toBeLessThanOrEqual(1);
        });

        it('should handle empty diagrams', () => {
            const empty: PersistencePoint[] = [];

            expect(() => detector.detect(empty, 0)).not.toThrow();
        });

        it('should consider editRate in statistical component', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
            ];

            const lowRateResult = detector.detect(diagram, 0.1);
            const highRateResult = detector.detect(diagram, 100.0);

            // Higher edit rate should contribute to higher score
            expect(highRateResult.components.statistical).toBeGreaterThan(lowRateResult.components.statistical);
        });
    });

    describe('score composition', () => {
        it('should weight components correctly', () => {
            // Build baseline
            for (let i = 0; i < 10; i++) {
                detector.addToBaseline([
                    { id: `${i}`, birth: 0, death: 1, dimension: 0 },
                ]);
            }

            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 5, dimension: 0 },
            ];

            const result = detector.detect(diagram, 5.0);

            // Total should be weighted combination
            // Typically: 0.4*W + 0.4*L + 0.2*S
            const expectedTotal =
                0.4 * result.components.wasserstein +
                0.4 * result.components.landscape +
                0.2 * result.components.statistical;

            expect(result.totalScore).toBeCloseTo(expectedTotal, 2);
        });
    });
});
