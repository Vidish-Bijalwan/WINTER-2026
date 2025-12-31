import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { extractGeoLocation } from '@/lib/geoUtils';

function GlobeParticles() {
    const { events } = useWikipediaData();
    const pointsRef = useRef<THREE.Points>(null);
    const [positions, setPositions] = useState<Float32Array>(new Float32Array(0));

    useEffect(() => {
        const particles: number[] = [];

        events.slice(0, 500).forEach(event => {
            const geo = extractGeoLocation(event);
            if (!geo) return;

            // Convert lat/lng to 3D sphere coordinates
            const phi = (90 - geo.lat) * (Math.PI / 180);
            const theta = (geo.lng + 180) * (Math.PI / 180);
            const radius = 2.1;

            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);

            particles.push(x, y, z);
        });

        setPositions(new Float32Array(particles));
    }, [events]);

    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.001;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#10b981"
                sizeAttenuation
                transparent
                opacity={0.8}
            />
        </points>
    );
}

function RotatingGlobe() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial
                color="#1e293b"
                wireframe
                opacity={0.1}
                transparent
            />
        </mesh>
    );
}

export default function Globe3D({ className }: { className?: string }) {
    return (
        <div className={className}>
            <div className="p-4 bg-card rounded-lg border">
                <h3 className="text-sm font-semibold mb-3">3D Globe Visualization</h3>
                <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden bg-slate-950">
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />

                        <RotatingGlobe />
                        <GlobeParticles />

                        <OrbitControls
                            enableZoom={true}
                            enablePan={false}
                            minDistance={3}
                            maxDistance={8}
                        />
                    </Canvas>
                </div>
            </div>
        </div>
    );
}
