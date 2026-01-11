import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Globe, ShieldAlert, GitGraph, FileText, BarChart3, AlignLeft, ScatterChart, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WidgetDefinition {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    defaultSize: 'small' | 'medium' | 'large';
}

export const AVAILABLE_WIDGETS: WidgetDefinition[] = [
    {
        id: 'feed',
        title: 'Live Event Feed',
        description: 'Real-time stream of Wikipedia edits and anomalies.',
        icon: Activity,
        defaultSize: 'medium'
    },
    {
        id: 'timeline',
        title: 'Anomaly Timeline',
        description: 'Historical view of detected anomalies over time.',
        icon: GitGraph,
        defaultSize: 'large'
    },
    {
        id: 'threats',
        title: 'Threat Intelligence',
        description: 'Latest threat indicators and C2 server detections.',
        icon: ShieldAlert,
        defaultSize: 'medium'
    },
    {
        id: 'topology',
        title: 'Persistence Diagram',
        description: 'Topological data analysis visualization.',
        icon: FileText,
        defaultSize: 'medium'
    },
    {
        id: 'tda-stats',
        title: 'Advanced TDA Metrics',
        description: 'Wasserstein distance, landscapes, and multi-modal anomaly scores.',
        icon: BarChart3,
        defaultSize: 'medium'
    },
    {
        id: 'barcode',
        title: 'Persistence Barcode',
        description: 'Interactive barcode showing feature lifetimes.',
        icon: AlignLeft,
        defaultSize: 'large'
    },
    {
        id: 'birth-death',
        title: 'Birth-Death Plane',
        description: 'Scatter plot of topological features.',
        icon: ScatterChart,
        defaultSize: 'medium'
    },
    {
        id: 'filtration',
        title: 'Filtration Animation',
        description: 'Visual timeline of the filtration process.',
        icon: PlayCircle,
        defaultSize: 'medium'
    }
];

interface AddWidgetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddWidget: (widgetId: string) => void;
    activeWidgets: string[];
}

export function AddWidgetDialog({ open, onOpenChange, onAddWidget, activeWidgets }: AddWidgetDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle>Add Widget</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Choose a widget to add to your dashboard.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {AVAILABLE_WIDGETS.map((widget) => {
                        const isActive = activeWidgets.includes(widget.id);
                        return (
                            <div
                                key={widget.id}
                                className={cn(
                                    "flex items-start gap-4 p-3 rounded-lg border transition-all",
                                    isActive
                                        ? "border-slate-800 bg-slate-800/50 opacity-50 cursor-not-allowed"
                                        : "border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-primary/50 cursor-pointer"
                                )}
                                onClick={() => !isActive && onAddWidget(widget.id)}
                            >
                                <div className={cn("p-2 rounded-md", isActive ? "bg-slate-700" : "bg-primary/10 text-primary")}>
                                    <widget.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium leading-none mb-1.5">{widget.title}</h4>
                                    <p className="text-xs text-slate-400 leading-snug">
                                        {widget.description}
                                    </p>
                                </div>
                                {!isActive && (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
