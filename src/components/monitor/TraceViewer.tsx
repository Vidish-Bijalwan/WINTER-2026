import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function TraceViewer({ className }: { className?: string }) {
    const [traces, setTraces] = useState<any[]>([]);

    useEffect(() => {
        // Mock trace generation
        const interval = setInterval(() => {
            const id = Math.random().toString(36).substring(7);
            const trace = {
                id,
                timestamp: new Date().toLocaleTimeString(),
                service: Math.random() > 0.5 ? 'ingest-service' : 'analysis-core',
                status: Math.random() > 0.9 ? 'error' : 'success',
                duration: Math.floor(Math.random() * 100) + 'ms'
            };

            setTraces(prev => [trace, ...prev].slice(0, 20));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Live Trace Viewer</h3>
            <ScrollArea className="h-[250px]">
                <div className="space-y-2">
                    {traces.map((trace) => (
                        <div key={trace.id} className="flex items-center justify-between p-2 bg-slate-900/30 rounded text-xs border border-slate-800">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-slate-500">{trace.timestamp}</span>
                                <Badge variant="outline" className="text-xs font-normal">
                                    {trace.service}
                                </Badge>
                                <span className="font-mono text-slate-300">{trace.id}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400">{trace.duration}</span>
                                <Badge variant={trace.status === 'success' ? 'default' : 'destructive'} className="h-5">
                                    {trace.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}
