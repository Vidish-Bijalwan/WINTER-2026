import React, { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import {
    LayoutDashboard,
    Activity,
    Database,
    BarChart3,
    Globe,
    Settings,
    User,
    LogOut,
    Moon,
    Sun,
    Laptop
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

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

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <div className="text-sm text-muted-foreground hidden lg:flex">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => navigate('/dashboard'))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/monitor'))}>
                            <Activity className="mr-2 h-4 w-4" />
                            <span>Monitor</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/sources'))}>
                            <Database className="mr-2 h-4 w-4" />
                            <span>Data Sources</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => navigate('/analytics'))}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Analytics</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/geography'))}>
                            <Globe className="mr-2 h-4 w-4" />
                            <span>Geography</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => {
                            document.documentElement.classList.remove('light');
                            document.documentElement.classList.add('dark');
                            localStorage.setTheme = 'dark';
                        })}>
                            <Moon className="mr-2 h-4 w-4" />
                            <div className="flex-1">
                                <div>Dark Mode</div>
                                <div className="text-xs text-muted-foreground">Use dark theme</div>
                            </div>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => {
                            document.documentElement.classList.remove('dark');
                            document.documentElement.classList.add('light');
                            localStorage.theme = 'light';
                        })}>
                            <Sun className="mr-2 h-4 w-4" />
                            <div className="flex-1">
                                <div>Light Mode</div>
                                <div className="text-xs text-muted-foreground">Use light theme</div>
                            </div>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => {
                            document.documentElement.classList.remove('dark', 'light');
                            localStorage.removeItem('theme');
                        })}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <div className="flex-1">
                                <div>System</div>
                                <div className="text-xs text-muted-foreground">Follow system preference</div>
                            </div>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <div className="border-t border-border p-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↑↓</kbd>
                                <span>Navigate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↵</kbd>
                                <span>Select</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">Esc</kbd>
                                <span>Close</span>
                            </div>
                        </div>
                    </div>
                </CommandList>
            </CommandDialog>
        </>
    );
}
