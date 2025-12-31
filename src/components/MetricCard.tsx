import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
  className?: string;
  icon?: React.ReactNode;
  delay?: number;
  animate?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  status = "normal",
  className,
  icon,
  delay = 0,
  animate = true,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState(false);
  const previousValueRef = useRef(value);

  // Animate value changes
  useEffect(() => {
    if (value !== previousValueRef.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      
      if (typeof value === 'number' && typeof previousValueRef.current === 'number') {
        // Animate number change
        const start = previousValueRef.current;
        const end = value;
        const duration = 500;
        const startTime = Date.now();
        
        const animateNumber = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(start + (end - start) * eased);
          setDisplayValue(current);
          
          if (progress < 1) {
            requestAnimationFrame(animateNumber);
          }
        };
        animateNumber();
      } else {
        setDisplayValue(value);
      }
      previousValueRef.current = value;
    }
  }, [value]);

  const statusStyles = {
    normal: "border-border hover:border-success/30",
    warning: "border-anomaly/30 shadow-glow-anomaly",
    critical: "border-critical/50 shadow-glow-critical",
  };

  const trendIcon = {
    up: <TrendingUp className="w-3 h-3" />,
    down: <TrendingDown className="w-3 h-3" />,
    stable: <Minus className="w-3 h-3" />,
  };

  const trendColor = {
    up: "text-success",
    down: "text-critical",
    stable: "text-muted-foreground",
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm p-4 transition-all duration-300",
        statusStyles[status],
        flash && "ring-2 ring-primary/50",
        className
      )}
    >
      {/* Gradient overlay for status */}
      {status !== "normal" && (
        <div 
          className={cn(
            "absolute inset-0 opacity-5",
            status === "warning" ? "bg-anomaly" : "bg-critical"
          )} 
        />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-end gap-2">
          <AnimatePresence mode="wait">
            <motion.span 
              key={String(displayValue)}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-semibold font-mono tracking-tight"
            >
              {displayValue}
            </motion.span>
          </AnimatePresence>
          {trend && trendValue && (
            <div className={cn("flex items-center gap-0.5 text-xs mb-1", trendColor[trend])}>
              {trendIcon[trend]}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {/* Animated border for critical status */}
      {status === "critical" && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-critical"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export default MetricCard;
