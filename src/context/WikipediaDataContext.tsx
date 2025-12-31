import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useWikipediaStream, WikipediaEvent } from '@/hooks/useWikipediaStream';
import { useTopoForge } from '@/hooks/useTopoForge';
import {
  BettiNumbers,
  PersistencePoint,
  TimelinePoint,
  AnomalyDetection,
  computeBettiNumbers,
  computePersistenceDiagram,
  detectAnomalies,
  computeRiskHeatmap,
  buildTimeline,
} from '@/lib/topologyAnalysis';
import { useToast } from '@/hooks/use-toast';

interface DataSourceStatus {
  id: string;
  name: string;
  type: 'stream' | 'api' | 'webhook';
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync: string;
  eventsPerSecond: number;
}

interface PipelineStage {
  id: string;
  label: string;
  status: 'active' | 'idle' | 'error';
  throughput: string;
}

interface WikipediaDataContextValue {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;

  // Real-time data
  events: WikipediaEvent[];
  recentEvents: WikipediaEvent[];
  eventsPerSecond: number;
  totalEventsProcessed: number;

  // Topological analysis
  bettiNumbers: BettiNumbers;
  persistenceDiagram: PersistencePoint[];

  // Anomaly detection
  anomalies: AnomalyDetection[];
  criticalCount: number;
  warningCount: number;

  // Visualizations
  timeline: TimelinePoint[];
  riskHeatmap: { grid: number[][]; labels: { x: string[]; y: string[] } };

  // Pipeline & sources
  dataSources: DataSourceStatus[];
  pipelineStages: PipelineStage[];

  // Actions
  connect: () => void;
  disconnect: () => void;
  clearAnomalies: () => void;
}

const WikipediaDataContext = createContext<WikipediaDataContextValue | null>(null);

const MAX_EVENTS = 2000;
const ANALYSIS_INTERVAL = 2000;
const EPS_WINDOW = 5000;

