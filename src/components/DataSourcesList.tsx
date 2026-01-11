import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Loader2, AlertCircle, Radio, Wifi, WifiOff } from "lucide-react";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { Button } from "./ui/button";

interface DataSourceCardProps {
  source: {
    id: string;
    name: string;
    type: 'stream' | 'api' | 'webhook';
    status: 'connected' | 'syncing' | 'error' | 'disconnected';
    lastSync: string;
    eventsPerSecond: number;
  };
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export function DataSourceCard({ source, onConnect, onDisconnect, className }: DataSourceCardProps) {
  const typeIcons = {
    stream: Radio,
    api: Wifi,
    webhook: Wifi,
  };

  const statusConfig = {
    connected: {
      icon: Check,
      color: "text-success",
      bg: "bg-success/20",
      label: "Live",
      animate: false,
    },
    syncing: {
      icon: Loader2,
      color: "text-info",
      bg: "bg-info/20",
      label: "Connecting",
      animate: true,
    },
    error: {
      icon: AlertCircle,
      color: "text-critical",
      bg: "bg-critical/20",
      label: "Error",
      animate: false,
    },
    disconnected: {
      icon: WifiOff,
      color: "text-muted-foreground",
      bg: "bg-muted",
      label: "Disconnected",
      animate: false,
    },
  };

  const TypeIcon = typeIcons[source.type];
  const status = statusConfig[source.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card/50 p-4 transition-all duration-300 hover:border-primary/30",
        source.status === "error" && "border-critical/30",
        source.status === "connected" && "border-success/20",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "p-2 rounded-lg",
          source.status === "connected" ? "bg-success/10" : "bg-primary/10"
        )}>
          <TypeIcon className={cn(
            "w-5 h-5",
            source.status === "connected" ? "text-success" : "text-primary"
          )} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm truncate">{source.name}</h4>
            <div className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]",
              status.bg,
              status.color
            )}>
              <StatusIcon className={cn("w-3 h-3", status.animate && "animate-spin")} />
              <span>{status.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span>Last: {source.lastSync}</span>
            {source.status === "connected" && (
              <motion.span 
                className="font-mono text-success"
                key={source.eventsPerSecond}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {source.eventsPerSecond} events/s
              </motion.span>
            )}
          </div>

          {/* Connect/Disconnect button */}
          <div className="mt-2">
            {source.status === "disconnected" && onConnect && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onConnect}
                className="h-7 text-xs"
              >
                Connect
              </Button>
            )}
            {source.status === "connected" && onDisconnect && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDisconnect}
                className="h-7 text-xs text-muted-foreground hover:text-critical"
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Active indicator */}
      {source.status === "connected" && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-success"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Live pulse indicator */}
      {source.status === "connected" && (
        <motion.div
          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-success"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

interface DataSourcesListProps {
  className?: string;
}

export function DataSourcesList({ className }: DataSourcesListProps) {
  const { dataSources, connect, disconnect } = useWikipediaData();

  return (
    <div className={cn("space-y-2", className)}>
      {dataSources.map((source, i) => (
        <motion.div
          key={source.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <DataSourceCard 
            source={source} 
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </motion.div>
      ))}

      {/* Stream info */}
      <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground">Wikipedia SSE Stream</span>
          <br />
          Real-time Server-Sent Events from Wikimedia's Recent Changes feed.
          High-volume, temporal data perfect for topological analysis.
        </p>
      </div>
    </div>
  );
}

export default DataSourcesList;
