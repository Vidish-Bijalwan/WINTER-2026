import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VandalismMonitor({ className }: { className?: string }) {
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const newAlert = {
                    id: Date.now(),
                    title: "Potential Vandalism",
                    article: "Main Page",
                    confidence: (0.8 + Math.random() * 0.2).toFixed(2),
                    time: new Date().toLocaleTimeString()
                };
                setAlerts(prev => [newAlert, ...prev].slice(0, 5));
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className={`p-4 ${className} border-red-500/20`}>
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-red-400">
                <ShieldAlert className="w-4 h-4" />
                Vandalism Watch
            </h3>
            <div className="space-y-3">
                {alerts.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No threats detected.</p>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className="flex items-start gap-3 p-2 rounded bg-red-950/10 border border-red-900/20">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-200">{alert.article}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] border-red-800 text-red-400">
                                        {alert.confidence} Confidence
                                    </Badge>
                                    <span className="text-[10px] text-slate-500">{alert.time}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
