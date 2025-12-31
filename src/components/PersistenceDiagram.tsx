import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { useMemo } from "react";

interface PersistenceDiagramProps {
  className?: string;
  data?: { birth: number; death: number; dimension: number; id: string }[];
  animated?: boolean;
}

// Persistence diagram visualization - core TDA output
export function PersistenceDiagram({
  className,
  data,
  animated = true
}: PersistenceDiagramProps) {
  const { persistenceDiagram, isConnected } = useWikipediaData();

  // Use live data from context, or props, or fallback
  const points = useMemo(() => {
    if (data && data.length > 0) return data;
    if (persistenceDiagram.length > 0) return persistenceDiagram;
    // Fallback placeholder data
    return [
      { id: 'p0', birth: 0.1, death: 0.8, dimension: 0 },
      { id: 'p1', birth: 0.15, death: 0.6, dimension: 0 },
      { id: 'p2', birth: 0.2, death: 0.75, dimension: 1 },
      { id: 'p3', birth: 0.3, death: 0.9, dimension: 1 },
      { id: 'p4', birth: 0.25, death: 0.5, dimension: 0 },
      { id: 'p5', birth: 0.4, death: 0.85, dimension: 2 },
      { id: 'p6', birth: 0.35, death: 0.7, dimension: 1 },
    ];
  }, [data, persistenceDiagram]);

  const getDimensionColor = (dim: number) => {
    switch (dim) {
      case 0: return "var(--topo-h0)";
      case 1: return "var(--topo-h1)";
      case 2: return "var(--topo-h2)";
      default: return "var(--primary)";
    }
  };

  return (
    <div className={cn("relative bg-card/50 rounded-xl p-4 border border-border/50", className)}>
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Persistence Diagram</span>
        {isConnected && (
          <motion.div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[9px]"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1 h-1 rounded-full bg-success" />
            Live
          </motion.div>
        )}
      </div>

      <svg
        className="w-full h-full min-h-[200px]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        <g opacity="0.2">
          {[20, 40, 60, 80].map((pos) => (
            <g key={pos}>
              <line
                x1="10" y1={pos} x2="90" y2={pos}
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <line
                x1={pos} y1="10" x2={pos} y2="90"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </g>
          ))}
        </g>

        {/* Diagonal line (birth = death) */}
        <line
          x1="10" y1="90" x2="90" y2="10"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />

        {/* Points */}
        {points.map((point, i) => {
          const x = 10 + point.birth * 80;
          const y = 90 - point.death * 80;
          const persistence = point.death - point.birth;
          const size = 2 + persistence * 4;

          return (
            <motion.g key={i}>
              {/* Glow */}
              <motion.circle
                cx={x || 0}
                cy={y || 0}
                r={(size || 0) * 2}
                fill={`hsl(${getDimensionColor(point.dimension)})`}
                opacity={0.2}
                initial={animated ? { scale: 0 } : {}}
                animate={animated ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.3, 0.2],
                } : {}}
                transition={{
                  delay: i * 0.1,
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              {/* Point */}
              <motion.circle
                cx={x || 0}
                cy={y || 0}
                r={size || 0}
                fill={`hsl(${getDimensionColor(point.dimension)})`}
                initial={animated ? { scale: 0, opacity: 0 } : {}}
                animate={animated ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              />
            </motion.g>
          );
        })}

        {/* Axis labels */}
        <text x="50" y="98" textAnchor="middle" className="fill-muted-foreground text-[4px]">
          Birth
        </text>
        <text x="5" y="50" textAnchor="middle" className="fill-muted-foreground text-[4px]" transform="rotate(-90, 5, 50)">
          Death
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex gap-3 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-topo-h0" />
          <span className="text-muted-foreground">H₀</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-topo-h1" />
          <span className="text-muted-foreground">H₁</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-topo-h2" />
          <span className="text-muted-foreground">H₂</span>
        </div>
      </div>
    </div>
  );
}

export default PersistenceDiagram;
