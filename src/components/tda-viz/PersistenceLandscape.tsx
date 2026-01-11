import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { Mountain } from "lucide-react";

export function PersistenceLandscape() {
    const { analysisResult } = useWikipediaData();

    const data = useMemo(() => {
        if (!analysisResult?.topology_features?.landscape) return [];

        const { x, y } = analysisResult.topology_features.landscape;
        return x.map((val: number, i: number) => ({
            t: val,
            lambda: y[i]
        }));
    }, [analysisResult]);

    if (!data.length) {
        return (
            <Card className="h-full bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-100">
                        <Mountain className="w-5 h-5 text-primary" />
                        Persistence Landscape
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[200px] text-slate-500">
                    Waiting for H1 features...
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-slate-100">
                    <Mountain className="w-5 h-5 text-primary" />
                    Persistence Landscape (H1)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorLambda" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis
                                dataKey="t"
                                stroke="#64748b"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(val) => val.toFixed(2)}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                itemStyle={{ color: '#e2e8f0' }}
                                labelStyle={{ color: '#94a3b8' }}
                                formatter={(value: number) => [value.toFixed(4), 'Prominence']}
                                labelFormatter={(label) => `t: ${Number(label).toFixed(2)}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="lambda"
                                stroke="#8b5cf6"
                                fillOpacity={1}
                                fill="url(#colorLambda)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
