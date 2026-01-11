import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveLine } from '@nivo/line';

export default function ErrorDashboard({ className }: { className?: string }) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Mock error rate data
        const points = [];
        for (let i = 0; i < 20; i++) {
            points.push({
                x: i,
                y: Math.random() * (i % 5 === 0 ? 5 : 1) // Occasional spikes
            });
        }

        setData([{
            id: "errors",
            color: "hsl(0, 70%, 50%)",
            data: points
        }]);
    }, []);

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">Error Rate (Errors/min)</h3>
                <span className="text-xs font-mono text-red-400">Current: 0.2%</span>
            </div>
            <div className="h-[200px]">
                <ResponsiveLine
                    data={data}
                    margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 0, max: 'auto' }}
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{ tickSize: 0, tickPadding: 5, tickRotation: 0 }}
                    axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
                    enableGridX={false}
                    colors={['#ef4444']}
                    enablePoints={false}
                    enableArea={true}
                    areaOpacity={0.15}
                    useMesh={true}
                    theme={{
                        axis: { ticks: { text: { fill: '#666' } } },
                        grid: { line: { stroke: '#333' } },
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
