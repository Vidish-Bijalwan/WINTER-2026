import React, { useMemo } from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, ScatterChart, Scatter, Cell, ReferenceLine, Label } from 'recharts';
import { PersistencePoint } from '@/lib/topologyAnalysis';
import { useTheme } from 'next-themes';

interface PersistenceBarcodeProps {
    data: PersistencePoint[];
    height?: number;
}

export function PersistenceBarcode({ data, height = 300 }: PersistenceBarcodeProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Transform data for barcode visualization
    // Each bar represents a feature [birth, death]
    // We stack them by dimension and sort by lifetime length
    const chartData = useMemo(() => {
        return data
            .map((p, index) => ({
                ...p,
                index,
                lifetime: p.death - p.birth,
                // For scatter plot simulation of bars:
                // We can use error bars or just draw lines. 
                // Recharts doesn't have a native Gantt/Barcode chart easily.
                // So we'll use a custom shape or just simple lines in SVG.
            }))
            .sort((a, b) => (b.death - b.birth) - (a.death - a.birth)); // Sort by persistence
    }, [data]);

    // Group by dimension
    const dim0 = chartData.filter(d => d.dimension === 0);
    const dim1 = chartData.filter(d => d.dimension === 1);
    const dim2 = chartData.filter(d => d.dimension === 2);

    // Custom Bar Component
    const Bar = ({ x, y, width, height, fill, payload }: any) => {
        // Calculate actual width based on birth/death
        // x is the start position (birth)
        // width is the length (lifetime)
        // But Recharts passes scaled values. 
        // Wait, implementing this via Recharts custom shape is tricky without access to the scale.

        // Alternative: Use simple SVG for the barcode. It's cleaner.
        return null;
    };

    // Let's use pure SVG for better control over the barcode look
    const padding = { top: 20, right: 20, bottom: 20, left: 40 };

    // Calculate scales manually for SVG
    const maxTime = Math.max(...data.map(d => d.death), 1);

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-sm font-medium">Persistence Barcode</h3>
                <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> H0</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> H1</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> H2</span>
                </div>
            </div>

            <div className="flex-1 relative border-l border-b border-border/50 m-2">
                <svg width="100%" height="100%" className="overflow-visible">
                    {chartData.map((point, i) => {
                        const y = (i / chartData.length) * 100 + '%';
                        const x1 = (point.birth / maxTime) * 100 + '%';
                        const x2 = (point.death / maxTime) * 100 + '%';
                        const color = point.dimension === 0 ? '#3b82f6' : point.dimension === 1 ? '#22c55e' : '#f97316';

                        return (
                            <g key={point.id} className="group cursor-pointer">
                                <line
                                    x1={x1} y1={y} x2={x2} y2={y}
                                    stroke={color}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className="opacity-70 group-hover:opacity-100 group-hover:stroke-[6px] transition-all"
                                />
                                <title>{`Dim ${point.dimension}: [${point.birth.toFixed(2)}, ${point.death.toFixed(2)}]`}</title>
                            </g>
                        );
                    })}
                </svg>

                {/* Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>Time →</span>
                    <span>{maxTime.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
}
