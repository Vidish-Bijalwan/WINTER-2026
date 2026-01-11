import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DashboardWidgetProps {
    id: string;
    title: string;
    children: React.ReactNode;
    onRemove?: (id: string) => void;
    className?: string;
}

export function DashboardWidget({ id, title, children, onRemove, className }: DashboardWidgetProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const [isMaximized, setIsMaximized] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging || isMaximized ? 50 : 'auto',
        position: isMaximized ? 'fixed' as const : 'relative' as const,
        top: isMaximized ? 0 : 'auto',
        left: isMaximized ? 0 : 'auto',
        right: isMaximized ? 0 : 'auto',
        bottom: isMaximized ? 0 : 'auto',
        width: isMaximized ? '100vw' : 'auto',
        height: isMaximized ? '100vh' : '100%',
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const tourId = id === 'feed' ? 'live-feed' : id === 'topology' ? 'topology-viz' : undefined;

    return (
        <div ref={setNodeRef} style={style} className={cn("h-full", className, isMaximized && "z-[100] p-4 bg-background/80 backdrop-blur-sm")} data-tour={tourId}>
            <Card className={cn(
                "h-full flex flex-col overflow-hidden transition-all duration-200 glass-card",
                isDragging && "shadow-2xl ring-2 ring-primary/50 opacity-80 rotate-1",
                isMaximized && "border-primary/20 shadow-2xl"
            )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 border-b border-slate-800/50">
                    <div className="flex items-center gap-2">
                        {!isMaximized && (
                            <div
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-800 rounded transition-colors"
                            >
                                <GripVertical className="w-4 h-4 text-slate-500" />
                            </div>
                        )}
                        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                            {title}
                            {isRefreshing && <span className="text-xs text-muted-foreground animate-pulse">Refreshing...</span>}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-6 w-6 text-slate-500 hover:text-primary", isRefreshing && "animate-spin text-primary")}
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-500 hover:text-primary"
                            onClick={() => setIsMaximized(!isMaximized)}
                        >
                            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                        </Button>
                        {onRemove && !isMaximized && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => onRemove(id)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 h-[calc(100%-60px)] relative overflow-hidden">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
