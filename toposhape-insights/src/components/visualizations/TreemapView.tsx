import { useEffect, useState } from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function TreemapView({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Group by Language -> Namespace -> Article
        const root = {
            name: 'Wikipedia',
            children: [] as any[]
        };

        const langs: Record<string, any> = {};

        events.slice(0, 100).forEach(event => {
            const lang = event.wiki || 'other';

            if (!langs[lang]) {
                langs[lang] = { name: lang, children: [] };
                root.children.push(langs[lang]);
            }

            // Limit children per language to avoid clutter
            if (langs[lang].children.length < 20) {
                langs[lang].children.push({
                    name: event.title.substring(0, 15) + (event.title.length > 15 ? '...' : ''),
                    loc: Math.abs(event.delta || 100) // Size by edit magnitude
                });
            }
        });

        setData(root);
    }, [events]);

    if (!data) return null;

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Volume by Language & Article</h3>
            <div className="h-[300px]">
                <ResponsiveTreeMap
                    data={data}
                    identity="name"
                    value="loc"
                    valueFormat=".02s"
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    labelSkipSize={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
                    parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    colors={{ scheme: 'nivo' }}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.1]] }}
                    theme={{
                        text: { fill: '#ffffff', fontWeight: 600 },
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
