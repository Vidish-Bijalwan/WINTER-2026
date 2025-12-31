import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function ParallelCoords({ className }: { className?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const { events } = useWikipediaData();

    useEffect(() => {
        if (!svgRef.current || events.length === 0) return;

        // Dimensions to visualize: Length, Namespace, IsBot (0/1), IsMinor (0/1)
        const dimensions = ['length', 'namespace', 'bot', 'minor'];

        const data = events.slice(0, 50).map(e => ({
            length: Math.abs(e.delta || 0),
            namespace: e.namespace,
            bot: e.bot ? 1 : 0,
            minor: e.minor ? 1 : 0
        }));

        const margin = { top: 30, right: 10, bottom: 10, left: 10 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = svgRef.current.clientHeight - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Build Y scales for each dimension
        const y: Record<string, any> = {};
        dimensions.forEach(name => {
            y[name] = d3.scaleLinear()
                .domain(d3.extent(data, (d: any) => d[name]) as [number, number])
                .range([height, 0]);
        });

        // Build X scale
        const x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);

        // Draw lines
        g.selectAll('path')
            .data(data)
            .join('path')
            .attr('d', (d: any) => {
                return d3.line()(dimensions.map(p => [x(p)!, y[p](d[p])]));
            })
            .style('fill', 'none')
            .style('stroke', '#3b82f6')
            .style('opacity', 0.5);

        // Draw axes
        g.selectAll('myAxis')
            .data(dimensions)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${x(d)},0)`)
            .each(function (d) { d3.select(this).call(d3.axisLeft(y[d])); })
            .append('text')
            .style('text-anchor', 'middle')
            .attr('y', -9)
            .text(d => d)
            .style('fill', 'white');

    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Multi-Dimensional Analysis</h3>
            <svg ref={svgRef} className="w-full h-[300px]" />
        </Card>
    );
}
