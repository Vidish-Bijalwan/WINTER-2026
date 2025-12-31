import { Card } from "@/components/ui/card";

export default function BotAnalysis({ className }: { className?: string }) {
    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Bot vs Human Activity</h3>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-blue-400">65%</p>
                    <p className="text-xs text-slate-500">Bot Edits</p>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-green-400">35%</p>
                    <p className="text-xs text-slate-500">Human Edits</p>
                </div>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500 w-[65%]" />
                <div className="h-full bg-green-500 w-[35%]" />
            </div>
        </Card>
    );
}
