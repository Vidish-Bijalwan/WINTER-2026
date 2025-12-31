import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveBar } from '@nivo/bar';

export default function LatencyHistogram({ className }: { className?: string }) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Mock latency distribution
        const bins = [
            { range: '0-50ms', count: 45 },
            { range: '50-100ms', count: 30 },
            { range: '100-200ms', count: 15 },
            { range: '200-500ms', count: 8 },
            { range: '500ms+', count: 2 },
        ];
        setData(bins);
    }, []);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Latency Distribution</h3>
            <div className="h-[250px]">
                <ResponsiveBar
                    data={data}
                    keys={['count']}
                    indexBy="range"
                    margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors="#3b82f6"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    theme={{
                        axis: { ticks: { text: { fill: '#666' } } },
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
