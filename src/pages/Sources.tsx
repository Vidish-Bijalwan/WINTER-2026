import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWikipediaData } from "@/context/WikipediaDataContext";
import {
  Database,
  Radio,
  Plus,
  Shield,
  DollarSign,
  GitBranch,
  MessageSquare,
  RefreshCw,
  Power,
  TrendingUp,
  Globe,
  Activity,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Source {
  id: string;
  name: string;
  description: string;
  type: string;
  protocol: string;
  icon: any;
  url: string;
  eventsPerSecond: number;
  totalEvents: number;
  color: string;
  bgColor: string;
  active: boolean;
}

const Sources = () => {
  const { isConnected, connect, disconnect, eventsPerSecond, totalEventsProcessed } = useWikipediaData();
  const { toast } = useToast();
  const [sources, setSources] = useState<Source[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({ name: "", url: "", type: "Custom", description: "" });

  // Initial static sources
  const staticSources = [
    {
      id: 'wikipedia',
      name: 'Wikipedia Recent Changes',
      description: 'Real-time SSE stream of all Wikipedia edits across all languages',
      type: 'Social Media',
      protocol: 'SSE',
      icon: Globe,
      url: 'stream.wikimedia.org',
      eventsPerSecond: isConnected ? eventsPerSecond : 0,
      totalEvents: isConnected ? totalEventsProcessed : 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      active: isConnected
    },
    // ... other static sources can be kept or migrated to DB. 
    // For now, keeping them as "System" sources and merging with DB sources.
  ];

  const fetchSources = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sources/`);
      if (response.ok) {
        const data = await response.json();
        const dbSources = data.map((s: any) => ({
          ...s,
          icon: Database, // Default icon for custom sources
          protocol: 'REST',
          eventsPerSecond: 0,
          totalEvents: 0,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10'
        }));
        setSources([...staticSources, ...dbSources]);
      }
    } catch (error) {
      console.error("Failed to fetch sources:", error);
      setSources(staticSources);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [isConnected, eventsPerSecond, totalEventsProcessed]);

  const handleAddSource = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sources/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource)
      });

      if (response.ok) {
        toast({ title: "Source Added", description: "New data source configured successfully." });
        setIsAddDialogOpen(false);
        setNewSource({ name: "", url: "", type: "Custom", description: "" });
        fetchSources();
      } else {
        toast({ title: "Error", description: "Failed to add source.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error.", variant: "destructive" });
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (id === 'wikipedia') return; // Protect system source
    try {
      const response = await fetch(`${API_BASE_URL}/api/sources/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({ title: "Source Deleted", description: "Data source removed." });
        fetchSources();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const toggleSource = (sourceId: string) => {
    if (sourceId === 'wikipedia') {
      isConnected ? disconnect() : connect();
    }
    // For DB sources, we could add an update endpoint to toggle 'active' status
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold flex items-center gap-2"
            >
              <Database className="w-6 h-6 text-primary" />
              Data Sources
            </motion.h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your real-time data stream connections
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Custom Source
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
              <DialogHeader>
                <DialogTitle>Add New Data Source</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={newSource.name} onChange={e => setNewSource({ ...newSource, name: e.target.value })} className="bg-slate-800 border-slate-700" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL / Endpoint</Label>
                  <Input id="url" value={newSource.url} onChange={e => setNewSource({ ...newSource, url: e.target.value })} className="bg-slate-800 border-slate-700" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" value={newSource.type} onChange={e => setNewSource({ ...newSource, type: e.target.value })} className="bg-slate-800 border-slate-700" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input id="desc" value={newSource.description} onChange={e => setNewSource({ ...newSource, description: e.target.value })} className="bg-slate-800 border-slate-700" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddSource}>Add Source</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Sources Grid */}
        <div className="grid gap-4">
          {sources.map((source, i) => {
            const Icon = source.icon;
            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden hover:border-primary/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${source.active ? source.bgColor : 'bg-muted'} transition-colors`}>
                        <Icon className={`w-6 h-6 ${source.active ? source.color : 'text-muted-foreground'}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{source.name}</h3>
                          {source.active ? (
                            <Badge variant="success" className="animate-pulse">Live</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                          <Badge variant="secondary" className="text-[10px]">{source.type}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {source.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-mono">{source.url}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {source.id === 'wikipedia' ? (
                          <Button
                            variant={source.active ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleSource(source.id)}
                          >
                            <Power className="w-4 h-4 mr-2" />
                            {source.active ? 'Disconnect' : 'Connect'}
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSource(source.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Sources;
