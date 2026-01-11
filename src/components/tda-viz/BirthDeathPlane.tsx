import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceLine, Label } from 'recharts';
import { PersistencePoint } from '@/lib/topologyAnalysis';
import { useTheme } from 'next-themes';

interface BirthDeathPlaneProps {
    data: PersistencePoint[];
}

export function BirthDeathPlane({ data }: BirthDeathPlaneProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background/90 backdrop-blur border border-border p-2 rounded shadow-lg text-xs">
                    <p className="font-bold mb-1">Feature {data.id}</p>
                    <p>Dimension: H{data.dimension}</p>
                    <p>Birth: {data.birth.toFixed(3)}</p>
                    <p>Death: {data.death.toFixed(3)}</p>
                    <p>Persistence: {(data.death - data.birth).toFixed(3)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-sm font-medium">Birth-Death Plane</h3>
            </div>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis
                            type="number"
                            dataKey="birth"
                            name="Birth"
                            label={{ value: 'Birth Time', position: 'bottom', offset: 0, fontSize: 12, fill: 'currentColor' }}
                            tick={{ fontSize: 10 }}
                            stroke="currentColor"
                            className="text-muted-foreground"
                        />
                        <YAxis
                            type="number"
                            dataKey="death"
                            name="Death"
                            label={{ value: 'Death Time', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: 'currentColor' }}
                            tick={{ fontSize: 10 }}
                            stroke="currentColor"
                            className="text-muted-foreground"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                        {/* Diagonal Line (y=x) representing zero persistence */}
                        <ReferenceLine
                            segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                            stroke={isDark ? "#475569" : "#cbd5e1"}
                            strokeDasharray="3 3"
                        />

                        <Scatter name="Features" data={data}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.dimension === 0 ? '#3b82f6' : entry.dimension === 1 ? '#22c55e' : '#f97316'}
                                    fillOpacity={0.6}
                                    strokeWidth={1}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
