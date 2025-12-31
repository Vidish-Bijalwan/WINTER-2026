import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    Map,
    BarChart3,
    Globe,
    Activity,
    LayoutDashboard
} from "lucide-react";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]">
            <Command className="w-[640px] max-w-[90vw] bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center border-b border-slate-800 px-3">
                    <Search className="w-5 h-5 text-slate-500 mr-2" />
                    <Command.Input
                        className="flex-1 h-12 bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
                        placeholder="Type a command or search..."
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                    <Command.Empty className="py-6 text-center text-slate-500 text-sm">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-xs font-medium text-slate-500 mb-2 px-2">
                        <Command.Item
                            className="flex items-center gap-2 px-2 py-2 rounded text-sm text-slate-200 hover:bg-slate-900 cursor-pointer aria-selected:bg-slate-900"
                            onSelect={() => runCommand(() => navigate("/"))}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Command.Item>
                        <Command.Item
                            className="flex items-center gap-2 px-2 py-2 rounded text-sm text-slate-200 hover:bg-slate-900 cursor-pointer aria-selected:bg-slate-900"
                            onSelect={() => runCommand(() => navigate("/analytics"))}
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics</span>
                        </Command.Item>
                        <Command.Item
                            className="flex items-center gap-2 px-2 py-2 rounded text-sm text-slate-200 hover:bg-slate-900 cursor-pointer aria-selected:bg-slate-900"
                            onSelect={() => runCommand(() => navigate("/geography"))}
                        >
                            <Globe className="w-4 h-4" />
                            <span>Geography</span>
                        </Command.Item>
                        <Command.Item
                            className="flex items-center gap-2 px-2 py-2 rounded text-sm text-slate-200 hover:bg-slate-900 cursor-pointer aria-selected:bg-slate-900"
                            onSelect={() => runCommand(() => navigate("/visualizations"))}
                        >
                            <Activity className="w-4 h-4" />
                            <span>Visualizations</span>
                        </Command.Item>
                        <Command.Item
                            className="flex items-center gap-2 px-2 py-2 rounded text-sm text-slate-200 hover:bg-slate-900 cursor-pointer aria-selected:bg-slate-900"
                            onSelect={() => runCommand(() => navigate("/monitor"))}
                        >
                            <Activity className="w-4 h-4" />
                            <span>System Monitor</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Settings" className="text-xs font-medium text-slate-500 mb-2 px-2 mt-2">
                        <Command.Item
                            className="flex items-center gap-2 px-2 py-2 rounded text-sm text-slate-200 hover:bg-slate-900 cursor-pointer aria-selected:bg-slate-900"
                            onSelect={() => runCommand(() => navigate("/settings"))}
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}
