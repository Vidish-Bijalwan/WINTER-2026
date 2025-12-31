import { useEffect, useState } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function SunburstChart({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Hierarchy: Wiki -> Namespace -> User Type
        const root = {
            name: 'root',
            children: [] as any[]
        };

        const wikis: Record<string, any> = {};

        events.slice(0, 200).forEach(event => {
            const wiki = event.wiki || 'other';
            if (!wikis[wiki]) {
                wikis[wiki] = {
                    name: wiki,
                    children: [
                        { name: 'Main', children: [] },
                        { name: 'Talk', children: [] }
                    ]
                };
                root.children.push(wikis[wiki]);
            }

            const nsIndex = event.namespace === 0 ? 0 : 1;
            const userType = event.bot ? 'Bot' : 'Human';

            let typeNode = wikis[wiki].children[nsIndex].children.find((c: any) => c.name === userType);
            if (!typeNode) {
                typeNode = { name: userType, loc: 0 };
                wikis[wiki].children[nsIndex].children.push(typeNode);
            }
            typeNode.loc++;
        });

        setData(root);
    }, [events]);

    if (!data) return null;

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Hierarchical Breakdown</h3>
            <div className="h-[300px]">
                <ResponsiveSunburst
                    data={data}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    id="name"
                    value="loc"
                    cornerRadius={2}
                    borderColor={{ theme: 'background' }}
                    colors={{ scheme: 'nivo' }}
                    childColor={{
                        from: 'color',
                        modifiers: [['brighter', 0.1]]
                    }}
                    enableArcLabels={true}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                        from: 'color',
                        modifiers: [['darker', 1.4]]
                    }}
                    theme={{
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
