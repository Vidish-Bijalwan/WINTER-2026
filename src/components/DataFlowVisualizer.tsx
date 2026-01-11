import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWikipediaData } from "@/context/WikipediaDataContext";

interface DataFlowVisualizerProps {
  className?: string;
}

export function DataFlowVisualizer({ className }: DataFlowVisualizerProps) {
  const { pipelineStages, isConnected } = useWikipediaData();

  return (
    <div className={cn("relative p-4", className)}>
      <div className="flex items-center justify-between">
        {pipelineStages.map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            {/* Stage node */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="relative"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300",
                  stage.status === "active"
                    ? "border-primary bg-primary/10"
                    : stage.status === "error"
                    ? "border-critical bg-critical/10"
                    : "border-border bg-card/50"
                )}
              >
                {stage.status === "active" && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  {stage.label}
                </span>
                <motion.span 
                  className={cn(
                    "text-xs font-mono mt-0.5",
                    stage.status === "active" ? "text-primary" : "text-muted-foreground"
                  )}
                  key={stage.throughput}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {stage.throughput}
                </motion.span>
              </div>
            </motion.div>

            {/* Connector */}
            {i < pipelineStages.length - 1 && (
              <div className="relative w-12 h-[2px] mx-2">
                <div className="absolute inset-0 bg-border" />
                {stage.status === "active" && pipelineStages[i + 1]?.status !== "idle" && (
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
                {/* Data particles */}
                {stage.status === "active" && isConnected && (
                  <motion.div
                    className="absolute w-2 h-2 rounded-full bg-primary shadow-glow-primary"
                    animate={{ x: [0, 48] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    style={{ top: -3 }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pipeline description */}
      <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-muted-foreground">
        <span>SSE → Parse → Extract Features → TDA Analysis → Anomaly Detection → Alert</span>
      </div>
    </div>
  );
}

export default DataFlowVisualizer;
