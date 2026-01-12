import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { useDataSource } from "@/context/DataSourceContext";

export default function ThroughputMeter({ className }: { className?: string }) {
    const { eventsPerSecond } = useWikipediaData();
    const { sourceStats } = useDataSource();
    const [totalEps, setTotalEps] = useState(0);

    useEffect(() => {
        let simulatedEps = 0;
        Object.values(sourceStats).forEach(s => simulatedEps += s.eps);
        setTotalEps(eventsPerSecond + simulatedEps);
    }, [eventsPerSecond, sourceStats]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Event Throughput</h3>
            <div className="flex items-center justify-center h-[150px]">
                <div className="relative flex flex-col items-center">
                    <Zap className="w-12 h-12 text-yellow-400 mb-2 animate-pulse" />
                    <span className="text-5xl font-bold text-white tracking-tighter">
                        {totalEps}
                    </span>
                    <span className="text-sm text-slate-400 mt-1">events / sec</span>
                </div>
            </div>
        </Card>
    );
}
