import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
  Activity,
  Shield,
  Zap,
  Volume2,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTopoForge } from "@/hooks/useTopoForge";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  const [analysisInterval, setAnalysisInterval] = useState([2]);
  const [anomalyThreshold, setAnomalyThreshold] = useState([65]);
  const { sendConfig } = useTopoForge();

  // Debounce config updates
  useEffect(() => {
    const timer = setTimeout(() => {
      sendConfig({ anomaly_threshold: anomalyThreshold[0] });
    }, 500);
    return () => clearTimeout(timer);
  }, [anomalyThreshold, sendConfig]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mt-1"
          >
            Configure TopoForge to match your workflow
          </motion.p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts for critical anomalies
                    </p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sound Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Play audio for critical events
                    </p>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stream Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Stream Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-Connect on Load</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically connect to Wikipedia stream
                    </p>
                  </div>
                  <Switch checked={autoConnect} onCheckedChange={setAutoConnect} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Analysis Interval</Label>
                    <span className="text-sm font-mono text-muted-foreground">{analysisInterval[0]}s</span>
                  </div>
                  <Slider
                    value={analysisInterval}
                    onValueChange={setAnalysisInterval}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How often to compute topological features
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Anomaly Threshold</Label>
                    <span className="text-sm font-mono text-muted-foreground">{anomalyThreshold[0]}%</span>
                  </div>
                  <Slider
                    value={anomalyThreshold}
                    onValueChange={setAnomalyThreshold}
                    min={50}
                    max={95}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence to trigger anomaly alert
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2 border-primary">
                      <Moon className="w-5 h-5" />
                      <span className="text-xs">Dark</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2 opacity-50" disabled>
                      <Sun className="w-5 h-5" />
                      <span className="text-xs">Light</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-2 opacity-50" disabled>
                      <Monitor className="w-5 h-5" />
                      <span className="text-xs">System</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Light and system themes coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  About TopoForge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <Badge variant="outline">1.0.0-beta</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data Source</span>
                  <span className="font-mono">Wikipedia SSE</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TDA Engine</span>
                  <span className="font-mono">Real-time Betti</span>
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  TopoForge uses Topological Data Analysis to detect anomalies in high-dimensional
                  streaming data by tracking changes in the shape and structure of data over time.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
