import { Card } from "@/components/ui/card";
import { ResponsiveRadar } from '@nivo/radar';

export default function ControversyRadar({ className }: { className?: string }) {
    const data = [
        { metric: "Reverts", value: 85 },
        { metric: "Talk Page", value: 60 },
        { metric: "Edit War", value: 40 },
        { metric: "Protection", value: 70 },
        { metric: "Sentiment", value: 30 },
    ];

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-2">Controversy Metrics</h3>
            <div className="h-[200px]">
                <ResponsiveRadar
                    data={data}
                    keys={['value']}
                    indexBy="metric"
                    maxValue={100}
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                    curve="linearClosed"
                    borderWidth={2}
                    borderColor={{ from: 'color' }}
                    gridLevels={5}
                    gridShape="circular"
                    gridLabelOffset={10}
                    enableDots={true}
                    dotSize={6}
                    dotColor={{ theme: 'background' }}
                    dotBorderWidth={2}
                    dotBorderColor={{ from: 'color' }}
                    enableDotLabel={false}
                    colors={['#f472b6']}
                    fillOpacity={0.25}
                    blendMode="multiply"
                    theme={{
                        axis: { ticks: { text: { fill: '#888', fontSize: 10 } } },
                        grid: { line: { stroke: '#444' } }
                    }}
                />
            </div>
        </Card>
    );
}
