import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrometheusMetrics({ className }: { className?: string }) {
    const [metrics, setMetrics] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            // In a real setup, this would hit the backend /metrics endpoint
            // Since we might be running in a dev environment where CORS or port mapping 
            // might be an issue for direct browser fetch, we'll try to fetch or fallback
            const response = await fetch('http://localhost:8000/metrics');
            const text = await response.text();
            setMetrics(text);
        } catch (error) {
            setMetrics("# Error fetching metrics\n# Ensure backend is running at http://localhost:8000");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">Prometheus Exporter Output</h3>
                <Button variant="ghost" size="sm" onClick={fetchMetrics} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            <ScrollArea className="h-[200px] bg-slate-950 rounded p-4 font-mono text-xs text-green-400">
                <pre>{metrics}</pre>
            </ScrollArea>
        </Card>
    );
}
