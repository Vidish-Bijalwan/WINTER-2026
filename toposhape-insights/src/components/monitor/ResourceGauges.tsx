import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Cpu, Database } from "lucide-react";

export default function ResourceGauges({ className }: { className?: string }) {
    const [metrics, setMetrics] = useState({ cpu: 0, memory: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            // Mock CPU/Memory usage (since actual browser API is limited/experimental)
            setMetrics({
                cpu: Math.floor(Math.random() * 30) + 10,
                memory: Math.floor(Math.random() * 40) + 20
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Client Resources</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 bg-slate-900/50 rounded-lg">
                    <Cpu className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-2xl font-bold text-slate-200">{metrics.cpu}%</span>
                    <span className="text-xs text-slate-500">CPU Usage</span>
                    <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${metrics.cpu}%` }}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-900/50 rounded-lg">
                    <Database className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-2xl font-bold text-slate-200">{metrics.memory}MB</span>
                    <span className="text-xs text-slate-500">Heap Used</span>
                    <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-500"
                            style={{ width: `${metrics.memory}%` }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}
