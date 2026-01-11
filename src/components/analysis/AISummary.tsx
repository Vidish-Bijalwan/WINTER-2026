import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

export default function AISummary({ className }: { className?: string }) {
    const [summary, setSummary] = useState<string>("Analyzing recent edit patterns...");
    const [loading, setLoading] = useState(false);

    const generateSummary = async () => {
        setLoading(true);
        // Mock AI generation
        setTimeout(() => {
            setSummary("Detected a surge in edits related to 'Solar Energy' and 'Climate Change' topics. High bot activity observed in maintenance categories. 3 potential vandalism attempts flagged in the last hour.");
            setLoading(false);
        }, 1500);
    };

    return (
        <Card className={`p-4 ${className} bg-gradient-to-br from-slate-900 to-slate-950 border-purple-500/20`}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                    AI Insights
                </h3>
                <Button variant="ghost" size="sm" onClick={generateSummary} disabled={loading}>
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
                {summary}
            </p>
        </Card>
    );
}
