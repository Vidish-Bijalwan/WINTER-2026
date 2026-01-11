// Wasserstein Distance Computation for Persistence Diagrams
// Computes the p-Wasserstein distance between two persistence diagrams
// Used for quantitative anomaly detection by measuring diagram stability

import { PersistencePoint } from '../topologyAnalysis';

/**
 * Computes the Euclidean distance between two points in the birth-death plane
 */
function euclideanDistance(p1: PersistencePoint, p2: PersistencePoint): number {
    const dx = p1.birth - p2.birth;
    const dy = p1.death - p2.death;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Computes the distance from a point to the diagonal (birth = death)
 * The closest point on the diagonal to (b, d) is ((b+d)/2, (b+d)/2)
 */
function distanceToDiagonal(p: PersistencePoint): number {
    // Distance from (b, d) to line y = x is |b - d| / sqrt(2)
    return Math.abs(p.birth - p.death) / Math.sqrt(2);
}

/**
 * Computes the 1-Wasserstein distance (Earth Mover's Distance) between two persistence diagrams.
 * This implementation uses a greedy approximation for performance in the browser,
 * which is sufficient for real-time anomaly detection.
 * 
 * For exact calculation, a full Hungarian algorithm (O(n^3)) would be needed,
 * which might be too slow for high-frequency updates.
 */
export function computeWassersteinDistance(
    diagram1: PersistencePoint[],
    diagram2: PersistencePoint[],
    p: number = 1
): number {
    // Filter out points close to diagonal (noise) to improve performance
    const d1 = diagram1.filter(pt => distanceToDiagonal(pt) > 0.01);
    const d2 = diagram2.filter(pt => distanceToDiagonal(pt) > 0.01);

    const n = d1.length;
    const m = d2.length;

    // Cost matrix for matching points in d1 to d2
    // We also need to consider matching to diagonal

    // Simplified greedy matching strategy:
    // 1. Calculate all pairwise distances
    // 2. Greedily select smallest distances
    // 3. Match remaining points to diagonal

    let totalCost = 0;
    const matched1 = new Set<number>();
    const matched2 = new Set<number>();

    interface Match {
        i: number;
        j: number;
        cost: number;
    }

    const matches: Match[] = [];

    // Calculate costs between all pairs
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            // Only match points of same dimension
            if (d1[i].dimension === d2[j].dimension) {
                const dist = euclideanDistance(d1[i], d2[j]);
                matches.push({ i, j, cost: Math.pow(dist, p) });
            }
        }
    }

    // Sort matches by cost (ascending)
    matches.sort((a, b) => a.cost - b.cost);

    // Greedy assignment
    for (const match of matches) {
        if (!matched1.has(match.i) && !matched2.has(match.j)) {
            // Check if matching to diagonal is cheaper for either point
            const diagCost1 = Math.pow(distanceToDiagonal(d1[match.i]), p);
            const diagCost2 = Math.pow(distanceToDiagonal(d2[match.j]), p);

            // If direct match is cheaper than both going to diagonal
            if (match.cost <= diagCost1 + diagCost2) {
                totalCost += match.cost;
                matched1.add(match.i);
                matched2.add(match.j);
            }
        }
    }

    // Add cost for unmatched points (matched to diagonal)
    for (let i = 0; i < n; i++) {
        if (!matched1.has(i)) {
            totalCost += Math.pow(distanceToDiagonal(d1[i]), p);
        }
    }

    for (let j = 0; j < m; j++) {
        if (!matched2.has(j)) {
            totalCost += Math.pow(distanceToDiagonal(d2[j]), p);
        }
    }

    return Math.pow(totalCost, 1 / p);
}

/**
 * Computes Bottleneck distance (infinity-Wasserstein)
 * Max distance between matched points
 */
export function computeBottleneckDistance(
    diagram1: PersistencePoint[],
    diagram2: PersistencePoint[]
): number {
    // Similar greedy approximation but taking Max instead of Sum
    const d1 = diagram1.filter(pt => distanceToDiagonal(pt) > 0.01);
    const d2 = diagram2.filter(pt => distanceToDiagonal(pt) > 0.01);

    let maxCost = 0;
    const matched1 = new Set<number>();
    const matched2 = new Set<number>();

    const matches: { i: number, j: number, cost: number }[] = [];

    for (let i = 0; i < d1.length; i++) {
        for (let j = 0; j < d2.length; j++) {
            if (d1[i].dimension === d2[j].dimension) {
                matches.push({ i, j, cost: euclideanDistance(d1[i], d2[j]) });
            }
        }
    }

    matches.sort((a, b) => a.cost - b.cost);

    for (const match of matches) {
        if (!matched1.has(match.i) && !matched2.has(match.j)) {
            const diagCost1 = distanceToDiagonal(d1[match.i]);
            const diagCost2 = distanceToDiagonal(d2[match.j]);

            if (match.cost <= Math.max(diagCost1, diagCost2)) {
                maxCost = Math.max(maxCost, match.cost);
                matched1.add(match.i);
                matched2.add(match.j);
            }
        }
    }

    for (let i = 0; i < d1.length; i++) {
        if (!matched1.has(i)) {
            maxCost = Math.max(maxCost, distanceToDiagonal(d1[i]));
        }
    }

    for (let j = 0; j < d2.length; j++) {
        if (!matched2.has(j)) {
            maxCost = Math.max(maxCost, distanceToDiagonal(d2[j]));
        }
    }

    return maxCost;
}
