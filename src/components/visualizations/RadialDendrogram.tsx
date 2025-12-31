import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function RadialDendrogram({ className }: { className?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const { events } = useWikipediaData();

    useEffect(() => {
        if (!svgRef.current || events.length === 0) return;

        // Build hierarchy: Wiki -> User -> Article
        const data = {
            name: "Wiki",
            children: [] as any[]
        };

        const wikis: Record<string, any> = {};

        events.slice(0, 50).forEach(event => {
            const wiki = event.wiki || 'other';
            if (!wikis[wiki]) {
                wikis[wiki] = { name: wiki, children: [] };
                data.children.push(wikis[wiki]);
            }

            // Add user as child of wiki
            let userNode = wikis[wiki].children.find((c: any) => c.name === event.user);
            if (!userNode) {
                userNode = { name: event.user, children: [] };
                wikis[wiki].children.push(userNode);
            }

            // Add article as child of user
            userNode.children.push({ name: event.title.substring(0, 10), value: 1 });
        });

        const width = 600;
        const height = 600;
        const radius = width / 2;

        const tree = d3.cluster<any>()
            .size([2 * Math.PI, radius - 100]);

        const root = d3.hierarchy<any>(data);
        tree(root);

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg
            .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
            .append('g');

        // Links
        g.append('g')
            .attr('fill', 'none')
            .attr('stroke', '#555')
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', 1.5)
            .selectAll('path')
            .data(root.links())
            .join('path')
            .attr('d', d3.linkRadial<any, any>()
                .angle((d: any) => d.x)
                .radius((d: any) => d.y) as any);

        // Nodes
        const node = g.append('g')
            .selectAll('circle')
            .data(root.descendants())
            .join('circle')
            .attr('transform', (d: any) => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
            .attr('fill', (d: any) => d.children ? '#555' : '#999')
            .attr('r', 2.5);

        // Labels
        g.append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-width', 3)
            .selectAll('text')
            .data(root.descendants())
            .join('text')
            .attr('transform', (d: any) => `
        rotate(${d.x * 180 / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
            .attr('dy', '0.31em')
            .attr('x', (d: any) => d.x < Math.PI === !d.children ? 6 : -6)
            .attr('text-anchor', (d: any) => d.x < Math.PI === !d.children ? 'start' : 'end')
            .text((d: any) => d.data.name)
            .clone(true).lower()
            .attr('stroke', 'white');

    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Topic Clustering</h3>
            <div className="flex justify-center overflow-hidden">
                <svg ref={svgRef} className="w-full h-[300px]" />
            </div>
        </Card>
    );
}
