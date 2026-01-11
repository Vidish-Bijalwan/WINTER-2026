import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, Polyline } from 'react-leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation, GeoCoordinate, calculateArcPath } from '@/lib/geoUtils';
import { WikipediaEvent } from '@/hooks/useWikipediaStream';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Activity, Flame, Share2 } from "lucide-react";

interface EditMarker {
    id: string;
    position: [number, number];
    event: WikipediaEvent;
    geo: GeoCoordinate;
    timestamp: number;
}

interface HeatPoint {
    lat: number;
    lng: number;
    intensity: number;
}

interface Arc {
    id: string;
    path: [number, number][];
    color: string;
}

export default function UnifiedWorldMap({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [markers, setMarkers] = useState<EditMarker[]>([]);
    const [heatPoints, setHeatPoints] = useState<HeatPoint[]>([]);
    const [arcs, setArcs] = useState<Arc[]>([]);

    // Layer visibility state
    const [showMarkers, setShowMarkers] = useState(true);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showArcs, setShowArcs] = useState(true);

    useEffect(() => {
        // Process Events for Markers
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

        // Process Events for Heatmap
        const locationCounts = new Map<string, { lat: number; lng: number; count: number }>();
        events.forEach((event) => {
            const geo = extractGeoLocation(event);
            if (!geo) return;
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

        // Process Events for Arcs
        const newArcs: Arc[] = [];
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

    const maxIntensity = Math.max(...heatPoints.map((p) => p.intensity), 1);

    return (
        <div className={`relative ${className}`}>
            {/* Map Control Panel */}
            <Card className="absolute top-4 right-4 z-[1000] p-4 bg-slate-900/90 border-slate-700 backdrop-blur-md w-64">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">Map Layers</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <Label className="text-xs text-slate-300">Live Edits</Label>
                        </div>
                        <Switch checked={showMarkers} onCheckedChange={setShowMarkers} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-red-500" />
                            <Label className="text-xs text-slate-300">Heatmap</Label>
                        </div>
                        <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-indigo-500" />
                            <Label className="text-xs text-slate-300">Flow Arcs</Label>
                        </div>
                        <Switch checked={showArcs} onCheckedChange={setShowArcs} />
                    </div>
                </div>
            </Card>

            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {showMarkers && markers.map((marker) => (
                    <CircleMarker
                        key={marker.id}
                        center={marker.position}
                        radius={6}
                        pathOptions={{
                            fillColor: marker.event.bot ? '#6366f1' : '#10b981',
                            fillOpacity: 0.7,
                            color: '#fff',
                            weight: 1,
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
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {showHeatmap && heatPoints.map((point, i) => {
                    const opacity = point.intensity / maxIntensity;
                    const radius = 50000 * (point.intensity / maxIntensity + 0.2);
                    return (
                        <Circle
                            key={`heat-${i}`}
                            center={[point.lat, point.lng]}
                            radius={radius}
                            pathOptions={{
                                fillColor: '#ef4444',
                                fillOpacity: opacity * 0.5,
                                color: 'transparent',
                                weight: 0,
                            }}
                        />
                    );
                })}

                {showArcs && arcs.map((arc) => (
                    <Polyline
                        key={arc.id}
                        positions={arc.path}
                        pathOptions={{
                            color: arc.color,
                            weight: 1.5,
                            opacity: 0.5,
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}
