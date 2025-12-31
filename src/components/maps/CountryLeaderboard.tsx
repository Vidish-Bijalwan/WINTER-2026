import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { aggregateByCountry, getCountryColor, countryCoordinates } from '@/lib/geoUtils';
import 'leaflet/dist/leaflet.css';

export default function CountryLeaderboard({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [countryCounts, setCountryCounts] = useState<Record<string, number>>({});
    const [maxCount, setMaxCount] = useState(1);

    useEffect(() => {
        const counts = aggregateByCountry(events);
        setCountryCounts(counts);
        setMaxCount(Math.max(...Object.values(counts), 1));
    }, [events]);

    // Create simple GeoJSON features for countries
    const countryFeatures = Object.entries(countryCounts).map(([code, count]) => {
        const coords = countryCoordinates[code];
        if (!coords) return null;

        return {
            type: 'Feature' as const,
            properties: {
                name: coords.name,
                code,
                count,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [coords.lng, coords.lat],
            },
        };
    }).filter(Boolean);

    const geoJsonData = {
        type: 'FeatureCollection' as const,
        features: countryFeatures as any[],
    };

    return (
        <div className={className}>
            <div className="p-4 bg-card rounded-lg border">
                <h3 className="text-sm font-semibold mb-3">Top Countries by Edit Volume</h3>
                <div className="space-y-2 mb-4">
                    {Object.entries(countryCounts)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([code, count]) => {
                            const country = countryCoordinates[code];
                            if (!country) return null;

                            return (
                                <div key={code} className="flex items-center justify-between text-sm">
                                    <span>{country.name}</span>
                                    <span className="font-mono text-primary">{count}</span>
                                </div>
                            );
                        })}
                </div>

                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '400px', width: '100%' }}
                    className="rounded-lg"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON
                        data={geoJsonData}
                        pointToLayer={(feature, latlng) => {
                            const count = feature.properties.count;
                            const radius = 10 + (count / maxCount) * 40;

                            return L.circleMarker(latlng, {
                                radius,
                                fillColor: getCountryColor(count, maxCount),
                                fillOpacity: 0.7,
                                color: '#fff',
                                weight: 2,
                            });
                        }}
                        onEachFeature={(feature, layer) => {
                            layer.bindPopup(`
                <b>${feature.properties.name}</b><br/>
                Edits: ${feature.properties.count}
              `);
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}
