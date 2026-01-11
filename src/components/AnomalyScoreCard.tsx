import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { Activity, Brain, Network, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnomalyScoreCard() {
    const { analysisResult } = useWikipediaData();

    if (!analysisResult || !analysisResult.scores) {
        return (
            <Card className="h-full bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-100">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                        Anomaly Score
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[200px] text-slate-500">
                    Waiting for analysis data...
                </CardContent>
            </Card>
        );
    }

    const { scores, topology_features } = analysisResult;
    const isAnomaly = analysisResult.is_anomaly;

    const getScoreColor = (score: number) => {
        if (score < 40) return "bg-green-500";
        if (score < 70) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getTextColor = (score: number) => {
        if (score < 40) return "text-green-500";
        if (score < 70) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <Card className={cn("h-full bg-slate-900 border-slate-800 transition-colors duration-500", isAnomaly ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "")}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-slate-100">
                        <ShieldAlert className={cn("w-5 h-5", isAnomaly ? "text-red-500 animate-pulse" : "text-primary")} />
                        Anomaly Score
                    </CardTitle>
                    <span className={cn("text-2xl font-bold", getTextColor(scores.total))}>
                        {scores.total.toFixed(1)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Score Bar */}
                <div className="space-y-1">
                    <Progress value={scores.total} className="h-3 bg-slate-800" indicatorClassName={getScoreColor(scores.total)} />
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Normal</span>
                        <span>Critical</span>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                    {/* Betti Score */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Network className="w-3.5 h-3.5" />
                            <span>Structure</span>
                        </div>
                        <div className="text-lg font-semibold text-slate-200">
                            {scores.betti.toFixed(0)}
                        </div>
                        <Progress value={scores.betti} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-500" />
                    </div>

                    {/* Entropy Score */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Activity className="w-3.5 h-3.5" />
                            <span>Entropy</span>
                        </div>
                        <div className="text-lg font-semibold text-slate-200">
                            {scores.entropy.toFixed(0)}
                        </div>
                        <Progress value={scores.entropy} className="h-1.5 bg-slate-800" indicatorClassName="bg-purple-500" />
                        <div className="text-[10px] text-slate-500">
                            {topology_features?.entropy.toFixed(2)} bits
                        </div>
                    </div>

                    {/* ML Score */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Brain className="w-3.5 h-3.5" />
                            <span>ML Model</span>
                        </div>
                        <div className="text-lg font-semibold text-slate-200">
                            {scores.ml.toFixed(0)}
                        </div>
                        <Progress value={scores.ml} className="h-1.5 bg-slate-800" indicatorClassName="bg-orange-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
