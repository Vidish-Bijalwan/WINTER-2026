import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function PredictionEngine({ className }: { className?: string }) {
    const predictions = [
        { article: "United States", probability: "92%", reason: "News Event" },
        { article: "Bitcoin", probability: "85%", reason: "Price Volatility" },
        { article: "Taylor Swift", probability: "78%", reason: "Trending" },
    ];

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Next Edit Forecast
            </h3>
            <div className="space-y-3">
                {predictions.map((pred, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium">{pred.article}</p>
                            <p className="text-xs text-slate-500">{pred.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-blue-400">{pred.probability}</span>
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
