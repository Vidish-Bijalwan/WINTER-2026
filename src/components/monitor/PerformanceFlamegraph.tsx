import { Card } from "@/components/ui/card";

export default function PerformanceFlamegraph({ className }: { className?: string }) {
    // Mock flamegraph data structure
    const stages = [
        { name: "WebSocket Receive", width: "15%", color: "bg-blue-500" },
        { name: "JSON Parse", width: "10%", color: "bg-green-500" },
        { name: "TDA Analysis", width: "40%", color: "bg-purple-500" },
        { name: "ML Inference", width: "25%", color: "bg-orange-500" },
        { name: "Render", width: "10%", color: "bg-pink-500" },
    ];

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Pipeline Flamegraph</h3>
            <div className="space-y-4">
                <div className="h-12 w-full flex rounded-md overflow-hidden">
                    {stages.map((stage, i) => (
                        <div
                            key={i}
                            className={`${stage.color} h-full flex items-center justify-center text-xs font-bold text-white/90 hover:opacity-90 transition-opacity cursor-help`}
                            style={{ width: stage.width }}
                            title={stage.name}
                        >
                            {stage.name}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    {stages.map((stage, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                            <span>{stage.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
