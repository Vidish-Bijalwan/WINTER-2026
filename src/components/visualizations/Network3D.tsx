import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

interface Node3D {
    id: string;
    position: [number, number, number];
    color: string;
}

interface Link3D {
    start: [number, number, number];
    end: [number, number, number];
}

function NetworkNodes({ events }: { events: { user: string; bot: boolean }[] }) {
    const [nodes, setNodes] = useState<Node3D[]>([]);
    const [links, setLinks] = useState<Link3D[]>([]);

    useEffect(() => {
        // Create random 3D layout for nodes
        const newNodes: Node3D[] = events.slice(0, 50).map((e, i) => ({
            id: e.user,
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            color: e.bot ? '#3b82f6' : '#10b981'
        }));

        // Create links between close nodes
        const newLinks: Link3D[] = [];
        for (let i = 0; i < newNodes.length; i++) {
            for (let j = i + 1; j < newNodes.length; j++) {
                if (Math.random() > 0.9) { // Random connections for demo
                    newLinks.push({
                        start: newNodes[i].position,
                        end: newNodes[j].position
                    });
                }
            }
        }

        setNodes(newNodes);
        setLinks(newLinks);
    }, [events]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Gentle rotation or movement could go here
    });

    return (
        <group>
            {nodes.map((node, i) => (
                <Sphere key={i} position={node.position} args={[0.2, 16, 16]}>
                    <meshStandardMaterial color={node.color} />
                </Sphere>
            ))}
            {links.map((link, i) => (
                <Line
                    key={i}
                    points={[link.start, link.end]}
                    color="#555"
                    lineWidth={1}
                    transparent
                    opacity={0.3}
                />
            ))}
        </group>
    );
}

export default function Network3D({ className }: { className?: string }) {
    const { events } = useWikipediaData();

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">3D Network Topology</h3>
            <div className="h-[300px] bg-slate-950 rounded-lg overflow-hidden">
                <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ preserveDrawingBuffer: true }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <NetworkNodes events={events} />
                    <OrbitControls autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>
        </Card>
    );
}
