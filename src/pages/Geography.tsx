import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Globe, MapPin } from "lucide-react";
import LiveWorldMap from "@/components/maps/LiveWorldMap";
import HeatmapOverlay from "@/components/maps/HeatmapOverlay";
import EditFlowArcs from "@/components/maps/EditFlowArcs";
import CountryLeaderboard from "@/components/maps/CountryLeaderboard";
import TimelapseReplay from "@/components/maps/TimelapseReplay";
import LanguageClusters from "@/components/maps/LanguageClusters";
import ConflictZones from "@/components/maps/ConflictZones";
import Globe3D from "@/components/maps/Globe3D";

const Geography = () => {
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
                        <Globe className="w-6 h-6 text-primary" />
                        Geographic Intelligence
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-muted-foreground mt-1"
                    >
                        Real-time visualization of global Wikipedia edit activity
                    </motion.p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Live World Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="p-4 bg-card rounded-lg border">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Live World Map
                            </h3>
                            <LiveWorldMap className="h-[500px]" />
                        </div>
                    </motion.div>

                    {/* Heatmap */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <HeatmapOverlay className="h-[500px]" />
                    </motion.div>

                    {/* Edit Flow Arcs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="p-4 bg-card rounded-lg border">
                            <h3 className="text-sm font-semibold mb-3">Edit Flow Arcs</h3>
                            <EditFlowArcs className="h-[460px]" />
                        </div>
                    </motion.div>

                    {/* Country Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <CountryLeaderboard />
                    </motion.div>

                    {/* Time-lapse */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <TimelapseReplay />
                    </motion.div>

                    {/* Language Clusters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <LanguageClusters />
                    </motion.div>

                    {/* Conflict Zones */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <ConflictZones />
                    </motion.div>

                    {/* 3D Globe */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="lg:col-span-2"
                    >
                        <Globe3D />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Geography;
