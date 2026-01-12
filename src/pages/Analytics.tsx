import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import RiskHeatmap from "@/components/RiskHeatmap";
import { IPReputationTracker } from "@/components/IPReputationTracker";
import { HistoricalTrends } from "@/components/HistoricalTrends";
import { GeolocationMap } from "@/components/GeolocationMap";
import { AlertManagement } from "@/components/AlertManagement";
import { ThreatIntelCard } from "@/components/ThreatIntelCard";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Zap,
  Calendar,
  Shield,
  Database
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { generateKasperskyThreat, generateBitdefenderThreat, generateAnyRunSandbox, ThreatEvent } from "@/lib/dataSources";

import { useDataSource } from "@/context/DataSourceContext";
import { STATIC_SOURCES_DATA } from "@/lib/sourcesData";

const Analytics = () => {
  const {
    totalEventsProcessed,
    eventsPerSecond,
    anomalies,
    bettiNumbers,
    isConnected
  } = useWikipediaData();
  const { activeSourceIds, sourceStats } = useDataSource();

  const [threatFeeds, setThreatFeeds] = useState<ThreatEvent[]>([]);

  // Generate mock threat intelligence feeds
  useEffect(() => {
    const generateThreats = () => {
      const threats: ThreatEvent[] = [];
      // Generate mix of threats from different sources
      for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.5) threats.push(generateKasperskyThreat());
        if (Math.random() > 0.5) threats.push(generateBitdefenderThreat());
        if (Math.random() > 0.7) threats.push(generateAnyRunSandbox());
      }
      setThreatFeeds(threats.slice(0, 6)); // Keep max 6
    };

    generateThreats();
    const interval = setInterval(generateThreats, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    let simulatedTotal = 0;
    let simulatedEps = 0;
    Object.values(sourceStats).forEach(s => {
      simulatedTotal += s.total;
      simulatedEps += s.eps;
    });

    const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
    const warningCount = anomalies.filter(a => a.severity === 'warning').length;

    return {
      totalEvents: totalEventsProcessed + simulatedTotal,
      eventsPerSecond: eventsPerSecond + simulatedEps,
      criticalAnomalies: criticalCount,
      warningAnomalies: warningCount,
      totalAnomalies: anomalies.length,
      avgBetti: Math.round((bettiNumbers.h0 + bettiNumbers.h1 + bettiNumbers.h2) / 3),
      threatScore: Math.floor(50 + Math.random() * 30), // Mock threat score
    };
  }, [totalEventsProcessed, eventsPerSecond, anomalies, bettiNumbers, sourceStats]);

  const analyticsCards = [
    {
      title: "Total Events Processed",
      value: stats.totalEvents.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Current Throughput",
      value: `${stats.eventsPerSecond}/s`,
      change: (isConnected || activeSourceIds.size > 0) ? "Live" : "Paused",
      trend: (isConnected || activeSourceIds.size > 0) ? "up" : "stable",
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Anomalies Detected",
      value: stats.totalAnomalies.toString(),
      change: `${stats.criticalAnomalies} critical`,
      trend: stats.criticalAnomalies > 0 ? "down" : "stable",
      icon: AlertTriangle,
      color: "text-anomaly",
      bgColor: "bg-anomaly/10",
    },
    {
      title: "Threat Intelligence Score",
      value: stats.threatScore.toString(),
      change: "Real-time",
      trend: "stable",
      icon: Shield,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold flex items-center gap-2"
            >
              <BarChart3 className="w-6 h-6 text-primary" />
              Advanced Analytics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground mt-1"
            >
              Comprehensive threat intelligence and performance metrics
            </motion.p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-slate-700">
                1h
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs bg-slate-700 text-white shadow-sm">
                24h
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-slate-700">
                7d
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-slate-700">
                30d
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-800/30 px-3 py-1.5 rounded-md border border-slate-700/30">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analyticsCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card variant="glass" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${card.trend === 'up' ? 'text-success' :
                      card.trend === 'down' ? 'text-critical' :
                        'text-muted-foreground'
                      }`}>
                      {card.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {card.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      <span>{card.change}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold font-mono">{card.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <HistoricalTrends />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GeolocationMap />
          </motion.div>
        </div>

        {/* Threat Intelligence & IP Tracking */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Live Threat Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {threatFeeds.map((threat, idx) => (
                    <ThreatIntelCard key={threat.id} threat={threat} index={idx} />
                  ))}
                  {threatFeeds.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No threats detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <IPReputationTracker />
          </motion.div>
        </div>

        {/* Alert Management & Risk Heatmap */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <AlertManagement />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <RiskHeatmap />
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Betti Number Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-topo-h0">β₀ (Components)</span>
                    <span className="font-mono font-semibold">{bettiNumbers.h0}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-topo-h0 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(bettiNumbers.h0 * 2, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-topo-h1">β₁ (Loops)</span>
                    <span className="font-mono font-semibold">{bettiNumbers.h1}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-topo-h1 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(bettiNumbers.h1 * 3, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-topo-h2">β₂ (Voids)</span>
                    <span className="font-mono font-semibold">{bettiNumbers.h2}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-topo-h2 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(bettiNumbers.h2 * 10, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Anomaly Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-critical/10 border border-critical/20">
                    <span className="text-sm text-critical">Critical</span>
                    <Badge variant="critical">{stats.criticalAnomalies}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-anomaly/10 border border-anomaly/20">
                    <span className="text-sm text-anomaly">Warning</span>
                    <Badge variant="anomaly">{stats.warningAnomalies}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-info/10 border border-info/20">
                    <span className="text-sm text-info">Info</span>
                    <Badge variant="info">{anomalies.filter(a => a.severity === 'info').length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Sources Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wikipedia</span>
                    <Badge variant={isConnected ? "success" : "outline"}>
                      {isConnected ? "Live" : "Off"}
                    </Badge>
                  </div>
                  {Array.from(activeSourceIds).slice(0, 4).map(id => {
                    const source = STATIC_SOURCES_DATA.find(s => s.id === id);
                    return (
                      <div key={id} className="flex justify-between">
                        <span className="text-muted-foreground truncate max-w-[120px]">{source?.name || id}</span>
                        <Badge variant="success">Live</Badge>
                      </div>
                    );
                  })}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Total: {activeSourceIds.size + (isConnected ? 1 : 0)} active streams
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
