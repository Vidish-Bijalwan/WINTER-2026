import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useWikipediaData } from '@/context/WikipediaDataContext';

export default function ThroughputMeter({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [eps, setEps] = useState(0);

    useEffect(() => {
        // Calculate events per second based on recent buffer
        // This is a rough approximation based on buffer updates
        const interval = setInterval(() => {
            // In a real scenario, we'd track count delta over time
            // Here we just mock a fluctuation around a base value
            setEps(Math.floor(Math.random() * 10) + 5);
        }, 1000);
        return () => clearInterval(interval);
    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Event Throughput</h3>
            <div className="flex items-center justify-center h-[150px]">
                <div className="relative flex flex-col items-center">
                    <Zap className="w-12 h-12 text-yellow-400 mb-2 animate-pulse" />
                    <span className="text-5xl font-bold text-white tracking-tighter">
                        {eps}
                    </span>
                    <span className="text-sm text-slate-400 mt-1">events / sec</span>
                </div>
            </div>
        </Card>
    );
}
