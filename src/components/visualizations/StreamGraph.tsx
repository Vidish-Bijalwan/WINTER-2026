import { useEffect, useState } from 'react';
import { ResponsiveStream } from '@nivo/stream';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function StreamGraph({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Bin events by time (last 60 seconds, 1s bins)
        const now = Date.now();
        const bins: Record<number, any> = {};

        // Initialize bins
        for (let i = 0; i < 20; i++) {
            bins[i] = {
                'Human Edit': 0,
                'Bot Edit': 0,
                'New Page': 0,
                'Minor Edit': 0
            };
        }

        events.forEach(event => {
            const age = now - event.timestamp.getTime();
            const binIndex = Math.floor(age / 3000); // 3s bins

            if (binIndex < 20 && binIndex >= 0) {
                if (event.bot) bins[binIndex]['Bot Edit']++;
                else if (event.type === 'new') bins[binIndex]['New Page']++;
                else if (event.minor) bins[binIndex]['Minor Edit']++;
                else bins[binIndex]['Human Edit']++;
            }
        });

        setData(Object.values(bins).reverse());
    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Edit Types Stream</h3>
            <div className="h-[300px]">
                <ResponsiveStream
                    data={data}
                    keys={['Human Edit', 'Bot Edit', 'New Page', 'Minor Edit']}
                    margin={{ top: 20, right: 110, bottom: 20, left: 30 }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Time (relative)',
                        legendOffset: 36
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Volume',
                        legendOffset: -40
                    }}
                    enableGridX={false}
                    enableGridY={false}
                    offsetType="silhouette"
                    colors={{ scheme: 'nivo' }}
                    fillOpacity={0.85}
                    borderColor={{ theme: 'background' }}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            translateX: 100,
                            itemWidth: 80,
                            itemHeight: 20,
                            itemTextColor: '#999',
                            symbolSize: 12,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                    theme={{
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
