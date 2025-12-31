import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Activity, AlertTriangle, Cpu, Database, Server, Zap } from "lucide-react";
import PrometheusMetrics from "@/components/monitor/PrometheusMetrics";
import AlertRules from "@/components/monitor/AlertRules";
import PerformanceFlamegraph from "@/components/monitor/PerformanceFlamegraph";
import LatencyHistogram from "@/components/monitor/LatencyHistogram";
import ErrorDashboard from "@/components/monitor/ErrorDashboard";
import ResourceGauges from "@/components/monitor/ResourceGauges";
import ThroughputMeter from "@/components/monitor/ThroughputMeter";
import QueueDepth from "@/components/monitor/QueueDepth";
import SLADashboard from "@/components/monitor/SLADashboard";
import TraceViewer from "@/components/monitor/TraceViewer";

const Monitor = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            <Activity className="w-6 h-6 text-primary" />
            System Monitor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mt-1"
          >
            Real-time instrumentation, metrics, and health checks
          </motion.p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Row 1: Critical Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SLADashboard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ErrorDashboard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <AlertRules />
          </motion.div>

          {/* Row 2: Performance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <ResourceGauges />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <ThroughputMeter />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <QueueDepth />
          </motion.div>

          {/* Row 3: Deep Dive */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <LatencyHistogram />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <PerformanceFlamegraph />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <TraceViewer />
          </motion.div>

          {/* Row 4: Backend Metrics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="xl:col-span-3">
            <PrometheusMetrics />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Monitor;
