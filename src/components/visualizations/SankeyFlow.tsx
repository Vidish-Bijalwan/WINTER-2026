import { useEffect, useState } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function SankeyFlow({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [data, setData] = useState({ nodes: [], links: [] });

    useEffect(() => {
        // Transform events into flow data: User Type -> Namespace -> Action
        const nodesSet = new Set<string>();
        const linksMap = new Map<string, number>();

        events.slice(0, 100).forEach(event => {
            const userType = event.bot ? 'Bot' : 'Human';
            const namespace = event.namespace === 0 ? 'Article' : 'Talk/Other';
            const action = event.type === 'new' ? 'Create' : 'Edit';

            // Add nodes
            nodesSet.add(userType);
            nodesSet.add(namespace);
            nodesSet.add(action);

            // Link 1: User Type -> Namespace
            const link1 = `${userType}|${namespace}`;
            linksMap.set(link1, (linksMap.get(link1) || 0) + 1);

            // Link 2: Namespace -> Action
            const link2 = `${namespace}|${action}`;
            linksMap.set(link2, (linksMap.get(link2) || 0) + 1);
        });

        const nodes = Array.from(nodesSet).map(id => ({ id }));
        const links = Array.from(linksMap.entries()).map(([key, value]) => {
            const [source, target] = key.split('|');
            return { source, target, value };
        });

        // Ensure valid Sankey data structure
        if (nodes.length > 0 && links.length > 0) {
            setData({ nodes: nodes as any, links: links as any });
        }
    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Edit Flow Analysis</h3>
            <div className="h-[300px]">
                <ResponsiveSankey
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    align="justify"
                    colors={{ scheme: 'category10' }}
                    nodeOpacity={1}
                    nodeHoverOthersOpacity={0.35}
                    nodeThickness={18}
                    nodeSpacing={24}
                    nodeBorderWidth={0}
                    nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
                    linkOpacity={0.5}
                    linkHoverOthersOpacity={0.1}
                    enableLinkGradient={true}
                    labelPosition="outside"
                    labelOrientation="vertical"
                    labelPadding={16}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                    theme={{
                        text: { fill: '#888888' },
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
