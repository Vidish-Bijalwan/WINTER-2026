import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'warning' | 'critical';
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'High Anomaly Detected',
        message: 'Unusual edit volume detected in "Politics" category.',
        time: '2 mins ago',
        read: false,
        type: 'critical'
    },
    {
        id: '2',
        title: 'System Update',
        message: 'Backend services successfully updated to v2.1.0.',
        time: '1 hour ago',
        read: false,
        type: 'info'
    },
    {
        id: '3',
        title: 'New Data Source',
        message: 'Connected to "Wikimedia Commons" stream.',
        time: '3 hours ago',
        read: true,
        type: 'info'
    },
    {
        id: '4',
        title: 'Performance Alert',
        message: 'High latency detected in region: US-East.',
        time: '5 hours ago',
        read: true,
        type: 'warning'
    }
];

export function NotificationsPopover() {
    const [notifications, setNotifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const clearNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-slate-900 border-slate-800" align="end">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h4 className="font-semibold text-sm text-slate-200">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary hover:text-primary/80 h-auto p-0 px-2"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-800">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-slate-800/50 transition-colors cursor-pointer relative group",
                                        !notification.read && "bg-slate-800/20"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-2 h-2 mt-1.5 rounded-full shrink-0",
                                            notification.type === 'critical' ? "bg-red-500" :
                                                notification.type === 'warning' ? "bg-amber-500" : "bg-blue-500"
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-sm font-medium leading-none", !notification.read ? "text-slate-200" : "text-slate-400")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-slate-600">
                                                {notification.time}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 text-slate-500 hover:text-slate-300"
                                            onClick={(e) => clearNotification(notification.id, e)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4">
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
