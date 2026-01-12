// TDA Algorithm Constants
// Centralized configuration for all TDA computations

/**
 * Filtration parameters for Vietoris-Rips complex construction
 */
export const FILTRATION = {
    /** Maximum radius for edge detection (in milliseconds) */
    MAX_RADIUS: 60000,

    /** Step size for filtration parameter increase */
    STEP_SIZE: 1000,

    /** Number of filtration levels to compute */
    NUM_LEVELS: 60,
} as const;

/**
 * Anomaly detection thresholds
 */
export const ANOMALY_DETECTION = {
    /** Z-score threshold for statistical anomaly (std deviations) */
    Z_SCORE_THRESHOLD: 2.0,

    /** Minimum confidence level to report anomaly (0-1) */
    MIN_CONFIDENCE: 0.7,

    /** Wasserstein distance threshold for topological change */
    WASSERSTEIN_THRESHOLD: 0.15,

    /** Landscape norm deviation threshold */
    LANDSCAPE_THRESHOLD: 1.5,

    /** Multi-modal detection weights */
    WEIGHTS: {
        TDA: 0.4,
        LANDSCAPE: 0.4,
        STATISTICAL: 0.2,
    },
} as const;

/**
 * Baseline maintenance configuration
 */
export const BASELINE = {
    /** Number of recent diagrams to keep for baseline */
    HISTORY_SIZE: 50,

    /** Minimum samples needed before anomaly detection */
    MIN_SAMPLES: 10,

    /** Update frequency for baseline recalculation (diagrams) */
    UPDATE_FREQUENCY: 5,
} as const;

/**
 * Performance optimization settings
 */
export const PERFORMANCE = {
    /** Maximum events to process in single batch */
    MAX_BATCH_SIZE: 2000,

    /** Ring buffer size for event storage */
    RING_BUFFER_SIZE: 2000,

    /** Worker pool size for parallel processing */
    WORKER_POOL_SIZE: 4,

    /** Debounce delay for computation triggers (ms) */
    DEBOUNCE_DELAY: 300,
} as const;

/**
 * Persistence landscape generation
 */
export const LANDSCAPES = {
    /** Number of landscape layers to compute */
    NUM_LAYERS: 5,

    /** Resolution for landscape discretization */
    RESOLUTION: 100,

    /** Padding factor for domain extension (% of range) */
    PADDING_FACTOR: 0.1,
} as const;

/**
 * Wasserstein distance computation
 */
export const WASSERSTEIN = {
    /** Maximum iterations for matching optimization */
    MAX_ITERATIONS: 1000,

    /** Convergence tolerance for optimization */
    TOLERANCE: 1e-6,

    /** Use approximate algorithm for performance */
    USE_APPROXIMATION: true,

    /** Approximation quality (higher = more accurate, slower) */
    APPROXIMATION_QUALITY: 0.95,
} as const;

/**
 * Visualization settings
 */
export const VISUALIZATION = {
    /** Color palette for homology dimensions */
    COLORS: {
        H0: '#3b82f6', // blue - connected components
        H1: '#22c55e', // green - loops/cycles
        H2: '#f97316', // orange - voids/cavities
    },

    /** Animation duration (ms) */
    ANIMATION_DURATION: 300,

    /** Chart update throttle (ms) */
    UPDATE_THROTTLE: 100,
} as const;

/**
 * Time window configurations
 */
export const TIME_WINDOWS = {
    /** Short-term analysis window (1 minute) */
    SHORT: 60000,

    /** Medium-term analysis window (5 minutes) */
    MEDIUM: 300000,

    /** Long-term analysis window (15 minutes) */
    LONG: 900000,
} as const;

/**
 * Type guard for valid time window keys
 */
export type TimeWindow = keyof typeof TIME_WINDOWS;

/**
 * Helper function to get time window value
 */
export function getTimeWindow(window: TimeWindow): number {
    return TIME_WINDOWS[window];
}

/**
 * Validate anomaly detection configuration
 */
export function validateConfig(): boolean {
    const { TDA, LANDSCAPE, STATISTICAL } = ANOMALY_DETECTION.WEIGHTS;
    const sum = TDA + LANDSCAPE + STATISTICAL;

    if (Math.abs(sum - 1.0) > 0.001) {
        console.warn(`Anomaly detection weights sum to ${sum}, expected 1.0`);
        return false;
    }

    return true;
}

// Validate configuration on module load
if (typeof window !== 'undefined') {
    validateConfig();
}