export function WikipediaDataProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  // Event storage
  const [events, setEvents] = useState<WikipediaEvent[]>([]);
  const eventsRef = useRef<WikipediaEvent[]>([]); // Ref to hold latest events for analysis loop
  const eventTimestampsRef = useRef<number[]>([]);
  const [eventsPerSecond, setEventsPerSecond] = useState(0);
  const [totalEventsProcessed, setTotalEventsProcessed] = useState(0);

  // Analysis results
  const [bettiNumbers, setBettiNumbers] = useState<BettiNumbers>({ h0: 0, h1: 0, h2: 0 });
  const [persistenceDiagram, setPersistenceDiagram] = useState<PersistencePoint[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [riskHeatmap, setRiskHeatmap] = useState<{ grid: number[][]; labels: { x: string[]; y: string[] } }>({
    grid: [],
    labels: { x: [], y: [] },
  });

  // Previous Betti for anomaly detection
  const previousBettiRef = useRef<BettiNumbers>({ h0: 0, h1: 0, h2: 0 });

  // Connect to TopoForge Backend
  const { isConnected: isBackendConnected, lastAnalysis, sendEvent: sendToBackend } = useTopoForge();

  // Handle incoming events
  const handleEvent = useCallback((event: WikipediaEvent) => {
    const now = Date.now();

    setEvents(prev => {
      const updated = [event, ...prev].slice(0, MAX_EVENTS);
      eventsRef.current = updated;
      return updated;
    });

    eventTimestampsRef.current.push(now);
    setTotalEventsProcessed(prev => prev + 1);

    // Send to Backend for Analysis
    // We send a simplified version to save bandwidth if needed, or the whole object
    sendToBackend({
      ...event,
      value: event.delta || 0, // Map delta to 'value' for the simple backend processor
      timestamp: event.timestamp.toISOString()
    });

  }, [sendToBackend]);

  // Update state when backend sends analysis results
  useEffect(() => {
    if (lastAnalysis) {
      if (lastAnalysis.betti_numbers) {
        setBettiNumbers({
          h0: lastAnalysis.betti_numbers.h0 || 0,
          h1: lastAnalysis.betti_numbers.h1 || 0,
          h2: lastAnalysis.betti_numbers.h2 || 0
        });
      }

      // Update anomalies if detected
      if (lastAnalysis.is_anomaly) {
        const newAnomaly: AnomalyDetection = {
          id: crypto.randomUUID(),
          title: 'AI Detected Anomaly',
          severity: lastAnalysis.anomaly_score > 0.8 ? 'critical' : 'warning',
          source: 'TopoForge AI Core',
          timestamp: 'Just now',
          description: `Structural anomaly detected (Score: ${lastAnalysis.anomaly_score.toFixed(2)})`,
          confidence: Math.round(lastAnalysis.anomaly_score * 100),
          bettiChange: lastAnalysis.betti_numbers
            ? `β₀:${lastAnalysis.betti_numbers.h0} β₁:${lastAnalysis.betti_numbers.h1}`
            : 'β₀:0 β₁:0',
          events: eventsRef.current.slice(0, 5)
        };

        setAnomalies(prev => [newAnomaly, ...prev].slice(0, 20));

        if (newAnomaly.severity === 'critical') {
          toast({
            title: '⚠️ Critical Anomaly Detected',
            description: newAnomaly.title,
            variant: 'destructive',
          });
        }
      }
    }
  }, [lastAnalysis, toast]);

  // Calculate events per second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const windowStart = now - EPS_WINDOW;
      eventTimestampsRef.current = eventTimestampsRef.current.filter(t => t > windowStart);
      const eps = (eventTimestampsRef.current.length / EPS_WINDOW) * 1000;
      setEventsPerSecond(Math.round(eps * 10) / 10);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic visual updates (Timeline/Heatmap) - kept client-side for now or could be moved later
  useEffect(() => {
    const interval = setInterval(() => {
      const currentEvents = eventsRef.current;
      if (currentEvents.length < 10) return;

      // Update timeline
      const newTimeline = buildTimeline(currentEvents);
      setTimeline(newTimeline);

      // Update risk heatmap
      const heatmap = computeRiskHeatmap(currentEvents);
      setRiskHeatmap(heatmap);
    }, ANALYSIS_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Toast refs to avoid recreating callbacks
  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  // Stable callbacks
  const handleConnect = useCallback(() => {
    toastRef.current({
      title: 'Connected to Wikipedia Stream',
      description: 'Receiving live edit events from Wikimedia',
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    toastRef.current({
      title: 'Connection Error',
      description: error.message,
      variant: 'destructive',
    });
  }, []);

  const handleDisconnect = useCallback(() => {
    toastRef.current({
      title: 'Disconnected',
      description: 'Wikipedia stream disconnected',
    });
  }, []);

  // Stream connection
  const stream = useWikipediaStream({
    onEvent: handleEvent,
    onConnect: handleConnect,
    onError: handleError,
    onDisconnect: handleDisconnect,
  });

  // Data sources status
  const dataSources: DataSourceStatus[] = [
    {
      id: 'wikipedia',
      name: 'Wikipedia Recent Changes',
      type: 'stream',
      status: stream.isConnected ? 'connected' : stream.isConnecting ? 'syncing' : 'disconnected',
      lastSync: stream.lastEventTime
        ? `${Math.floor((Date.now() - stream.lastEventTime.getTime()) / 1000)}s ago`
        : 'Never',
      eventsPerSecond,
    },
  ];

  // Pipeline stages
  const pipelineStages: PipelineStage[] = [
    {
      id: 'ingest',
      label: 'Ingest',
      status: stream.isConnected ? 'active' : 'idle',
      throughput: `${eventsPerSecond}/s`,
    },
    {
      id: 'extract',
      label: 'Extract',
      status: stream.isConnected && events.length > 0 ? 'active' : 'idle',
      throughput: `${Math.round(eventsPerSecond * 0.95)}/s`,
    },
    {
      id: 'analyze',
      label: 'TDA',
      status: events.length > 10 ? 'active' : 'idle',
      throughput: `${Math.round(eventsPerSecond * 0.9)}/s`,
    },
    {
      id: 'detect',
      label: 'Detect',
      status: events.length > 10 ? 'active' : 'idle',
      throughput: `${Math.round(eventsPerSecond * 0.9)}/s`,
    },
    {
      id: 'alert',
      label: 'Alert',
      status: anomalies.length > 0 ? 'active' : 'idle',
      throughput: `${anomalies.filter(a => Date.now() - new Date(a.timestamp).getTime() < 60000).length}/min`,
    },
  ];

  const clearAnomalies = useCallback(() => {
    setAnomalies([]);
  }, []);

  const value: WikipediaDataContextValue = {
    isConnected: stream.isConnected,
    isConnecting: stream.isConnecting,
    error: stream.error,
    events,
    recentEvents: events.slice(0, 50),
    eventsPerSecond,
    totalEventsProcessed,
    bettiNumbers,
    persistenceDiagram,
    anomalies,
    criticalCount: anomalies.filter(a => a.severity === 'critical').length,
    warningCount: anomalies.filter(a => a.severity === 'warning').length,
    timeline,
    riskHeatmap,
    dataSources,
    pipelineStages,
    connect: stream.connect,
    disconnect: stream.disconnect,
    clearAnomalies,
  };

  return (
    <WikipediaDataContext.Provider value={value}>
      {children}
    </WikipediaDataContext.Provider>
  );
}

export function useWikipediaData() {
  const context = useContext(WikipediaDataContext);
  if (!context) {
    throw new Error('useWikipediaData must be used within WikipediaDataProvider');
  }
  return context;
}
