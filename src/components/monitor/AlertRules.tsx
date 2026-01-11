import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

export default function AlertRules({ className }: { className?: string }) {
    const [rules, setRules] = useState([
        { id: 1, name: "High Latency > 200ms", active: true },
        { id: 2, name: "Error Rate > 1%", active: true },
        { id: 3, name: "Low Throughput < 10 eps", active: false },
        { id: 4, name: "Bot Activity Spike > 50%", active: true },
    ]);

    const toggleRule = (id: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Alert Rules
                </h3>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Add Rule
                </Button>
            </div>
            <div className="space-y-3">
                {rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-2 bg-slate-900/30 rounded border border-slate-800">
                        <span className="text-sm text-slate-300">{rule.name}</span>
                        <Switch
                            checked={rule.active}
                            onCheckedChange={() => toggleRule(rule.id)}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
}
