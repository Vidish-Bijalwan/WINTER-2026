import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation, calculateArcPath } from '@/lib/geoUtils';
import 'leaflet/dist/leaflet.css';

interface Arc {
    id: string;
    path: [number, number][];
    color: string;
}

export default function EditFlowArcs({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [arcs, setArcs] = useState<Arc[]>([]);

    useEffect(() => {
        const newArcs: Arc[] = [];

        // Create arcs between consecutive edits from different locations
        for (let i = 0; i < Math.min(events.length - 1, 50); i++) {
            const start = extractGeoLocation(events[i]);
            const end = extractGeoLocation(events[i + 1]);

            if (start && end && start.countryCode !== end.countryCode) {
                const path = calculateArcPath(start, end, 30);
                newArcs.push({
                    id: `${events[i].id}-${events[i + 1].id}`,
                    path,
                    color: events[i].bot ? '#818cf8' : '#34d399',
                });
            }
        }

        setArcs(newArcs);
    }, [events]);

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
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                />
                {arcs.map((arc) => (
                    <Polyline
                        key={arc.id}
                        positions={arc.path}
                        pathOptions={{
                            color: arc.color,
                            weight: 2,
                            opacity: 0.6,
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}
