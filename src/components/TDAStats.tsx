import { useAdvancedTDA } from "@/hooks/useAdvancedTDA";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, ShieldAlert, Zap, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TDAStats() {
    const { events } = useWikipediaData();
    const stats = useAdvancedTDA(events);

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                <Activity className="w-8 h-8 animate-pulse text-primary/50" />
                <p className="text-sm">Initializing TDA Engine...</p>
            </div>
        );
    }

    const { score, processingTime } = stats;
    const isAnomaly = score.isAnomaly;

    return (
        <div className="p-4 space-y-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isAnomaly ? (
                        <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                    ) : (
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                    )}
                    <span className="font-medium text-sm">System Status</span>
                </div>
                <Badge variant={isAnomaly ? "destructive" : "outline"} className={cn(isAnomaly ? "animate-pulse" : "bg-green-500/10 text-green-500 border-green-500/20")}>
                    {isAnomaly ? "ANOMALY DETECTED" : "STABLE"}
                </Badge>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Wasserstein Distance
                        </span>
                        <span className="font-mono">{score.components.wasserstein.toFixed(2)}</span>
                    </div>
                    <Progress value={Math.min(score.components.wasserstein * 10, 100)} className="h-1.5" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" /> Landscape Norm (Z-Score)
                        </span>
                        <span className="font-mono">{score.components.landscape.toFixed(2)}</span>
                    </div>
                    <Progress value={Math.min(score.components.landscape * 20, 100)} className="h-1.5" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Combined Anomaly Score</span>
                        <span className={cn("font-mono font-bold", score.totalScore > 3 ? "text-red-400" : "text-green-400")}>
                            {score.totalScore.toFixed(2)}
                        </span>
                    </div>
                    <Progress
                        value={Math.min(score.totalScore * 20, 100)}
                        className={cn("h-2", score.totalScore > 3 ? "bg-red-900/20" : "bg-green-900/20")}
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-lg font-bold text-primary">{(score.confidence * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Latency
                    </p>
                    <p className="text-lg font-bold font-mono">{processingTime.toFixed(1)}ms</p>
                </div>
            </div>
        </div>
    );
}
