import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation } from '@/lib/geoUtils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function TimelapseReplay({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [timeRange, setTimeRange] = useState({ start: 0, end: Date.now() });
    const intervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (events.length > 0) {
            const times = events.map(e => e.timestamp.getTime());
            setTimeRange({
                start: Math.min(...times),
                end: Math.max(...times),
            });
            setCurrentTime(Math.min(...times));
        }
    }, [events]);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const next = prev + 1000 * 60; // 1 minute per tick
                    if (next > timeRange.end) {
                        setIsPlaying(false);
                        return timeRange.start;
                    }
                    return next;
                });
            }, 100);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, timeRange]);

    const visibleEvents = events.filter(e =>
        e.timestamp.getTime() <= currentTime &&
        e.timestamp.getTime() >= currentTime - 1000 * 60 * 5 // Show last 5 min
    );

    const markers = visibleEvents
        .map(event => {
            const geo = extractGeoLocation(event);
            if (!geo) return null;
            return { event, geo, position: [geo.lat, geo.lng] as [number, number] };
        })
        .filter(Boolean);

    return (
        <div className={className}>
            <div className="p-4 bg-card rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">24-Hour Time-lapse</h3>
                    <div className="text-xs text-muted-foreground">
                        {new Date(currentTime).toLocaleTimeString()}
                    </div>
                </div>

                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '400px', width: '100%' }}
                    className="rounded-lg mb-3"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers.map((m, i) => m && (
                        <CircleMarker
                            key={i}
                            center={m.position}
                            radius={6}
                            pathOptions={{
                                fillColor: '#3b82f6',
                                fillOpacity: 0.8,
                                color: '#fff',
                                weight: 2,
                            }}
                        />
                    ))}
                </MapContainer>

                <div className="space-y-3">
                    <Slider
                        value={[currentTime]}
                        min={timeRange.start}
                        max={timeRange.end}
                        step={1000 * 60}
                        onValueChange={([val]) => setCurrentTime(val)}
                        className="w-full"
                    />

                    <div className="flex items-center gap-2 justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentTime(timeRange.start)}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
