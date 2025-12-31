import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { useMemo } from "react";

interface TopologyVisualizerProps {
  className?: string;
  variant?: "hero" | "compact" | "dashboard";
}

// Generates animated nodes representing topological features from live data
export function TopologyVisualizer({ className, variant = "hero" }: TopologyVisualizerProps) {
  const { bettiNumbers, isConnected, recentEvents } = useWikipediaData();

  // Compute dynamic node count based on Betti numbers
  const baseNodeCount = variant === "hero" ? 24 : variant === "dashboard" ? 12 : 8;
  const dynamicNodeCount = isConnected
    ? Math.max(baseNodeCount, Math.min(bettiNumbers.h0 + bettiNumbers.h1, 40))
    : baseNodeCount;

  // Generate nodes - more nodes when more connected components detected
  const nodes = useMemo(() => {
    // Use event data to seed node positions for consistency when connected
    const seed = recentEvents.length > 0 ? recentEvents[0].id.charCodeAt(0) : 42;
    return Array.from({ length: dynamicNodeCount }, (_, i) => {
      const pseudoRandom = Math.sin(seed + i * 0.7) * 0.5 + 0.5;
      const pseudoRandom2 = Math.cos(seed + i * 0.9) * 0.5 + 0.5;
      return {
        id: i,
        x: 10 + pseudoRandom * 80,
        y: 10 + pseudoRandom2 * 80,
        size: 4 + (pseudoRandom * pseudoRandom2) * 8,
        delay: pseudoRandom * 2,
        duration: 3 + pseudoRandom2 * 4,
      };
    });
  }, [dynamicNodeCount, recentEvents]);

  // Generate connections between nearby nodes
  const connections: { from: number; to: number; opacity: number }[] = [];
  nodes.forEach((node, i) => {
    nodes.slice(i + 1).forEach((other, j) => {
      const distance = Math.sqrt(
        Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
      );
      if (distance < 35) {
        connections.push({
          from: i,
          to: i + j + 1,
          opacity: Math.max(0.1, 1 - distance / 35),
        });
      }
    });
  });

  const containerSize = variant === "hero" ? "w-full h-full min-h-[500px]" :
    variant === "dashboard" ? "w-full h-64" : "w-48 h-48";

  return (
    <div className={cn("relative overflow-hidden", containerSize, className)}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Connection lines */}
        <g>
          {connections.map((conn, i) => (
            <motion.line
              key={`conn-${i}`}
              x1={nodes[conn.from].x || 0}
              y1={nodes[conn.from].y || 0}
              x2={nodes[conn.to].x || 0}
              y2={nodes[conn.to].y || 0}
              stroke="hsl(var(--primary))"
              strokeWidth={0.3}
              strokeOpacity={conn.opacity * 0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0, conn.opacity * 0.5, conn.opacity * 0.3],
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3,
              }}
            />
          ))}
        </g>

        {/* Animated nodes */}
        <g>
          {nodes.map((node) => (
            <motion.g key={node.id}>
              {/* Glow effect */}
              <motion.circle
                cx={node.x || 0}
                cy={node.y || 0}
                r={(node.size || 0) * 1.5}
                fill="hsl(var(--primary))"
                opacity={0.1}
                initial={{ r: (node.size || 0) * 1.5 }}
                animate={{
                  r: [(node.size || 0) * 1.5, (node.size || 0) * 2.5, (node.size || 0) * 1.5],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: node.duration,
                  delay: node.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Main node */}
              <motion.circle
                cx={node.x || 0}
                cy={node.y || 0}
                r={(node.size || 0) / 2}
                fill="hsl(var(--primary))"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: [0.6, 1, 0.6],
                  y: [0, -2, 0],
                }}
                transition={{
                  scale: { duration: 0.5, delay: node.delay },
                  opacity: { duration: node.duration, delay: node.delay, repeat: Infinity },
                  y: { duration: node.duration, delay: node.delay, repeat: Infinity },
                }}
              />
            </motion.g>
          ))}
        </g>

        {/* Morphing shape representing topological structure */}
        <motion.ellipse
          cx="50"
          cy="50"
          rx={25}
          ry={20}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          strokeOpacity="0.3"
          initial={{ rx: 25, ry: 20 }}
          animate={{
            rx: [25, 30, 20, 25],
            ry: [20, 15, 25, 20],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
}

export default TopologyVisualizer;
