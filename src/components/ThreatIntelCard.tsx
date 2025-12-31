import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Globe, Hash, Calendar, TrendingUp } from "lucide-react";
import { ThreatEvent } from "@/lib/dataSources";

interface ThreatIntelCardProps {
    threat: ThreatEvent;
    index: number;
}

export function ThreatIntelCard({ threat, index }: ThreatIntelCardProps) {
    const severityColors = {
        critical: "bg-red-500/10 text-red-500 border-red-500/30",
        high: "bg-orange-500/10 text-orange-500 border-orange-500/30",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
        low: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    };

    const indicatorIcons = {
        ip: Globe,
        domain: Globe,
        hash: Hash,
        url: Globe,
        email: Globe,
    };

    const Icon = indicatorIcons[threat.indicatorType];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm">{threat.source}</CardTitle>
                        </div>
                        <Badge variant="outline" className={severityColors[threat.severity]}>
                            {threat.severity}
                        </Badge>
                    </div>
                    <CardDescription className="text-xs">
                        {new Date(threat.timestamp).toLocaleTimeString()}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <code className="text-xs font-mono">{threat.indicator}</code>
                    </div>

                    <p className="text-xs text-muted-foreground">{threat.description}</p>

                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Confidence: {Math.round(threat.confidence)}%</span>
                        </div>
                        {threat.country && (
                            <Badge variant="secondary" className="text-[10px]">{threat.country}</Badge>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {threat.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-[9px]">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
export default function ThreatIntelWidget() {
    const mockThreats: ThreatEvent[] = [
        {
            id: "1",
            source: "CrowdStrike",
            threatType: "intrusion",
            severity: "critical",
            indicator: "192.168.1.1",
            indicatorType: "ip",
            description: "Known C2 Server",
            confidence: 95,
            timestamp: new Date(),
            tags: ["botnet", "apt28"],
            country: "RU"
        },
        {
            id: "2",
            source: "AbuseIPDB",
            threatType: "phishing",
            severity: "high",
            indicator: "malicious-site.com",
            indicatorType: "domain",
            description: "Phishing Campaign",
            confidence: 88,
            timestamp: new Date(),
            tags: ["phishing"],
            country: "CN"
        }
    ];

    return (
        <div className="space-y-4">
            {mockThreats.map((threat, i) => (
                <ThreatIntelCard key={threat.id} threat={threat} index={i} />
            ))}
        </div>
    );
}
