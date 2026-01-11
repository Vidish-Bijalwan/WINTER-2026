import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TopologyVisualizer from "@/components/TopologyVisualizer";
import PersistenceDiagram from "@/components/PersistenceDiagram";
import {
  ArrowRight,
  Shield,
  Activity,
  Database,
  Zap,
  Layers,
  TrendingUp,
  Eye,
  Brain,
  Network,
  ChevronRight,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const Landing = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const features = [
    {
      icon: Layers,
      title: "Topological Feature Extraction",
      description: "Extract persistent homology, Betti numbers, and simplicial complexes from your data streams."
    },
    {
      icon: Brain,
      title: "Hybrid AI Detection",
      description: "Combine TDA with Isolation Forests, Autoencoders, and deep learning for robust anomaly detection."
    },
    {
      icon: Eye,
      title: "Shape Evolution Tracking",
      description: "Monitor how the topological shape of your data changes over time to detect structural anomalies."
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Process millions of events per second with sub-second detection latency."
    },
    {
      icon: Network,
      title: "Multi-source Ingestion",
      description: "Connect network logs, financial data, IoT sensors, and system metrics seamlessly."
    },
    {
      icon: TrendingUp,
      title: "Explainable Insights",
      description: "Understand why anomalies were detected with visual persistence diagrams and summaries."
    },
  ];

  const useCases = [
    { icon: Shield, label: "Cybersecurity", description: "Detect network intrusions and APT attacks" },
    { icon: Database, label: "Financial Systems", description: "Identify fraudulent transaction patterns" },
    { icon: Activity, label: "IoT & Infrastructure", description: "Monitor sensor networks and critical systems" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="absolute inset-0 dot-pattern opacity-30" />

        {/* Constant Particle Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full blur-sm"
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>

        {/* Topology visualization background */}
        <div className="absolute inset-0 opacity-40">
          <TopologyVisualizer variant="hero" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="glow" className="mb-6">
                <span className="mr-2">🔬</span> Topological Data Analysis Platform
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-foreground">Detect Anomalies by</span>
                <br />
                <span className="text-gradient-primary">Shape, Not Rules</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                TopoForge uses persistent homology and topological data analysis to detect
                structural anomalies in complex, high-dimensional data. When the shape
                of your data changes, we catch it.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button variant="hero" size="xl">
                    Launch Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero-outline" size="xl">
                      Watch Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl bg-black/90 border-slate-800 p-0 overflow-hidden">
                    <video
                      controls
                      autoPlay
                      className="w-full h-full aspect-video"
                      src="/WINTER-2026/assets/demo.mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-border/30">
                {[
                  { value: "< 100ms", label: "Detection Latency" },
                  { value: "2M+", label: "Events/Second" },
                  { value: "99.7%", label: "Accuracy" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-2xl font-bold font-mono text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Persistence Diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <PersistenceDiagram className="w-full h-[400px]" />

                {/* Floating annotation */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="absolute -right-4 top-1/4 glass-card p-3 max-w-[180px]"
                >
                  <div className="text-xs font-medium text-primary mb-1">Anomaly Detected</div>
                  <div className="text-[10px] text-muted-foreground">
                    High-persistence H₁ feature indicates unusual cyclic pattern
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">USE CASES</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for Complex, Critical Systems
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional anomaly detection fails on complex, noisy data. TopoForge thrives on it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-8 hover:border-primary/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{useCase.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>

                  <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">CAPABILITIES</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Complete TDA Pipeline
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From raw data ingestion to explainable insights, every step is designed for
              production-grade anomaly detection.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">HOW IT WORKS</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              From Data to Insight in Milliseconds
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Ingest", description: "Stream data from any source" },
              { step: "02", title: "Extract", description: "Compute topological features" },
              { step: "03", title: "Analyze", description: "Detect structural changes" },
              { step: "04", title: "Alert", description: "Explain and notify" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}

                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-4">
                  <span className="text-2xl font-bold font-mono text-primary">{item.step}</span>
                </div>

                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 p-12"
          >
            <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to See Anomalies Differently?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join the companies using topological intelligence to protect their most critical systems.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/dashboard">
                  <Button variant="hero" size="xl">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="hero-outline" size="xl">
                  Contact Sales
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
                {["No credit card required", "14-day free trial", "Enterprise ready"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">TopoForge</span>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">API</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            </div>

            <div className="text-sm text-muted-foreground">
              © 2024 TopoForge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
