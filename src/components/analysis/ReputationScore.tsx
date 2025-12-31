import { Card } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function ReputationScore({ className }: { className?: string }) {
    const editors = [
        { name: "WikiGnome", score: 98, tier: "S" },
        { name: "FactChecker", score: 92, tier: "A" },
        { name: "Newbie123", score: 45, tier: "C" },
    ];

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-400" />
                Editor Reputation
            </h3>
            <div className="space-y-3">
                {editors.map((editor, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                        <span className="text-sm">{editor.name}</span>
                        <div className="flex items-center gap-3">
                            <div className="w-full bg-slate-800 h-1.5 w-20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${editor.score}%` }}
                                />
                            </div>
                            <span className="font-mono text-xs font-bold">{editor.tier}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
