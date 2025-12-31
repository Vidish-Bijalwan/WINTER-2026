import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation } from '@/lib/geoUtils';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';

const languageColors: Record<string, string> = {
    en: '#3b82f6', // blue
    de: '#eab308', // yellow
    fr: '#8b5cf6', // purple
    es: '#f97316', // orange
    it: '#10b981', // green
    ja: '#ec4899', // pink
    zh: '#ef4444', // red
    ru: '#14b8a6', // teal
    pt: '#06b6d4', // cyan
};

export default function LanguageClusters({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [languageStats, setLanguageStats] = useState<Record<string, number>>({});
    const [clusterMarkers, setClusterMarkers] = useState<any[]>([]);

    useEffect(() => {
        const stats: Record<string, number> = {};
        const markers: any[] = [];

        events.slice(0, 200).forEach(event => {
            const geo = extractGeoLocation(event);
            if (!geo) return;

            // Extract language from wiki field (e.g., "enwiki" -> "en")
            const lang = event.wiki.substring(0, 2);
            stats[lang] = (stats[lang] || 0) + 1;

            markers.push({
                position: [geo.lat, geo.lng],
                lang,
                event,
            });
        });

        setLanguageStats(stats);
        setClusterMarkers(markers);
    }, [events]);

    return (
        <div className={className}>
            <div className="p-4 bg-card rounded-lg border">
                <h3 className="text-sm font-semibold mb-3">Wiki Language Clusters</h3>

                <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(languageStats)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 8)
                        .map(([lang, count]) => (
                            <Badge
                                key={lang}
                                variant="secondary"
                                style={{ backgroundColor: languageColors[lang] + '33' }}
                            >
                                {lang.toUpperCase()}: {count}
                            </Badge>
                        ))}
                </div>

                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '400px', width: '100%' }}
                    className="rounded-lg"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {clusterMarkers.map((marker, i) => (
                        <CircleMarker
                            key={i}
                            center={marker.position}
                            radius={5}
                            pathOptions={{
                                fillColor: languageColors[marker.lang] || '#gray',
                                fillOpacity: 0.7,
                                color: '#fff',
                                weight: 1,
                            }}
                        >
                            <Popup>
                                <div className="text-xs">
                                    <div className="font-semibold">{marker.event.title}</div>
                                    <div className="text-muted-foreground">
                                        Language: {marker.lang.toUpperCase()}
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
