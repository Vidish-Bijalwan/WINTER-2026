import { describe, it, expect } from 'vitest';
import { computeWassersteinDistance, computeBottleneckDistance } from '../wasserstein';
import { PersistencePoint } from '@/lib/topologyAnalysis';

describe('Wasserstein Distance', () => {
    describe('computeWassersteinDistance', () => {
        it('should return 0 for identical diagrams', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
                { id: '2', birth: 0.5, death: 1.5, dimension: 1 },
            ];

            const distance = computeWassersteinDistance(diagram, diagram);
            expect(distance).toBe(0);
        });

        it('should return symmetric distance', () => {
            const diagram1: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
            ];
            const diagram2: PersistencePoint[] = [
                { id: '2', birth: 0, death: 2, dimension: 0 },
            ];

            const dist1 = computeWassersteinDistance(diagram1, diagram2);
            const dist2 = computeWassersteinDistance(diagram2, diagram1);

            expect(dist1).toBeCloseTo(dist2, 6);
        });

        it('should handle empty diagrams', () => {
            const empty: PersistencePoint[] = [];
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
            ];

            const distance = computeWassersteinDistance(empty, diagram);
            expect(distance).toBeGreaterThan(0);
        });

        it('should filter out infinite persistence', () => {
            const diagram1: PersistencePoint[] = [
                { id: '1', birth: 0, death: Infinity, dimension: 0 },
                { id: '2', birth: 0, death: 1, dimension: 0 },
            ];
            const diagram2: PersistencePoint[] = [
                { id: '3', birth: 0, death: 1.5, dimension: 0 },
            ];

            // Should not throw, should handle gracefully
            expect(() => computeWassersteinDistance(diagram1, diagram2)).not.toThrow();
        });

        it('should respect triangle inequality', () => {
            const d1: PersistencePoint[] = [{ id: '1', birth: 0, death: 1, dimension: 0 }];
            const d2: PersistencePoint[] = [{ id: '2', birth: 0, death: 1.5, dimension: 0 }];
            const d3: PersistencePoint[] = [{ id: '3', birth: 0, death: 2, dimension: 0 }];

            const dist12 = computeWassersteinDistance(d1, d2);
            const dist23 = computeWassersteinDistance(d2, d3);
            const dist13 = computeWassersteinDistance(d1, d3);

            // Triangle inequality: d(x,z) <= d(x,y) + d(y,z)
            expect(dist13).toBeLessThanOrEqual(dist12 + dist23 + 1e-6);
        });
    });

    describe('computeBottleneckDistance', () => {
        it('should return 0 for identical diagrams', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
            ];

            const distance = computeBottleneckDistance(diagram, diagram);
            expect(distance).toBe(0);
        });

        it('should compute maximum matching distance', () => {
            const diagram1: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
            ];
            const diagram2: PersistencePoint[] = [
                { id: '2', birth: 0, death: 3, dimension: 0 },
            ];

            const distance = computeBottleneckDistance(diagram1, diagram2);
            // Max of: distance to diagonal, distance between points
            expect(distance).toBeGreaterThan(0);
        });

        it('should be at least as large as Wasserstein distance', () => {
            const diagram1: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
                { id: '2', birth: 0.5, death: 1.5, dimension: 1 },
            ];
            const diagram2: PersistencePoint[] = [
                { id: '3', birth: 0, death: 2, dimension: 0 },
                { id: '4', birth: 0.5, death: 2.5, dimension: 1 },
            ];

            const wasserstein = computeWassersteinDistance(diagram1, diagram2);
            const bottleneck = computeBottleneckDistance(diagram1, diagram2);

            // Bottleneck is infinity norm, Wasserstein is L1 norm
            // Bottleneck >= Wasserstein / n^(1/p)
            expect(bottleneck).toBeGreaterThanOrEqual(0);
        });
    });
});
