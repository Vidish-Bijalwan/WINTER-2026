import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { useMemo } from "react";

interface AnomalyTimelineProps {
  className?: string;
}

export function AnomalyTimeline({ className }: AnomalyTimelineProps) {
  const { timeline, isConnected } = useWikipediaData();

  // Use timeline from context or generate empty placeholder
  const timelineData = useMemo(() => {
    if (timeline.length > 0) {
      return timeline;
    }
    // Generate empty timeline placeholder
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      timestamp: new Date(),
      value: 0.1 + Math.random() * 0.1,
      anomaly: false,
      eventCount: 0,
    }));
  }, [timeline]);

  const maxValue = Math.max(...timelineData.map(d => d.value), 0.1);
  const width = 100 / (timelineData.length - 1);

  // Create path for the line chart
  const pathData = timelineData.map((point, i) => {
    const x = i * width;
    const y = 100 - (point.value / maxValue) * 80;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create area path
  const areaPath = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className={cn("relative bg-card/50 rounded-xl p-4 border border-border/50", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Anomaly Timeline</span>
          {isConnected && (
            <motion.div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px]"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Live
            </motion.div>
          )}
        </div>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-anomaly" />
            <span className="text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-critical" />
            <span className="text-muted-foreground">Critical</span>
          </div>
        </div>
      </div>

      <svg
        className="w-full h-32"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--primary-glow))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g opacity="0.1">
          {[25, 50, 75].map((y) => (
            <line
              key={y}
              x1="0" y1={y} x2="100" y2={y}
              stroke="hsl(var(--foreground))"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Anomaly markers */}
        {timelineData.map((point, i) => {
          if (!point.anomaly) return null;
          const x = i * width;
          const y = 100 - (point.value / maxValue) * 80;
          const isCritical = 'severity' in point && point.severity === "critical";

          return (
            <motion.g key={i}>
              {/* Pulse effect */}
              <motion.circle
                cx={x || 0}
                cy={y || 0}
                r="8"
                fill={isCritical ? "hsl(var(--critical))" : "hsl(var(--anomaly))"}
                opacity="0.3"
                animate={{
                  r: [8, 15, 8],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              {/* Point */}
              <motion.circle
                cx={x || 0}
                cy={y || 0}
                r="4"
                fill={isCritical ? "hsl(var(--critical))" : "hsl(var(--anomaly))"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 + 0.5, type: "spring" }}
              />
            </motion.g>
          );
        })}

        {/* Latest point indicator */}
        {timelineData.length > 0 && (
          <motion.circle
            cx={100}
            cy={100 - (timelineData[timelineData.length - 1].value / maxValue) * 80}
            r="4"
            fill="hsl(var(--primary))"
            animate={{
              r: [4, 6, 4],
              opacity: [1, 0.7, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        {timelineData.filter((_, i) => i % Math.max(1, Math.floor(timelineData.length / 6)) === 0).map((point, i) => (
          <span key={i}>{point.time}</span>
        ))}
      </div>

      {/* Event count overlay */}
      {isConnected && timeline.length > 0 && (
        <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground bg-card/80 px-2 py-1 rounded">
          {timeline[timeline.length - 1]?.eventCount || 0} events/interval
        </div>
      )}
    </div>
  );
}

export default AnomalyTimeline;
