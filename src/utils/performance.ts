import { onCLS, onFID, onLCP, onTTFB, onFCP, onINP } from 'web-vitals';

type MetricType = {
    name: string;
    value: number;
    delta: number;
    id: string;
};

const sendToAnalytics = (metric: MetricType) => {
    const body = JSON.stringify(metric);
    const url = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Use `navigator.sendBeacon` if available, falling back to `fetch`.
    if (navigator.sendBeacon) {
        navigator.sendBeacon(`${url}/api/metrics/frontend`, body);
    } else {
        fetch(`${url}/api/metrics/frontend`, {
            body,
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json',
            },
        }).catch(err => {
            console.error('Failed to send metrics', err);
        });
    }
};

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        // Reporting to custom handler
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
        onFCP(onPerfEntry);
        onINP(onPerfEntry);
    } else {
        // Reporting to backend
        onCLS(sendToAnalytics);
        onFID(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
        onFCP(sendToAnalytics);
        onINP(sendToAnalytics);
    }
};

export const measurePerformance = (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;

    // Log properly for development
    if (import.meta.env.DEV) {
        console.debug(`[Perf] ${name}: ${duration.toFixed(2)}ms`);
    } else if (duration > 16) { // Only log slow operations (>1 frame) in prod
        // Send to analytics...
    }
};
