import {
    computeBettiNumbers,
    computePersistenceDiagram,
    detectAnomalies,
    BettiNumbers,
    computeRiskHeatmap,
    buildTimeline
} from '@/lib/topologyAnalysis';
import { WikipediaEvent } from '@/hooks/useWikipediaStream';
import { describe, expect, test } from 'vitest';

// Helper to create mock events
const createEvent = (overrides: Partial<WikipediaEvent> = {}): WikipediaEvent => ({
    id: `event-${Math.random()}`,
    title: 'Test Article',
    user: 'TestUser',
    timestamp: new Date(),
    namespace: 0,
    wiki: 'enwiki',
    bot: false,
    ...overrides,
});

describe('Topology Analysis Utilities', () => {

    describe('computeBettiNumbers', () => {
        test('calculates H0 based on unique articles', () => {
            const events = [
                createEvent({ title: 'A' }),
                createEvent({ title: 'B' }),
                createEvent({ title: 'A' }), // Duplicate shouldn't increase H0 count for components if logic assumes 1 article = 1 component
            ];
            const betti = computeBettiNumbers(events);
            // Logic is: articles.size. 
            // set(A, B, A) -> size 2
            expect(betti.h0).toBe(2);
        });

        test('calculates H1 based on cycles (multi-edit users)', () => {
            const events = [
                createEvent({ user: 'User1', title: 'A' }),
                createEvent({ user: 'User1', title: 'B' }),
                createEvent({ user: 'User1', title: 'C' }), // User1 has > 2 edits -> 1 loop
            ];
            const betti = computeBettiNumbers(events);
            // Logic: multiEditUsers (>2 edits) + floor(multiEditorArticles / 2)
            expect(betti.h1).toBeGreaterThanOrEqual(1);
        });

        test('returns Betti numbers structure', () => {
            const betti = computeBettiNumbers([]);
            expect(betti).toHaveProperty('h0');
            expect(betti).toHaveProperty('h1');
            expect(betti).toHaveProperty('h2');
        });
    });

    describe('computePersistenceDiagram', () => {
        test('generates persistence points from events', () => {
            // Need a user with multiple events to generate H0 points (activity duration)
            const now = Date.now();
            const events = [
                createEvent({ user: 'UserX', timestamp: new Date(now - 50000) }),
                createEvent({ user: 'UserX', timestamp: new Date(now - 1000) }),
            ];

            const points = computePersistenceDiagram(events);
            // Should have at least one H0 point for UserX
            const userPoint = points.find(p => p.id === 'h0-UserX');
            expect(userPoint).toBeDefined();
            expect(userPoint?.dimension).toBe(0);
        });

        test('returns points with correct structure', () => {
            const events = [createEvent(), createEvent()];
            const points = computePersistenceDiagram(events);
            if (points.length > 0) {
                expect(points[0]).toHaveProperty('birth');
                expect(points[0]).toHaveProperty('death');
                expect(points[0]).toHaveProperty('dimension');
            }
        });
    });

    describe('detectAnomalies', () => {
        test('detects spike in H0 (components)', () => {
            const prev: BettiNumbers = { h0: 10, h1: 0, h2: 0 };
            const curr: BettiNumbers = { h0: 30, h1: 0, h2: 0 }; // Change > 10

            const anomalies = detectAnomalies(curr, prev, []);
            expect(anomalies.length).toBeGreaterThan(0);
            expect(anomalies[0].title).toMatch(/Rapid Topic/);
        });

        test('detects high bot activity', () => {
            // Need > 50 events for bot detection
            const events = Array(60).fill(null).map(() => createEvent({ bot: true }));

            const anomalies = detectAnomalies(
                { h0: 0, h1: 0, h2: 0 },
                { h0: 0, h1: 0, h2: 0 },
                events
            );

            expect(anomalies.some(a => a.title === 'High Bot Activity Detected')).toBe(true);
        });
    });

    describe('computeRiskHeatmap', () => {
        test('generates grid of correct dimensions', () => {
            const { grid, labels } = computeRiskHeatmap([]);
            // 6 namespaces x 7 wikis
            expect(grid.length).toBe(6);
            expect(grid[0].length).toBe(7);
            expect(labels.x.length).toBe(7);
            expect(labels.y.length).toBe(6);
        });
    });

    describe('buildTimeline', () => {
        test('builds chronological points', () => {
            const timeline = buildTimeline([], 1000, 5);
            expect(timeline.length).toBe(5);
            // Verify order
            expect(timeline[4].timestamp.getTime()).toBeGreaterThan(timeline[0].timestamp.getTime());
        });
    });
});
