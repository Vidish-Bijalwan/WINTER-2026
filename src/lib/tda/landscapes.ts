// Persistence Landscapes Implementation
// Converts persistence diagrams into vector representations (landscapes)
// enabling statistical analysis and machine learning integration

import { PersistencePoint } from '../topologyAnalysis';

export interface LandscapeLayer {
    dimension: number;
    layerIndex: number; // k-th landscape
    values: { t: number; y: number }[]; // Function values (piecewise linear)
}

/**
 * Computes Persistence Landscapes for a given persistence diagram.
 * A persistence landscape is a sequence of functions λ_k: R -> R.
 * 
 * @param diagram The persistence diagram
 * @param numLayers Number of landscape layers to compute (default 5)
 * @param resolution Number of sample points for discretization (default 100)
 * @param range Optional range [min, max] for the landscape domain
 */
export function computePersistenceLandscapes(
    diagram: PersistencePoint[],
    numLayers: number = 3,
    resolution: number = 100,
    range?: [number, number]
): LandscapeLayer[] {
    // Separate by dimension
    const dims = [...new Set(diagram.map(p => p.dimension))];
    const landscapes: LandscapeLayer[] = [];

    for (const dim of dims) {
        const points = diagram.filter(p => p.dimension === dim && p.death !== Infinity);
        if (points.length === 0) continue;

        // Determine domain range if not provided
        let minB = range ? range[0] : Math.min(...points.map(p => p.birth));
        let maxD = range ? range[1] : Math.max(...points.map(p => p.death));

        // Add some padding
        const padding = (maxD - minB) * 0.1;
        minB -= padding;
        maxD += padding;

        const step = (maxD - minB) / resolution;

        // For each layer k
        for (let k = 1; k <= numLayers; k++) {
            const layerValues: { t: number; y: number }[] = [];

            // Sample the landscape function
            for (let i = 0; i <= resolution; i++) {
                const t = minB + i * step;

                // Calculate triangle functions for all points at t
                // f(t) = max(0, min(t-b, d-t))
                const valuesAtT = points.map(p => {
                    return Math.max(0, Math.min(t - p.birth, p.death - t));
                });

                // Sort descending
                valuesAtT.sort((a, b) => b - a);

                // The k-th landscape value is the k-th largest value (index k-1)
                const y = valuesAtT[k - 1] || 0;

                layerValues.push({ t, y });
            }

            landscapes.push({
                dimension: dim,
                layerIndex: k,
                values: layerValues
            });
        }
    }

    return landscapes;
}

/**
 * Computes the norm (L1 or L2) of a persistence landscape.
 * Useful as a summary statistic for anomaly detection.
 */
export function computeLandscapeNorm(landscape: LandscapeLayer, p: number = 2): number {
    let sum = 0;
    // Simple Riemann sum approximation
    for (const point of landscape.values) {
        sum += Math.pow(Math.abs(point.y), p);
    }
    return Math.pow(sum, 1 / p);
}

/**
 * Calculates the average landscape from a set of landscapes.
 * Used to build a baseline for normal behavior.
 */
export function averageLandscapes(landscapes: LandscapeLayer[]): LandscapeLayer | null {
    if (landscapes.length === 0) return null;

    const base = landscapes[0];
    const count = landscapes.length;
    const resultValues = base.values.map(v => ({ t: v.t, y: 0 }));

    for (const l of landscapes) {
        // Assuming all landscapes are computed on same grid/resolution
        // In production, would need interpolation
        for (let i = 0; i < l.values.length; i++) {
            if (i < resultValues.length) {
                resultValues[i].y += l.values[i].y;
            }
        }
    }

    // Divide by count
    resultValues.forEach(v => v.y /= count);

    return {
        dimension: base.dimension,
        layerIndex: base.layerIndex,
        values: resultValues
    };
}
