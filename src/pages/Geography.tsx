import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Globe, MapPin, BarChart2, Layers } from "lucide-react";
import UnifiedWorldMap from "@/components/maps/UnifiedWorldMap";
import CountryLeaderboard from "@/components/maps/CountryLeaderboard";
import LanguageClusters from "@/components/maps/LanguageClusters";
import Globe3D from "@/components/maps/Globe3D";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

const Geography = () => {
    const { isSidebarCollapsed } = useUI();

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className={cn(
                "pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto transition-all duration-300",
                isSidebarCollapsed ? "md:pl-[80px]" : "md:pl-[280px]"
            )}>
                {/* Header */}
                <div className="mb-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold flex items-center gap-2"
                    >
                        <Globe className="w-6 h-6 text-primary" />
                        Geographic Intelligence
                    </motion.h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Global visualization of Wikipedia edit activity and topological structures.
                    </p>
                </div>

                <Tabs defaultValue="map" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <TabsList className="bg-slate-900 border border-slate-800">
                            <TabsTrigger value="map" className="gap-2">
                                <MapPin className="w-4 h-4" /> 2D Map
                            </TabsTrigger>
                            <TabsTrigger value="globe" className="gap-2">
                                <Globe className="w-4 h-4" /> 3D Globe
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="gap-2">
                                <BarChart2 className="w-4 h-4" /> Analytics
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="map" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
                            {/* Main Map Area */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="lg:col-span-3 h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative"
                            >
                                <UnifiedWorldMap className="h-full w-full" />
                            </motion.div>

                            {/* Sidebar Stats */}
                            <div className="space-y-6 h-full overflow-y-auto pr-2">
                                <CountryLeaderboard />
                                <LanguageClusters />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="globe">
                        <div className="h-[700px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                            <Globe3D />
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle>Regional Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CountryLeaderboard />
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle>Language Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <LanguageClusters />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Geography;
