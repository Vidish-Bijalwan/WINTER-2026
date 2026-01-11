import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AlertRules({ className }: { className?: string }) {
    const [rules, setRules] = useState([
        { id: 1, name: "High Latency > 200ms", active: true },
        { id: 2, name: "Error Rate > 1%", active: true },
        { id: 3, name: "Low Throughput < 10 eps", active: false },
        { id: 4, name: "Bot Activity Spike > 50%", active: true },
    ]);
    const [newRuleName, setNewRuleName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleRule = (id: number) => {
        setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    const handleAddRule = () => {
        if (!newRuleName.trim()) return;

        const newRule = {
            id: rules.length + 1,
            name: newRuleName,
            active: true
        };

        setRules([...rules, newRule]);
        setNewRuleName("");
        setIsDialogOpen(false);
    };

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Alert Rules
                </h3>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Add Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
                        <DialogHeader>
                            <DialogTitle>Add Alert Rule</DialogTitle>
                            <DialogDescription className="text-slate-400">
                                Create a new rule to trigger alerts based on metric thresholds.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Rule Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newRuleName}
                                    onChange={(e) => setNewRuleName(e.target.value)}
                                    placeholder="e.g. CPU > 90%"
                                    className="col-span-3 bg-slate-800 border-slate-700 text-slate-100"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleAddRule} className="bg-primary hover:bg-primary/90">
                                Save Rule
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
