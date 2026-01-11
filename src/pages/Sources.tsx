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
  Activity
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Sources = () => {
  const { isConnected, connect, disconnect, eventsPerSecond, totalEventsProcessed } = useWikipediaData();

  // Mock active states for other sources
  const [activeSourcesState, setActiveSourcesState] = useState({
    wikipedia: isConnected,
    kaspersky: true,
    bitdefender: true,
    anyrun: true,
    crypto: false,
    github: false,
    reddit: false,
  });

  const toggleSource = (sourceId: string) => {
    if (sourceId === 'wikipedia') {
      if (isConnected) {
        disconnect();
      } else {
        connect();
      }
    } else {
      setActiveSourcesState(prev => ({
        ...prev,
        [sourceId]: !prev[sourceId as keyof typeof activeSourcesState]
      }));
    }
  };

  const allSources = [
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
    },
    {
      id: 'kaspersky',
      name: 'Kaspersky Threat Intelligence',
      description: 'Global threat data from Kaspersky Lab security network',
      type: 'Threat Intel',
      protocol: 'Mock Stream',
      icon: Shield,
      url: 'threat.kaspersky.com',
      eventsPerSecond: activeSourcesState.kaspersky ? 15 : 0,
      totalEvents: activeSourcesState.kaspersky ? 8245 : 0,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      id: 'bitdefender',
      name: 'Bitdefender Threat Feed',
      description: 'Advanced malware and exploit intelligence from Bitdefender',
      type: 'Threat Intel',
      protocol: 'Mock Stream',
      icon: Shield,
      url: 'intel.bitdefender.com',
      eventsPerSecond: activeSourcesState.bitdefender ? 12 : 0,
      totalEvents: activeSourcesState.bitdefender ? 5632 : 0,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      id: 'anyrun',
      name: 'ANY.RUN Malware Sandbox',
      description: 'Interactive malware analysis results and behavioral data',
      type: 'Threat Intel',
      protocol: 'Mock Stream',
      icon: Shield,
      url: 'api.any.run',
      eventsPerSecond: activeSourcesState.anyrun ? 5 : 0,
      totalEvents: activeSourcesState.anyrun ? 1891 : 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency Market Data',
      description: 'Real-time crypto prices, volumes, and anomaly detection',
      type: 'Financial',
      protocol: 'Mock Stream',
      icon: DollarSign,
      url: 'api.crypto.com',
      eventsPerSecond: activeSourcesState.crypto ? 30 : 0,
      totalEvents: activeSourcesState.crypto ? 12453 : 0,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 'github',
      name: 'GitHub Public Events',
      description: 'Public repository events: pushes, PRs, issues, stars, forks',
      type: 'Developer',
      protocol: 'Mock Stream',
      icon: GitBranch,
      url: 'api.github.com',
      eventsPerSecond: activeSourcesState.github ? 25 : 0,
      totalEvents: activeSourcesState.github ? 9876 : 0,
      color: 'text-gray-300',
      bgColor: 'bg-gray-500/10',
    },
    {
      id: 'reddit',
      name: 'Reddit Trending Feed',
      description: 'Trending posts, sentiment analysis, and discussion monitoring',
      type: 'Social Media',
      protocol: 'Mock Stream',
      icon: MessageSquare,
      url: 'oauth.reddit.com',
      eventsPerSecond: activeSourcesState.reddit ? 10 : 0,
      totalEvents: activeSourcesState.reddit ? 4321 : 0,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
  ];

  const activeCount = Object.values(activeSourcesState).filter(Boolean).length;
  const totalEventsSum = allSources.reduce((sum, s) => sum + s.totalEvents, 0);
  const totalThroughput = allSources.reduce((sum, s) => sum + s.eventsPerSecond, 0);

  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredSources = allSources.filter(source => {
    const isActive = activeSourcesState[source.id as keyof typeof activeSourcesState];
    if (filter === 'active') return isActive;
    if (filter === 'inactive') return !isActive;
    return true;
  });

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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground mt-1"
            >
              Manage your real-time data stream connections
            </motion.p>
          </div>

          <Button variant="default" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Custom Source
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Database className="w-5 h-5 text-primary" />
                  <Badge variant="success">{activeCount} active</Badge>
                </div>
                <div className="text-2xl font-bold">{allSources.length}</div>
                <div className="text-xs text-muted-foreground">Total Sources</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="text-2xl font-bold text-success">{totalThroughput}/s</div>
                <div className="text-xs text-muted-foreground">Total Throughput</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Radio className="w-5 h-5 text-info" />
                </div>
                <div className="text-2xl font-bold">{totalEventsSum.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {activeSourcesState.kaspersky && activeSourcesState.bitdefender && activeSourcesState.anyrun ? '3' : '0'}
                </div>
                <div className="text-xs text-muted-foreground">Threat Intel Feeds</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="h-8"
          >
            All Sources
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
            className="h-8"
          >
            Active
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('inactive')}
            className="h-8"
          >
            Inactive
          </Button>
        </div>

        {/* Data Sources Grid */}
        <div className="grid gap-4">
          {filteredSources.map((source, i) => {
            const isActive = activeSourcesState[source.id as keyof typeof activeSourcesState];
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
                      <div className={`p-3 rounded-xl ${isActive ? source.bgColor : 'bg-muted'} transition-colors`}>
                        <Icon className={`w-6 h-6 ${isActive ? source.color : 'text-muted-foreground'}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{source.name}</h3>
                          {isActive && (
                            <Badge variant="success" className="animate-pulse">Live</Badge>
                          )}
                          {!isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                          <Badge variant="secondary" className="text-[10px]">{source.type}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {source.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1" title="Protocol">
                            <Database className="w-3 h-3" />
                            {source.protocol}
                          </span>
                          <span className="font-mono" title="Endpoint">{source.url}</span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-success" title="Latency">
                              <Activity className="w-3 h-3" />
                              {Math.floor(Math.random() * 50 + 10)}ms
                            </span>
                          )}
                        </div>

                        {/* Sparkline visualization */}
                        {isActive && (
                          <div className="mt-3 h-8 flex items-end gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                            {Array.from({ length: 40 }).map((_, idx) => (
                              <div
                                key={idx}
                                className={cn("w-1 rounded-t-sm", source.color.replace('text-', 'bg-'))}
                                style={{ height: `${Math.random() * 100}%` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && source.id === 'wikipedia' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant={isActive ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleSource(source.id)}
                          className={isActive ? "text-critical hover:text-critical hover:bg-critical/10" : ""}
                        >
                          <Power className="w-4 h-4 mr-2" />
                          {isActive ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-primary flex items-center gap-2">
                <Shield className="w-5 h-5" />
                About Threat Intelligence Feeds
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our platform integrates with industry-leading threat intelligence providers to deliver
                real-time security insights. Kaspersky, Bitdefender, and ANY.RUN provide complementary
                data streams covering malware, exploits, phishing, and advanced persistent threats (APTs).
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h4 className="text-sm font-semibold text-red-500 mb-1">Kaspersky</h4>
                  <p className="text-xs text-muted-foreground">
                    Global threat network with 400M+ endpoints
                  </p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <h4 className="text-sm font-semibold text-orange-500 mb-1">Bitdefender</h4>
                  <p className="text-xs text-muted-foreground">
                    Advanced malware detection and C2 tracking
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="text-sm font-semibold text-purple-500 mb-1">ANY.RUN</h4>
                  <p className="text-xs text-muted-foreground">
                    Interactive sandbox behavioral analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Sources;
