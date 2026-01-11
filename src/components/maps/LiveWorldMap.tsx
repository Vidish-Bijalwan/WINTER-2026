import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation, GeoCoordinate } from '@/lib/geoUtils';
import { WikipediaEvent } from '@/hooks/useWikipediaStream';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

interface EditMarker {
    id: string;
    position: [number, number];
    event: WikipediaEvent;
    geo: GeoCoordinate;
    timestamp: number;
}

function AnimatedMarkers({ markers }: { markers: EditMarker[] }) {
    return (
        <>
            {markers.map((marker) => (
                <CircleMarker
                    key={marker.id}
                    center={marker.position}
                    radius={8}
                    pathOptions={{
                        fillColor: marker.event.bot ? '#6366f1' : '#10b981',
                        fillOpacity: 0.7,
                        color: '#fff',
                        weight: 2,
                    }}
                >
                    <Popup>
                        <div className="text-sm">
                            <div className="font-semibold">{marker.event.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                By: {marker.event.user}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {marker.geo.country}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {marker.event.timestamp.toLocaleTimeString()}
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </>
    );
}

export default function LiveWorldMap({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [markers, setMarkers] = useState<EditMarker[]>([]);

    useEffect(() => {
        // Convert recent events to markers
        const newMarkers = events
            .slice(0, 100)
            .map((event) => {
                const geo = extractGeoLocation(event);
                if (!geo) return null;

                return {
                    id: event.id,
                    position: [geo.lat, geo.lng] as [number, number],
                    event,
                    geo,
                    timestamp: event.timestamp.getTime(),
                };
            })
            .filter((m): m is EditMarker => m !== null);

        setMarkers(newMarkers);
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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <AnimatedMarkers markers={markers} />
            </MapContainer>
        </div>
    );
}
