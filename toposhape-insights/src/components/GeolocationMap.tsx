import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ThreatLocation {
    country: string;
    code: string;
    lat: number;
    lng: number;
    threats: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
}

export function GeolocationMap() {
    const [locations, setLocations] = useState<ThreatLocation[]>([]);

    useEffect(() => {
        // Mock threat location data
        const mockLocations: ThreatLocation[] = [
            { country: 'Russia', code: 'RU', lat: 55.7558, lng: 37.6173, threats: 245, severity: 'critical' },
            { country: 'China', code: 'CN', lat: 39.9042, lng: 116.4074, threats: 189, severity: 'high' },
            { country: 'United States', code: 'US', lat: 38.9072, lng: -77.0369, threats: 156, severity: 'high' },
            { country: 'Brazil', code: 'BR', lat: -15.7975, lng: -47.8919, threats: 98, severity: 'medium' },
            { country: 'India', code: 'IN', lat: 28.6139, lng: 77.2090, threats: 87, severity: 'medium' },
            { country: 'Germany', code: 'DE', lat: 52.5200, lng: 13.4050, threats: 45, severity: 'low' },
        ];
        setLocations(mockLocations);
    }, []);

    const severityColors = {
        critical: 'bg-red-500',
        high: 'bg-orange-500',
        medium: 'bg-yellow-500',
        low: 'bg-blue-500',
    };

    const maxThreats = Math.max(...locations.map(l => l.threats));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Global Threat Map
                </CardTitle>
                <CardDescription>Geographic distribution of threat activity</CardDescription>
            </CardHeader>
            <CardContent>
                {/* World Map Representation (simplified) */}
                <div className="relative w-full h-64 bg-muted/30 rounded-lg overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

                    {/* Threat markers */}
                    {locations.map((loc, index) => {
                        const size = 20 + (loc.threats / maxThreats) * 40;
                        // Convert lat/lng to relative positioning (simplified)
                        const x = ((loc.lng + 180) / 360) * 100;
                        const y = ((90 - loc.lat) / 180) * 100;

                        return (
                            <motion.div
                                key={loc.code}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="absolute"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div className="relative group">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.2,
                                        }}
                                        className={`w-${Math.floor(size / 4)} h-${Math.floor(size / 4)} ${severityColors[loc.severity]} rounded-full blur-md`}
                                        style={{ width: size, height: size }}
                                    />
                                    <div
                                        className={`absolute inset-0 ${severityColors[loc.severity]} rounded-full`}
                                        style={{ width: size * 0.5, height: size * 0.5, left: '25%', top: '25%' }}
                                    />

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                        <div className="bg-card border border-border shadow-lg rounded-lg p-2 whitespace-nowrap">
                                            <div className="text-xs font-semibold">{loc.country}</div>
                                            <div className="text-xs text-muted-foreground">{loc.threats} threats</div>
                                            <Badge variant="outline" className="text-[9px] mt-1">
                                                {loc.severity}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Location List */}
                <div className="space-y-2">
                    {locations
                        .sort((a, b) => b.threats - a.threats)
                        .map((loc, index) => (
                            <motion.div
                                key={loc.code}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 ${severityColors[loc.severity]} rounded-full`} />
                                    <div>
                                        <div className="text-sm font-medium">{loc.country}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold">{loc.threats}</div>
                                    <div className="text-[10px] text-muted-foreground">threats</div>
                                </div>
                            </motion.div>
                        ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-xl font-bold text-primary">{locations.length}</div>
                        <div className="text-xs text-muted-foreground">Countries</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-red-500">
                            {locations.reduce((sum, l) => sum + l.threats, 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Threats</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-orange-500">
                            {locations.filter(l => l.severity === 'critical' || l.severity === 'high').length}
                        </div>
                        <div className="text-xs text-muted-foreground">High Risk</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
