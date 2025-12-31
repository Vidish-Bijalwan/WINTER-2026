import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { BarChart3 } from "lucide-react";
import ForceGraph from "@/components/visualizations/ForceGraph";
import SankeyFlow from "@/components/visualizations/SankeyFlow";
import TreemapView from "@/components/visualizations/TreemapView";
import RadialDendrogram from "@/components/visualizations/RadialDendrogram";
import StreamGraph from "@/components/visualizations/StreamGraph";
import ParallelCoords from "@/components/visualizations/ParallelCoords";
import ChordDiagram from "@/components/visualizations/ChordDiagram";
import BubbleRace from "@/components/visualizations/BubbleRace";
import TrendingWordCloud from "@/components/visualizations/TrendingWordCloud";
import CalendarHeatmap from "@/components/visualizations/CalendarHeatmap";
import SunburstChart from "@/components/visualizations/SunburstChart";
import Network3D from "@/components/visualizations/Network3D";

const Visualizations = () => {
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
                        <BarChart3 className="w-6 h-6 text-primary" />
                        Advanced Visualizations
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-muted-foreground mt-1"
                    >
                        Deep dive into Wikipedia edit patterns and network topology
                    </motion.p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Row 1: Networks & Flows */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <ForceGraph />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <SankeyFlow />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Network3D />
                    </motion.div>

                    {/* Row 2: Hierarchies & Clusters */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <TreemapView />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <SunburstChart />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        <RadialDendrogram />
                    </motion.div>

                    {/* Row 3: Time & Trends */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        <StreamGraph />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                        <TrendingWordCloud />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                        <BubbleRace />
                    </motion.div>

                    {/* Row 4: Complex Relations */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                        <ParallelCoords />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                        <ChordDiagram />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                        <CalendarHeatmap />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Visualizations;
