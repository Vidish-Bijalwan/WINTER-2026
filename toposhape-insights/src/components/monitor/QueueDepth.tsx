import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

export default function QueueDepth({ className }: { className?: string }) {
    const [depth, setDepth] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Mock queue depth
            setDepth(Math.floor(Math.random() * 20));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Processing Queue Depth</h3>
            <div className="flex flex-col justify-center h-[150px] space-y-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Empty</span>
                    <span>Critical</span>
                </div>
                <div className="flex gap-1 h-12">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-sm transition-all duration-300 ${i < depth
                                    ? i > 15 ? 'bg-red-500' : i > 10 ? 'bg-yellow-500' : 'bg-green-500'
                                    : 'bg-slate-800'
                                }`}
                        />
                    ))}
                </div>
                <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-slate-200">{depth}</span>
                    <span className="text-xs text-slate-500 ml-2">pending events</span>
                </div>
            </div>
        </Card>
    );
}
