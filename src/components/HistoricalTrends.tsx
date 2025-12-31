import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Download, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TrendData {
    time: string;
    threats: number;
    anomalies: number;
    normalEvents: number;
}

export function HistoricalTrends() {
    const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
    const [trendData, setTrendData] = useState<TrendData[]>([]);

    useEffect(() => {
        // Generate mock historical data based on time range
        const generateData = () => {
            const points = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 14 : 30;
            return Array.from({ length: points }, (_, i) => ({
                time: timeRange === '1h'
                    ? `${String(i * 5).padStart(2, '0')}m`
                    : timeRange === '24h'
                        ? `${String(i).padStart(2, '0')}:00`
                        : timeRange === '7d'
                            ? `Day ${i + 1}`
                            : `Day ${i + 1}`,
                threats: Math.floor(Math.random() * 50) + 10,
                anomalies: Math.floor(Math.random() * 20) + 5,
                normalEvents: Math.floor(Math.random() * 100) + 50,
            }));
        };
        setTrendData(generateData());
    }, [timeRange]);

    const exportData = () => {
        const csv = [
            ['Time', 'Threats', 'Anomalies', 'Normal Events'],
            ...trendData.map(d => [d.time, d.threats, d.anomalies, d.normalEvents])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat-trends-${timeRange}-${Date.now()}.csv`;
        a.click();
    };

    const totalThreats = trendData.reduce((sum, d) => sum + d.threats, 0);
    const avgThreats = trendData.length > 0 ? Math.round(totalThreats / trendData.length) : 0;
    const trend = trendData.length > 1 && trendData[0].threats > 0
        ? ((trendData[trendData.length - 1].threats - trendData[0].threats) / trendData[0].threats) * 100
        : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Historical Trends
                        </CardTitle>
                        <CardDescription>Threat activity over time</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={exportData}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Time Range Selector */}
                <div className="flex gap-2 mb-6">
                    {(['1h', '24h', '7d', '30d'] as const).map((range) => (
                        <Button
                            key={range}
                            size="sm"
                            variant={timeRange === range ? 'default' : 'outline'}
                            onClick={() => setTimeRange(range)}
                        >
                            {range}
                        </Button>
                    ))}
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-card border border-border/50 rounded-lg"
                    >
                        <div className="text-2xl font-bold text-red-500">{totalThreats}</div>
                        <div className="text-xs text-muted-foreground">Total Threats</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-3 bg-card border border-border/50 rounded-lg"
                    >
                        <div className="text-2xl font-bold text-primary">{avgThreats}</div>
                        <div className="text-xs text-muted-foreground">Avg per Period</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-3 bg-card border border-border/50 rounded-lg"
                    >
                        <div className={`text-2xl font-bold ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Trend</div>
                    </motion.div>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="anomaliesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="time"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: '10px' }}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: '10px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="threats"
                            stroke="#ef4444"
                            fillOpacity={1}
                            fill="url(#threatsGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="anomalies"
                            stroke="#f59e0b"
                            fillOpacity={1}
                            fill="url(#anomaliesGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Threats</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-muted-foreground">Anomalies</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
