import { WikipediaEvent } from '@/hooks/useWikipediaStream';

export interface GeoCoordinate {
    lat: number;
    lng: number;
    country: string;
    countryCode: string;
}

// Country code to approximate center coordinates
export const countryCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
    US: { lat: 39.8283, lng: -98.5795, name: 'United States' },
    GB: { lat: 55.3781, lng: -3.4360, name: 'United Kingdom' },
    DE: { lat: 51.1657, lng: 10.4515, name: 'Germany' },
    FR: { lat: 46.2276, lng: 2.2137, name: 'France' },
    ES: { lat: 40.4637, lng: -3.7492, name: 'Spain' },
    IT: { lat: 41.8719, lng: 12.5674, name: 'Italy' },
    CN: { lat: 35.8617, lng: 104.1954, name: 'China' },
    JP: { lat: 36.2048, lng: 138.2529, name: 'Japan' },
    IN: { lat: 20.5937, lng: 78.9629, name: 'India' },
    RU: { lat: 61.5240, lng: 105.3188, name: 'Russia' },
    BR: { lat: -14.2350, lng: -51.9253, name: 'Brazil' },
    CA: { lat: 56.1304, lng: -106.3468, name: 'Canada' },
    AU: { lat: -25.2744, lng: 133.7751, name: 'Australia' },
    KR: { lat: 35.9078, lng: 127.7669, name: 'South Korea' },
    MX: { lat: 23.6345, lng: -102.5528, name: 'Mexico' },
    NL: { lat: 52.1326, lng: 5.2913, name: 'Netherlands' },
    SE: { lat: 60.1282, lng: 18.6435, name: 'Sweden' },
    PL: { lat: 51.9194, lng: 19.1451, name: 'Poland' },
    AR: { lat: -38.4161, lng: -63.6167, name: 'Argentina' },
    ZA: { lat: -30.5595, lng: 22.9375, name: 'South Africa' },
};

// Wikipedia domain to country code mapping
const wikiDomainToCountry: Record<string, string> = {
    'en.wikipedia.org': 'US',
    'de.wikipedia.org': 'DE',
    'fr.wikipedia.org': 'FR',
    'es.wikipedia.org': 'ES',
    'it.wikipedia.org': 'IT',
    'ja.wikipedia.org': 'JP',
    'zh.wikipedia.org': 'CN',
    'ru.wikipedia.org': 'RU',
    'pt.wikipedia.org': 'BR',
    'nl.wikipedia.org': 'NL',
    'pl.wikipedia.org': 'PL',
    'sv.wikipedia.org': 'SE',
    'ko.wikipedia.org': 'KR',
};

/**
 * Extract geographic information from Wikipedia event
 */
export function extractGeoLocation(event: WikipediaEvent): GeoCoordinate | null {
    // Extract from server_url (e.g., "https://de.wikipedia.org")
    try {
        const url = new URL(event.serverUrl);
        const domain = url.hostname;

        // Try wiki domain mapping
        const countryCode = wikiDomainToCountry[domain] || 'US';
        const coords = countryCoordinates[countryCode];

        if (coords) {
            // Add randomness to spread points within country
            const latJitter = (Math.random() - 0.5) * 10;
            const lngJitter = (Math.random() - 0.5) * 10;

            return {
                lat: coords.lat + latJitter,
                lng: coords.lng + lngJitter,
                country: coords.name,
                countryCode,
            };
        }
    } catch (e) {
        console.warn('Failed to extract geo from event', e);
    }

    return null;
}

/**
 * Calculate arc path between two coordinates
 */
export function calculateArcPath(
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    steps: number = 50
): Array<[number, number]> {
    const path: Array<[number, number]> = [];

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        // Simple great circle approximation
        const lat = start.lat + (end.lat - start.lat) * t;
        const lng = start.lng + (end.lng - start.lng) * t;

        // Add arc height (parabola)
        const heightFactor = Math.sin(t * Math.PI) * 0.2;

        path.push([lng, lat + heightFactor]);
    }

    return path;
}

/**
 * Aggregate events by country
 */
export function aggregateByCountry(events: WikipediaEvent[]): Record<string, number> {
    const counts: Record<string, number> = {};

    events.forEach(event => {
        const geo = extractGeoLocation(event);
        if (geo) {
            counts[geo.countryCode] = (counts[geo.countryCode] || 0) + 1;
        }
    });

    return counts;
}

/**
 * Get color scale for choropleth
 */
export function getCountryColor(count: number, max: number): string {
    const ratio = count / max;

    if (ratio > 0.75) return '#dc2626'; // red-600
    if (ratio > 0.5) return '#f97316'; // orange-500
    if (ratio > 0.25) return '#fbbf24'; // yellow-400
    return '#34d399'; // green-400
}
