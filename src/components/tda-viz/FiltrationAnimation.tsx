import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersistencePoint } from '@/lib/topologyAnalysis';

interface FiltrationAnimationProps {
    data: PersistencePoint[];
}

export function FiltrationAnimation({ data }: FiltrationAnimationProps) {
    const [filtrationValue, setFiltrationValue] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const requestRef = useRef<number>();

    // Normalize data to 0-1 range if not already
    const maxVal = Math.max(...data.map(d => d.death), 1);

    const animate = (time: number) => {
        setFiltrationValue(prev => {
            const next = prev + 0.005;
            return next > 1.1 ? 0 : next; // Loop
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying]);

    const activeFeatures = data.filter(p =>
        (p.birth / maxVal) <= filtrationValue && (p.death / maxVal) >= filtrationValue
    );

    const deadFeatures = data.filter(p =>
        (p.death / maxVal) < filtrationValue
    );

    return (
        <div className="w-full h-full flex flex-col p-4 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 z-10">
                <h3 className="text-sm font-medium">Filtration Process</h3>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-2 py-1 rounded transition-colors"
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 relative border border-border/30 rounded-lg bg-slate-950/50 backdrop-blur-sm overflow-hidden">
                {/* Growing circles representing filtration */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* We simulate the filtration on a 2D plane. 
               Since we don't have the original point cloud coordinates here (only persistence pairs),
               we'll create a synthetic visualization where features "pop" into existence.
           */}

                    <AnimatePresence>
                        {activeFeatures.map((p) => (
                            <motion.div
                                key={p.id}
                                layoutId={p.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.8 }}
                                exit={{ scale: 0.5, opacity: 0 }} // When it dies (merges)
                                className={`absolute rounded-full border-2 ${p.dimension === 0 ? 'border-blue-500 bg-blue-500/20' :
                                        p.dimension === 1 ? 'border-green-500 bg-green-500/20' :
                                            'border-orange-500 bg-orange-500/20'
                                    }`}
                                style={{
                                    // Random positions seeded by ID for stability
                                    left: `${(parseInt(p.id.slice(-4), 16) % 80) + 10}%`,
                                    top: `${(parseInt(p.id.slice(-3), 16) % 80) + 10}%`,
                                    width: '40px',
                                    height: '40px',
                                }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Dead features (merged) leave a trace */}
                    {deadFeatures.map((p) => (
                        <div
                            key={p.id}
                            className={`absolute rounded-full border ${p.dimension === 0 ? 'border-blue-900/30' :
                                    p.dimension === 1 ? 'border-green-900/30' :
                                        'border-orange-900/30'
                                }`}
                            style={{
                                left: `${(parseInt(p.id.slice(-4), 16) % 80) + 10}%`,
                                top: `${(parseInt(p.id.slice(-3), 16) % 80) + 10}%`,
                                width: '40px',
                                height: '40px',
                                opacity: 0.2
                            }}
                        />
                    ))}
                </div>

                {/* Water level indicator */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-primary/10 border-t border-primary/30 transition-all duration-75 ease-linear pointer-events-none"
                    style={{ height: `${filtrationValue * 100}%` }}
                />

                <div className="absolute top-2 right-2 font-mono text-xs text-muted-foreground">
                    ε = {filtrationValue.toFixed(3)}
                </div>
            </div>
        </div>
    );
}
