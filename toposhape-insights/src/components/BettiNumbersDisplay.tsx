import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { useEffect, useState, useRef } from "react";

interface BettiNumbersDisplayProps {
  className?: string;
  h0?: number;
  h1?: number;
  h2?: number;
  animated?: boolean;
}

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousRef = useRef(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (value !== previousRef.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      
      const start = previousRef.current;
      const end = value;
      const duration = 400;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(start + (end - start) * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
      previousRef.current = value;
    }
  }, [value]);

  return (
    <motion.div
      className={cn(
        "text-3xl font-bold font-mono transition-colors",
        flash && "text-primary",
        className
      )}
      key={value}
    >
      {displayValue}
    </motion.div>
  );
}

export function BettiNumbersDisplay({
  className,
  h0: propH0,
  h1: propH1,
  h2: propH2,
  animated = true,
}: BettiNumbersDisplayProps) {
  const contextData = useWikipediaData();
  
  // Use props if provided, otherwise use context
  const h0 = propH0 ?? contextData.bettiNumbers.h0;
  const h1 = propH1 ?? contextData.bettiNumbers.h1;
  const h2 = propH2 ?? contextData.bettiNumbers.h2;

  const bettiData = [
    { 
      label: "β₀", 
      name: "Components", 
      value: h0, 
      description: "Distinct editing clusters",
      color: "topo-h0"
    },
    { 
      label: "β₁", 
      name: "Loops", 
      value: h1, 
      description: "Collaborative cycles",
      color: "topo-h1"
    },
    { 
      label: "β₂", 
      name: "Voids", 
      value: h2, 
      description: "Cross-wiki patterns",
      color: "topo-h2"
    },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {bettiData.map((betti, i) => (
        <motion.div
          key={betti.label}
          initial={animated ? { opacity: 0, scale: 0.9 } : {}}
          animate={animated ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: i * 0.1, type: "spring" }}
          className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 text-center"
        >
          {/* Glow effect */}
          <div 
            className={cn(
              "absolute inset-0 opacity-10",
              `bg-${betti.color}`
            )}
          />
          
          <div className="relative z-10">
            <div className={cn("text-xs font-medium mb-1", `text-${betti.color}`)}>
              {betti.label}
            </div>
            <AnimatedNumber value={betti.value} />
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              {betti.name}
            </div>
          </div>

          {/* Animated indicator */}
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-0.5",
              `bg-${betti.color}`
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
          />

          {/* Change indicator */}
          {contextData.isConnected && (
            <motion.div
              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-success"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default BettiNumbersDisplay;
