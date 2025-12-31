import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  TrendingUp,
  ChevronRight,
  Bot,
  FileEdit
} from "lucide-react";
import { useWikipediaData } from "@/context/WikipediaDataContext";

interface Anomaly {
  id: string;
  title: string;
  severity: "warning" | "critical" | "info";
  source: string;
  timestamp: string;
  description: string;
  confidence: number;
  bettiChange?: string;
}

interface AnomalyListProps {
  className?: string;
  anomalies?: Anomaly[];
  maxItems?: number;
}

export function AnomalyList({ className, anomalies: propAnomalies, maxItems = 6 }: AnomalyListProps) {
  const contextData = useWikipediaData();
  const items = propAnomalies || contextData.anomalies.slice(0, maxItems);

  const severityIcon = {
    critical: <ShieldAlert className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <TrendingUp className="w-4 h-4" />,
  };

  const severityBadge = {
    critical: "critical" as const,
    warning: "anomaly" as const,
    info: "info" as const,
  };

  if (items.length === 0) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-2"
        >
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <p className="text-sm font-medium">No Anomalies Detected</p>
          <p className="text-xs text-muted-foreground">
            System is operating within normal topological parameters
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode="popLayout">
        {items.map((anomaly, i) => (
          <motion.div
            key={anomaly.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ delay: i * 0.05 }}
            layout
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-card/50 p-4 cursor-pointer transition-all duration-300",
              anomaly.severity === "critical" 
                ? "border-critical/30 hover:border-critical/50" 
                : anomaly.severity === "warning"
                ? "border-anomaly/20 hover:border-anomaly/40"
                : "border-border hover:border-border/80"
            )}
          >
            {/* Status glow */}
            {anomaly.severity === "critical" && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-critical"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {anomaly.severity === "warning" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-anomaly" />
            )}

            <div className="flex items-start gap-3 pl-2">
              {/* Icon */}
              <div className={cn(
                "mt-0.5 p-1.5 rounded-lg",
                anomaly.severity === "critical" ? "bg-critical/20 text-critical" :
                anomaly.severity === "warning" ? "bg-anomaly/20 text-anomaly" :
                "bg-info/20 text-info"
              )}>
                {severityIcon[anomaly.severity]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{anomaly.title}</h4>
                  <Badge variant={severityBadge[anomaly.severity]} className="shrink-0">
                    {anomaly.severity}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {anomaly.description}
                </p>

                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{anomaly.source}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{anomaly.timestamp}</span>
                  </div>
                  {anomaly.bettiChange && (
                    <div className="flex items-center gap-1 font-mono text-primary">
                      <span>{anomaly.bettiChange}</span>
                    </div>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <span>Confidence: {anomaly.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* New indicator pulse */}
            {i === 0 && (
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default AnomalyList;
