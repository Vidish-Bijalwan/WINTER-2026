import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import { WikipediaEvent } from "@/hooks/useWikipediaStream";
import { Bot, User, FileEdit, FilePlus, Tag, ArrowUpDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface LiveEventFeedProps {
  className?: string;
  maxItems?: number;
}

const EventItem = React.forwardRef<HTMLDivElement, { event: WikipediaEvent; index: number }>(
  ({ event, index }, ref) => {
    const deltaColor = event.delta && event.delta > 0
      ? "text-success"
      : event.delta && event.delta < 0
        ? "text-critical"
        : "text-muted-foreground";

    const formatDelta = (delta?: number) => {
      if (!delta) return null;
      const sign = delta > 0 ? '+' : '';
      if (Math.abs(delta) >= 1000) {
        return `${sign}${(delta / 1000).toFixed(1)}K`;
      }
      return `${sign}${delta}`;
    };

    const getEventIcon = () => {
      if (event.type === 'new') return <FilePlus className="w-3 h-3" />;
      if (event.type === 'categorize') return <Tag className="w-3 h-3" />;
      return <FileEdit className="w-3 h-3" />;
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -20, height: 0 }}
        animate={{ opacity: 1, x: 0, height: "auto" }}
        exit={{ opacity: 0, x: 20, height: 0 }}
        transition={{ duration: 0.2, delay: index * 0.02 }}
        className="border-b border-border/30 py-2 px-1 last:border-0"
      >
        <div className="flex items-start gap-2">
          {/* Event type icon */}
          <div className={cn(
            "p-1 rounded mt-0.5",
            event.type === 'new' ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
          )}>
            {getEventIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-medium truncate max-w-[180px]" title={event.title}>
                {event.title}
              </span>
              {event.minor && (
                <Badge variant="outline" className="text-[8px] px-1 py-0">m</Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                {event.bot ? (
                  <Bot className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                <span className="truncate max-w-[80px]" title={event.user}>{event.user}</span>
              </div>

              <span className="opacity-50">•</span>

              <span className="font-mono opacity-70">
                {event.wiki.replace('wiki', '')}
              </span>

              {event.delta !== undefined && event.delta !== 0 && (
                <>
                  <span className="opacity-50">•</span>
                  <span className={cn("font-mono font-medium", deltaColor)}>
                    {formatDelta(event.delta)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-[9px] text-muted-foreground shrink-0">
            {event.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
      </motion.div>
    );
  });

export function LiveEventFeed({ className, maxItems = 15 }: LiveEventFeedProps) {
  const { recentEvents, isConnected, eventsPerSecond } = useWikipediaData();

  const displayEvents = recentEvents.slice(0, maxItems);

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Feed</span>
          {isConnected && (
            <motion.div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[9px]"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              {eventsPerSecond}/s
            </motion.div>
          )}
        </div>
        <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
      </div>

      {/* Event list */}
      <ScrollArea className="h-[300px] pr-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {displayEvents.length > 0 ? (
            displayEvents.map((event, i) => (
              <EventItem key={event.id} event={event} index={i} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-muted-foreground"
            >
              <p className="text-xs">
                {isConnected ? "Waiting for events..." : "Connect to see live edits"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Stats footer */}
      {isConnected && displayEvents.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{displayEvents.filter(e => e.bot).length} bot edits</span>
          <span>{displayEvents.filter(e => e.type === 'new').length} new articles</span>
        </div>
      )}
    </div>
  );
}

export default LiveEventFeed;
