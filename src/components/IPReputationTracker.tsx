import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, TrendingDown, TrendingUp, Shield } from "lucide-react";
import { useState, useEffect } from "react";

interface IPReputationData {
    ip: string;
    reputation: 'malicious' | 'suspicious' | 'clean' | 'unknown';
    score: number;
    country: string;
    firstSeen: Date;
    lastSeen: Date;
    threatCount: number;
    tags: string[];
}

export function IPReputationTracker() {
    const [trackedIPs, setTrackedIPs] = useState<IPReputationData[]>([]);

    useEffect(() => {
        // Generate mock IP reputation data
        const mockIPs: IPReputationData[] = [
            {
                ip: '192.168.45.123',
                reputation: 'malicious',
                score: 95,
                country: 'RU',
                firstSeen: new Date(Date.now() - 86400000 * 7),
                lastSeen: new Date(),
                threatCount: 45,
                tags: ['botnet', 'c2', 'malware'],
            },
            {
                ip: '45.142.34.98',
                reputation: 'suspicious',
                score: 68,
                country: 'CN',
                firstSeen: new Date(Date.now() - 86400000 * 3),
                lastSeen: new Date(Date.now() - 3600000),
                threatCount: 12,
                tags: ['scanning', 'reconnaissance'],
            },
            {
                ip: '203.45.67.89',
                reputation: 'clean',
                score: 15,
                country: 'US',
                firstSeen: new Date(Date.now() - 86400000 * 30),
                lastSeen: new Date(Date.now() - 86400000),
                threatCount: 0,
                tags: ['cdn', 'legitimate'],
            },
        ];
        setTrackedIPs(mockIPs);
    }, []);

    const reputationColors = {
        malicious: 'bg-red-500/10 text-red-500 border-red-500/30',
        suspicious: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
        clean: 'bg-green-500/10 text-green-500 border-green-500/30',
        unknown: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            IP Reputation Tracker
                        </CardTitle>
                        <CardDescription>Real-time threat intelligence for monitored IPs</CardDescription>
                    </div>
                    <Button size="sm" variant="outline">Add IP</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {trackedIPs.map((ip, index) => (
                        <motion.div
                            key={ip.ip}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="text-sm font-mono font-semibold">{ip.ip}</code>
                                        <Badge variant="outline" className={reputationColors[ip.reputation]}>
                                            {ip.reputation}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {ip.country}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            {ip.threatCount} threats
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-primary">{ip.score}</div>
                                    <div className="text-[10px] text-muted-foreground">threat score</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <div className="flex gap-1">
                                    {ip.tags.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="text-[9px]">{tag}</Badge>
                                    ))}
                                </div>
                                <div className="text-muted-foreground">
                                    Last seen: {ip.lastSeen.toLocaleTimeString()}
                                </div>
                            </div>

                            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${ip.score}%` }}
                                    className={`h-full ${ip.score > 80 ? 'bg-red-500' :
                                            ip.score > 50 ? 'bg-orange-500' :
                                                'bg-green-500'
                                        }`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
