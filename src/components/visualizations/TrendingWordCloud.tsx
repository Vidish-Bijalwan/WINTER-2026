import { useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function TrendingWordCloud({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [words, setWords] = useState<any[]>([]);

    useEffect(() => {
        const wordCounts: Record<string, number> = {};
        const stopWords = new Set(['the', 'and', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as']);

        events.forEach(event => {
            // Extract words from title and comment
            const text = `${event.title} ${event.comment || ''}`;
            text.toLowerCase().split(/\W+/).forEach(word => {
                if (word.length > 3 && !stopWords.has(word) && !/^\d+$/.test(word)) {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                }
            });
        });

        const wordList = Object.entries(wordCounts)
            .map(([text, value]) => ({ text, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 50);

        setWords(wordList);
    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Trending Topics</h3>
            <div className="h-[300px]">
                <ReactWordcloud
                    words={words}
                    options={{
                        rotations: 2,
                        rotationAngles: [-90, 0],
                        fontSizes: [12, 60],
                        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                        enableTooltip: true,
                        deterministic: false,
                        fontFamily: 'Inter',
                    }}
                />
            </div>
        </Card>
    );
}
