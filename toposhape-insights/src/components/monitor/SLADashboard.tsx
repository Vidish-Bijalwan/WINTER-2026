import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function SLADashboard({ className }: { className?: string }) {
    // Mock SLA data
    const metrics = [
        { name: "API Uptime", value: "99.99%", status: "healthy" },
        { name: "Stream Availability", value: "99.95%", status: "healthy" },
        { name: "Processing Success", value: "99.8%", status: "warning" },
        { name: "Avg Response Time", value: "45ms", status: "healthy" }
    ];

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Service Level Agreement</h3>
            <div className="space-y-4">
                {metrics.map((metric) => (
                    <div key={metric.name} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            {metric.status === "healthy" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : metric.status === "warning" ? (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm font-medium">{metric.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${metric.status === "healthy" ? "text-green-400" :
                                metric.status === "warning" ? "text-yellow-400" : "text-red-400"
                            }`}>
                            {metric.value}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
