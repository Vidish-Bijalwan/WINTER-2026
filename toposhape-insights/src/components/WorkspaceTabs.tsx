import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, X, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    name: string;
    type: 'dashboard' | 'analytics' | 'map';
}

export function WorkspaceTabs({ className }: { className?: string }) {
    const [tabs, setTabs] = useState<Tab[]>([
        { id: '1', name: 'Main Dashboard', type: 'dashboard' },
        { id: '2', name: 'Global Map', type: 'map' }
    ]);
    const [activeTab, setActiveTab] = useState('1');

    const addTab = () => {
        const newId = Math.random().toString(36).substring(7);
        setTabs([...tabs, { id: newId, name: 'New Workspace', type: 'dashboard' }]);
        setActiveTab(newId);
    };

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (tabs.length === 1) return;

        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTab === id) {
            setActiveTab(newTabs[0].id);
        }
    };

    return (
        <div className={cn("flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-slate-800 bg-slate-950/50 px-2 pt-2", className)}>
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "group flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg cursor-pointer transition-colors min-w-[120px] max-w-[200px] border-t border-x border-transparent",
                        activeTab === tab.id
                            ? "bg-background text-foreground border-slate-800 border-b-background -mb-px"
                            : "text-muted-foreground hover:text-foreground hover:bg-slate-900/50"
                    )}
                >
                    <Layout className="w-3 h-3" />
                    <span className="truncate flex-1">{tab.name}</span>
                    <button
                        onClick={(e) => closeTab(e, tab.id)}
                        className="opacity-0 group-hover:opacity-100 hover:bg-slate-800 rounded p-0.5 transition-all"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-1 mb-1 text-muted-foreground hover:text-foreground"
                onClick={addTab}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}
