import { describe, it, expect } from 'vitest';
import { computePersistenceLandscapes, computeLandscapeNorm, averageLandscapes } from '../landscapes';
import { PersistencePoint } from '@/lib/topologyAnalysis';

describe('Persistence Landscapes', () => {
    describe('computePersistenceLandscapes', () => {
        it('should generate correct number of layers', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 1, dimension: 0 },
                { id: '2', birth: 0.5, death: 1.5, dimension: 0 },
            ];

            const landscapes = computePersistenceLandscapes(diagram, 3, 100);

            // Should have layers for dimension 0
            const dim0Layers = landscapes.filter(l => l.dimension === 0);
            expect(dim0Layers.length).toBe(3);
        });

        it('should respect layer ordering', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 2, dimension: 0 }, // Large persistence
                { id: '2', birth: 0, death: 1, dimension: 0 }, // Small persistence
            ];

            const landscapes = computePersistenceLandscapes(diagram, 2, 50);
            const layer1 = landscapes.find(l => l.layerIndex === 1);
            const layer2 = landscapes.find(l => l.layerIndex === 2);

            // Layer 1 should generally have higher values than layer 2
            const layer1Max = Math.max(...layer1!.values.map(v => v.y));
            const layer2Max = Math.max(...layer2!.values.map(v => v.y));

            expect(layer1Max).toBeGreaterThanOrEqual(layer2Max);
        });

        it('should handle empty diagrams', () => {
            const empty: PersistencePoint[] = [];
            const landscapes = computePersistenceLandscapes(empty, 3, 100);

            expect(landscapes).toEqual([]);
        });

        it('should filter infinite death times', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: Infinity, dimension: 0 },
                { id: '2', birth: 0, death: 1, dimension: 0 },
            ];

            const landscapes = computePersistenceLandscapes(diagram, 2, 50);

            // Should only process finite points
            expect(landscapes.length).toBeGreaterThan(0);
            landscapes.forEach(layer => {
                layer.values.forEach(point => {
                    expect(point.y).toBeLessThan(Infinity);
                });
            });
        });

        it('should create piecewise linear functions', () => {
            const diagram: PersistencePoint[] = [
                { id: '1', birth: 0, death: 2, dimension: 0 },
            ];

            const landscapes = computePersistenceLandscapes(diagram, 1, 20);
            const layer = landscapes[0];

            // Triangle function: peaks at (birth+death)/2
            const peakTime = (0 + 2) / 2;
            const peakValue = (2 - 0) / 2;

            // Find value closest to peak
            const nearPeak = layer.values.reduce((prev, curr) =>
                Math.abs(curr.t - peakTime) < Math.abs(prev.t - peakTime) ? curr : prev
            );

            expect(nearPeak.y).toBeCloseTo(peakValue, 1);
        });
    });

    describe('computeLandscapeNorm', () => {
        it('should compute L2 norm correctly', () => {
            const layer = {
                dimension: 0,
                layerIndex: 1,
                values: [
                    { t: 0, y: 3 },
                    { t: 1, y: 4 },
                ],
            };

            const norm = computeLandscapeNorm(layer, 2);
            const expected = Math.sqrt(9 + 16); // sqrt(3^2 + 4^2) = 5

            expect(norm).toBeCloseTo(expected, 6);
        });

        it('should compute L1 norm correctly', () => {
            const layer = {
                dimension: 0,
                layerIndex: 1,
                values: [
                    { t: 0, y: 3 },
                    { t: 1, y: 4 },
                ],
            };

            const norm = computeLandscapeNorm(layer, 1);
            const expected = 7; // |3| + |4|

            expect(norm).toBe(expected);
        });

        it('should handle zero landscape', () => {
            const layer = {
                dimension: 0,
                layerIndex: 1,
                values: [
                    { t: 0, y: 0 },
                    { t: 1, y: 0 },
                ],
            };

            const norm = computeLandscapeNorm(layer, 2);
            expect(norm).toBe(0);
        });
    });

    describe('averageLandscapes', () => {
        it('should compute pointwise average', () => {
            const landscape1 = {
                dimension: 0,
                layerIndex: 1,
                values: [
                    { t: 0, y: 2 },
                    { t: 1, y: 4 },
                ],
            };

            const landscape2 = {
                dimension: 0,
                layerIndex: 1,
                values: [
                    { t: 0, y: 4 },
                    { t: 1, y: 2 },
                ],
            };

            const average = averageLandscapes([landscape1, landscape2]);

            expect(average).not.toBeNull();
            expect(average!.values[0].y).toBe(3); // (2+4)/2
            expect(average!.values[1].y).toBe(3); // (4+2)/2
        });

        it('should return null for empty input', () => {
            const average = averageLandscapes([]);
            expect(average).toBeNull();
        });

        it('should preserve metadata', () => {
            const landscape = {
                dimension: 1,
                layerIndex: 2,
                values: [{ t: 0, y: 1 }],
            };

            const average = averageLandscapes([landscape]);

            expect(average!.dimension).toBe(1);
            expect(average!.layerIndex).toBe(2);
        });
    });
});
