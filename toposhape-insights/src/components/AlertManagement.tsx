import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, X, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Alert {
    id: string;
    timestamp: Date;
    title: string;
    message: string;
    severity: 'critical' | 'warning' | 'info';
    read: boolean;
    acknowledged: boolean;
}

export function AlertManagement() {
    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: '1',
            timestamp: new Date(Date.now() - 300000),
            title: 'Critical: Ransomware Detected',
            message: 'WannaCry variant detected on 5 endpoints',
            severity: 'critical',
            read: false,
            acknowledged: false,
        },
        {
            id: '2',
            timestamp: new Date(Date.now() - 600000),
            title: 'Suspicious Network Activity',
            message: 'Unusual outbound traffic to unknown IP 45.142.34.98',
            severity: 'warning',
            read: false,
            acknowledged: false,
        },
        {
            id: '3',
            timestamp: new Date(Date.now() - 1200000),
            title: 'System Update Available',
            message: 'New threat signatures available for download',
            severity: 'info',
            read: true,
            acknowledged: true,
        },
    ]);

    const acknowledgeAlert = (id: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, acknowledged: true, read: true } : alert
        ));
    };

    const dismissAlert = (id: string) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };

    const markAsRead = (id: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, read: true } : alert
        ));
    };

    const severityConfig = {
        critical: {
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
        },
        warning: {
            icon: AlertTriangle,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/30',
        },
        info: {
            icon: Info,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
        },
    };

    const unreadCount = alerts.filter(a => !a.read).length;
    const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Alert Management
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                    {unreadCount} new
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>Real-time security alerts and notifications</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAlerts(alerts.map(a => ({ ...a, read: true })))}
                        >
                            Mark All Read
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-500">
                            {alerts.filter(a => a.severity === 'critical').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                    </div>
                    <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-500">
                            {alerts.filter(a => a.severity === 'warning').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Warning</div>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-500">
                            {unacknowledgedCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                </div>

                {/* Alert List */}
                <div className="space-y-2">
                    <AnimatePresence>
                        {alerts.map((alert, index) => {
                            const config = severityConfig[alert.severity];
                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 border ${config.border} ${config.bg} rounded-lg ${!alert.read ? 'font-semibold' : ''
                                        }`}
                                    onClick={() => !alert.read && markAsRead(alert.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <Icon className={`w-5 h-5 ${config.color} mt-0.5 shrink-0`} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="text-sm font-medium">{alert.title}</h4>
                                                {!alert.read && (
                                                    <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground mb-2">
                                                {alert.message}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-muted-foreground">
                                                    {alert.timestamp.toLocaleTimeString()}
                                                </span>

                                                <div className="flex gap-2">
                                                    {!alert.acknowledged && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                acknowledgeAlert(alert.id);
                                                            }}
                                                        >
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Acknowledge
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dismissAlert(alert.id);
                                                        }}
                                                    >
                                                        <X className="w-3 h-3 mr-1" />
                                                        Dismiss
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {alerts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No alerts at this time</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
