import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { useMemo } from "react";

interface RiskHeatmapProps {
  className?: string;
}

export function RiskHeatmap({ className }: RiskHeatmapProps) {
  const { riskHeatmap, isConnected } = useWikipediaData();

  // Use context data or fallback to defaults
  const { gridData, labels } = useMemo(() => {
    if (riskHeatmap.grid.length > 0) {
      return { gridData: riskHeatmap.grid, labels: riskHeatmap.labels };
    }
    // Fallback empty grid
    return {
      gridData: [
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      ],
      labels: {
        x: ['EN', 'DE', 'FR', 'ES', 'JA', 'ZH', 'COM'],
        y: ['Main', 'Talk', 'User', 'Wiki', 'File', 'Template'],
      },
    };
  }, [riskHeatmap]);

  const getColor = (value: number) => {
    if (value >= 0.8) return "hsl(var(--critical))";
    if (value >= 0.6) return "hsl(var(--anomaly))";
    if (value >= 0.4) return "hsl(var(--info))";
    return "hsl(var(--primary) / 0.3)";
  };

  const getOpacity = (value: number) => {
    return 0.3 + value * 0.7;
  };

  return (
    <div className={cn("relative bg-card/50 rounded-xl p-4 border border-border/50", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Risk Heatmap</span>
          <span className="text-[10px] text-muted-foreground">Wiki × Namespace</span>
          {isConnected && (
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-success"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <div className="flex gap-2 text-[9px]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-primary/30" />
            <span className="text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-info" />
            <span className="text-muted-foreground">Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-anomaly" />
            <span className="text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-critical" />
            <span className="text-muted-foreground">Critical</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Y-axis labels */}
        <div className="flex flex-col gap-1 pt-5">
          {labels.y.map((label) => (
            <div 
              key={label} 
              className="h-8 flex items-center text-[10px] text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          {/* X-axis labels */}
          <div className="flex gap-1 mb-1">
            {labels.x.map((label) => (
              <div 
                key={label} 
                className="flex-1 text-center text-[10px] text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap cells */}
          <div className="space-y-1">
            {gridData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((value, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (rowIndex * row.length + colIndex) * 0.01 }}
                    className="flex-1 h-8 rounded cursor-pointer transition-transform hover:scale-105 relative"
                    style={{
                      backgroundColor: getColor(value),
                      opacity: getOpacity(value),
                    }}
                    title={`${labels.y[rowIndex]} × ${labels.x[colIndex]}: ${(value * 100).toFixed(0)}% risk`}
                  >
                    {value >= 0.8 && (
                      <motion.div
                        className="absolute inset-0 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ backgroundColor: "hsl(var(--critical) / 0.3)" }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info text */}
      {!isConnected && (
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          Connect to Wikipedia stream to see live risk distribution
        </p>
      )}
    </div>
  );
}

export default RiskHeatmap;
