import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        anomaly: "border-anomaly/30 bg-anomaly/20 text-anomaly",
        critical: "border-critical/30 bg-critical/20 text-critical",
        success: "border-success/30 bg-success/20 text-success",
        info: "border-info/30 bg-info/20 text-info",
        h0: "border-topo-h0/30 bg-topo-h0/20 text-topo-h0",
        h1: "border-topo-h1/30 bg-topo-h1/20 text-topo-h1",
        h2: "border-topo-h2/30 bg-topo-h2/20 text-topo-h2",
        pulse: "border-primary/30 bg-primary/20 text-primary animate-pulse",
        glow: "border-primary bg-primary/20 text-primary shadow-glow-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "anomaly" | "critical" | "success" | "info" | "h0" | "h1" | "h2" | "pulse" | "glow" | null | undefined;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
