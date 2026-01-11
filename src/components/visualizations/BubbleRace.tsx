import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function BubbleRace({ className }: { className?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const { events } = useWikipediaData();
    const [editorCounts, setEditorCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        // Update counts
        const newCounts = { ...editorCounts };
        events.forEach(e => {
            newCounts[e.user] = (newCounts[e.user] || 0) + 1;
        });
        setEditorCounts(newCounts);
    }, [events]);

    useEffect(() => {
        if (!svgRef.current) return;

        const data = Object.entries(editorCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 15); // Top 15

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const pack = d3.pack<any>()
            .size([width, height])
            .padding(2);

        const root = d3.hierarchy<any>({ children: data } as any)
            .sum((d: any) => d.value);

        const nodes = pack(root).leaves();

        const g = svg.append('g');

        const node = g.selectAll('g')
            .data(nodes)
            .join('g')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        node.append('circle')
            .attr('r', d => d.r)
            .attr('fill', (d, i) => d3.schemeTableau10[i % 10])
            .attr('opacity', 0.8);

        node.append('text')
            .attr('dy', '0.3em')
            .style('text-anchor', 'middle')
            .style('font-size', d => Math.min(d.r / 2, 12))
            .style('fill', 'white')
            .text((d: any) => (d.data.name ? String(d.data.name).substring(0, 8) : ''));

    }, [editorCounts]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Top Editors Race</h3>
            <svg ref={svgRef} className="w-full h-[300px]" />
        </Card>
    );
}
