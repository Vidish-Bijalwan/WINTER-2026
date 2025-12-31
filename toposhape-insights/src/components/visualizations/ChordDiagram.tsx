import { useEffect, useState } from 'react';
import { ResponsiveChord } from '@nivo/chord';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function ChordDiagram({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [matrix, setMatrix] = useState<number[][]>([]);
    const [keys, setKeys] = useState<string[]>([]);

    useEffect(() => {
        // Simulate cross-wiki flow (since we only have destination wiki, we'll mock source for demo)
        // In real scenario, we'd track user movement across wikis
        const wikis = ['en', 'de', 'fr', 'es', 'it'];
        const size = wikis.length;
        const mat = Array(size).fill(0).map(() => Array(size).fill(0));

        events.forEach(event => {
            const destWiki = (event.wiki || 'en').substring(0, 2);
            const destIndex = wikis.indexOf(destWiki);

            if (destIndex !== -1) {
                // Mock source: random other wiki or self
                const sourceIndex = Math.floor(Math.random() * size);
                mat[sourceIndex][destIndex] += 1;
            }
        });

        setMatrix(mat);
        setKeys(wikis.map(w => w.toUpperCase()));
    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Cross-Wiki Edit Flow</h3>
            <div className="h-[300px]">
                <ResponsiveChord
                    data={matrix}
                    keys={keys}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    valueFormat=".2f"
                    padAngle={0.02}
                    innerRadiusRatio={0.96}
                    innerRadiusOffset={0.02}
                    inactiveArcOpacity={0.25}
                    arcBorderColor={{
                        from: 'color',
                        modifiers: [['darker', 0.6]]
                    }}
                    activeRibbonOpacity={0.75}
                    ribbonBorderColor={{
                        from: 'color',
                        modifiers: [['darker', 0.6]]
                    }}
                    labelRotation={-90}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [['darker', 1]]
                    }}
                    colors={{ scheme: 'category10' }}
                    theme={{
                        text: { fill: '#888888' },
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
