import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: 'user' | 'article';
    value: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
}

export default function ForceGraph({ className }: { className?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const { events } = useWikipediaData();
    const [stats, setStats] = useState({ nodes: 0, links: 0 });

    useEffect(() => {
        if (!svgRef.current || events.length === 0) return;

        // Process data into nodes and links
        const nodesMap = new Map<string, Node>();
        const links: Link[] = [];

        events.slice(0, 50).forEach(event => {
            // User node
            if (!nodesMap.has(event.user)) {
                nodesMap.set(event.user, { id: event.user, group: 'user', value: 1 });
            } else {
                nodesMap.get(event.user)!.value++;
            }

            // Article node
            if (!nodesMap.has(event.title)) {
                nodesMap.set(event.title, { id: event.title, group: 'article', value: 1 });
            } else {
                nodesMap.get(event.title)!.value++;
            }

            // Link
            links.push({ source: event.user, target: event.title });
        });

        const nodes = Array.from(nodesMap.values());
        setStats({ nodes: nodes.length, links: links.length });

        // Clear previous graph
        d3.select(svgRef.current).selectAll('*').remove();

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        const svg = d3.select(svgRef.current)
            .attr('viewBox', [0, 0, width, height]);

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(20));

        const link = svg.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke-width', 1);

        const node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', d => d.group === 'user' ? 5 : 8)
            .attr('fill', d => d.group === 'user' ? '#3b82f6' : '#10b981')
            .call(drag(simulation) as any);

        node.append('title')
            .text(d => d.id);

        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node
                .attr('cx', (d: any) => d.x)
                .attr('cy', (d: any) => d.y);
        });

        function drag(simulation: d3.Simulation<Node, undefined>) {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        return () => {
            simulation.stop();
        };
    }, [events]);

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">Editor-Article Network</h3>
                <div className="flex gap-2">
                    <Badge variant="secondary">{stats.nodes} Nodes</Badge>
                    <Badge variant="secondary">{stats.links} Links</Badge>
                </div>
            </div>
            <svg ref={svgRef} className="w-full h-[300px] bg-slate-950/50 rounded-lg" />
        </Card>
    );
}
