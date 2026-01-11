import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation } from '@/lib/geoUtils';
import 'leaflet/dist/leaflet.css';

interface HeatPoint {
    lat: number;
    lng: number;
    intensity: number;
}

export default function HeatmapOverlay({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [heatPoints, setHeatPoints] = useState<HeatPoint[]>([]);

    useEffect(() => {
        // Aggregate events by approximate location
        const locationCounts = new Map<string, { lat: number; lng: number; count: number }>();

        events.forEach((event) => {
            const geo = extractGeoLocation(event);
            if (!geo) return;

            // Round to grid cells (1 degree precision)
            const gridKey = `${Math.round(geo.lat)},${Math.round(geo.lng)}`;

            const existing = locationCounts.get(gridKey);
            if (existing) {
                existing.count++;
            } else {
                locationCounts.set(gridKey, {
                    lat: Math.round(geo.lat),
                    lng: Math.round(geo.lng),
                    count: 1,
                });
            }
        });

        const points = Array.from(locationCounts.values()).map((p) => ({
            lat: p.lat,
            lng: p.lng,
            intensity: p.count,
        }));

        setHeatPoints(points);
    }, [events]);

    const maxIntensity = Math.max(...heatPoints.map((p) => p.intensity), 1);

    return (
        <div className={className}>
            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {heatPoints.map((point, i) => {
                    const opacity = point.intensity / maxIntensity;
                    const radius = 50000 * (point.intensity / maxIntensity + 0.2);

                    return (
                        <Circle
                            key={i}
                            center={[point.lat, point.lng]}
                            radius={radius}
                            pathOptions={{
                                fillColor: '#ef4444',
                                fillOpacity: opacity * 0.6,
                                color: '#f97316',
                                weight: 1,
                                opacity: opacity * 0.8,
                            }}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
}
