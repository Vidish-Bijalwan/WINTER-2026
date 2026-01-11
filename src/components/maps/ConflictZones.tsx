import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation } from '@/lib/geoUtils';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';

interface ConflictZone {
    title: string;
    position: [number, number];
    edits: number;
    editors: Set<string>;
}

export default function ConflictZones({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [conflictZones, setConflictZones] = useState<ConflictZone[]>([]);

    useEffect(() => {
        // Detect articles with high edit frequency and multiple editors
        const articleActivity = new Map<string, { edits: number; editors: Set<string>; geo: any }>();

        events.forEach(event => {
            const geo = extractGeoLocation(event);
            if (!geo) return;

            const existing = articleActivity.get(event.title);
            if (existing) {
                existing.edits++;
                existing.editors.add(event.user);
            } else {
                articleActivity.set(event.title, {
                    edits: 1,
                    editors: new Set([event.user]),
                    geo,
                });
            }
        });

        // Filter for "conflict zones" - high edits + multiple editors
        const conflicts: ConflictZone[] = [];
        articleActivity.forEach((activity, title) => {
            if (activity.edits >= 3 && activity.editors.size >= 2) {
                conflicts.push({
                    title,
                    position: [activity.geo.lat, activity.geo.lng],
                    edits: activity.edits,
                    editors: activity.editors,
                });
            }
        });

        setConflictZones(conflicts.slice(0, 20));
    }, [events]);

    return (
        <div className={className}>
            <div className="p-4 bg-card rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Edit Conflict Zones</h3>
                    <Badge variant="destructive">{conflictZones.length} detected</Badge>
                </div>

                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '400px', width: '100%' }}
                    className="rounded-lg"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {conflictZones.map((zone, i) => (
                        <Circle
                            key={i}
                            center={zone.position}
                            radius={100000}
                            pathOptions={{
                                fillColor: '#ef4444',
                                fillOpacity: 0.4,
                                color: '#fca5a5',
                                weight: 2,
                            }}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <div className="font-semibold text-red-500">⚠️ Conflict Zone</div>
                                    <div className="mt-1">{zone.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {zone.edits} edits by {zone.editors.size} editors
                                    </div>
                                </div>
                            </Popup>
                        </Circle>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
