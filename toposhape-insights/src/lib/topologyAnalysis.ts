import { WikipediaEvent } from '@/hooks/useWikipediaStream';

// Simulated Topological Data Analysis utilities
// In production, these would use proper TDA libraries like Giotto-TDA or Ripser

export interface BettiNumbers {
  h0: number; // Connected components
  h1: number; // Loops/cycles
  h2: number; // Voids
}

export interface PersistencePoint {
  birth: number;
  death: number;
  dimension: number;
  id: string;
}

export interface TimelinePoint {
  time: string;
  timestamp: Date;
  value: number;
  anomaly: boolean;
  severity?: 'warning' | 'critical';
  eventCount: number;
}

export interface AnomalyDetection {
  id: string;
  title: string;
  severity: 'warning' | 'critical' | 'info';
  source: string;
  timestamp: string;
  description: string;
  confidence: number;
  bettiChange: string;
  events: WikipediaEvent[];
}

export interface RiskCell {
  x: number;
  y: number;
  value: number;
  label: string;
}

// Compute Betti numbers from event stream characteristics
export function computeBettiNumbers(
  events: WikipediaEvent[],
  windowMs: number = 60000
): BettiNumbers {
  const now = Date.now();
  const windowEvents = events.filter(
    e => now - e.timestamp.getTime() < windowMs
  );

  // H0: Count unique connected components (unique user-article clusters)
  const userArticlePairs = new Set<string>();
  const users = new Set<string>();
  const articles = new Set<string>();
  
  windowEvents.forEach(e => {
    users.add(e.user);
    articles.add(e.title);
    userArticlePairs.add(`${e.user}::${e.title}`);
  });

  // Connected components = unique articles being edited
  const h0 = Math.min(articles.size, 50);

  // H1: Cycles detected when same user edits multiple related articles
  // or multiple users edit same article (collaboration loops)
  const userEditCounts = new Map<string, number>();
  const articleEditCounts = new Map<string, number>();
  
  windowEvents.forEach(e => {
    userEditCounts.set(e.user, (userEditCounts.get(e.user) || 0) + 1);
    articleEditCounts.set(e.title, (articleEditCounts.get(e.title) || 0) + 1);
  });

  // Loops = users with multiple edits + articles with multiple editors
  const multiEditUsers = [...userEditCounts.values()].filter(c => c > 2).length;
  const multiEditorArticles = [...articleEditCounts.values()].filter(c => c > 1).length;
  const h1 = Math.min(multiEditUsers + Math.floor(multiEditorArticles / 2), 30);

  // H2: Voids - rare coordinated editing patterns across multiple wikis
  const wikiCounts = new Map<string, number>();
  windowEvents.forEach(e => {
    wikiCounts.set(e.wiki, (wikiCounts.get(e.wiki) || 0) + 1);
  });
  const activeWikis = [...wikiCounts.values()].filter(c => c > 5).length;
  const h2 = Math.min(Math.floor(activeWikis / 3), 10);

  return { h0, h1, h2 };
}

// Generate persistence diagram points from event characteristics
export function computePersistenceDiagram(
  events: WikipediaEvent[],
  windowMs: number = 60000
): PersistencePoint[] {
  const now = Date.now();
  const windowEvents = events.filter(
    e => now - e.timestamp.getTime() < windowMs
  );

  const points: PersistencePoint[] = [];
  
  // Create points based on event patterns
  const userActivity = new Map<string, { first: number; last: number; count: number }>();
  
  windowEvents.forEach(e => {
    const t = e.timestamp.getTime();
    const existing = userActivity.get(e.user);
    if (existing) {
      existing.last = Math.max(existing.last, t);
      existing.first = Math.min(existing.first, t);
      existing.count++;
    } else {
      userActivity.set(e.user, { first: t, last: t, count: 1 });
    }
  });

  // Generate persistence points for H0 (components)
  userActivity.forEach((activity, user) => {
    if (activity.count >= 2) {
      const birth = (activity.first - (now - windowMs)) / windowMs;
      const death = Math.min((activity.last - (now - windowMs)) / windowMs + 0.1, 1);
      if (death > birth) {
        points.push({
          id: `h0-${user}`,
          dimension: 0,
          birth: Math.max(0, birth),
          death: Math.min(1, death),
        });
      }
    }
  });

  // Generate H1 points for cyclical patterns
  const articleCollaborators = new Map<string, Set<string>>();
  windowEvents.forEach(e => {
    if (!articleCollaborators.has(e.title)) {
      articleCollaborators.set(e.title, new Set());
    }
    articleCollaborators.get(e.title)!.add(e.user);
  });

  articleCollaborators.forEach((users, article) => {
    if (users.size > 1) {
      const birth = Math.random() * 0.3;
      const death = birth + 0.2 + Math.random() * 0.5;
      points.push({
        id: `h1-${article}`,
        dimension: 1,
        birth,
        death: Math.min(death, 1),
      });
    }
  });

  // Generate H2 points for cross-wiki patterns
  const wikiActivity = new Map<string, number>();
  windowEvents.forEach(e => {
    wikiActivity.set(e.wiki, (wikiActivity.get(e.wiki) || 0) + 1);
  });

  wikiActivity.forEach((count, wiki) => {
    if (count > 10) {
      points.push({
        id: `h2-${wiki}`,
        dimension: 2,
        birth: Math.random() * 0.2,
        death: 0.3 + Math.random() * 0.6,
      });
    }
  });

  return points.slice(0, 50); // Limit for performance
}

// Detect anomalies based on topological changes
export function detectAnomalies(
  currentBetti: BettiNumbers,
  previousBetti: BettiNumbers,
  recentEvents: WikipediaEvent[]
): AnomalyDetection[] {
  const anomalies: AnomalyDetection[] = [];
  const now = new Date();

  // Sudden spike in connected components (H0)
  const h0Change = currentBetti.h0 - previousBetti.h0;
  if (Math.abs(h0Change) > 10) {
    const severity = Math.abs(h0Change) > 20 ? 'critical' : 'warning';
    anomalies.push({
      id: `anomaly-h0-${Date.now()}`,
      title: h0Change > 0 ? 'Rapid Topic Proliferation' : 'Topic Consolidation Event',
      severity,
      source: 'Wikipedia Stream',
      timestamp: formatTimeAgo(now),
      description: h0Change > 0 
        ? `Sudden increase in distinct editing clusters detected (${h0Change} new components)`
        : `Topics are converging into fewer clusters (${Math.abs(h0Change)} components merged)`,
      confidence: Math.min(95, 70 + Math.abs(h0Change)),
      bettiChange: `β₀: ${h0Change > 0 ? '+' : ''}${h0Change}`,
      events: recentEvents.slice(0, 5),
    });
  }

  // Emergence of new cycles (H1)
  const h1Change = currentBetti.h1 - previousBetti.h1;
  if (Math.abs(h1Change) > 5) {
    const severity = Math.abs(h1Change) > 10 ? 'critical' : 'warning';
    anomalies.push({
      id: `anomaly-h1-${Date.now()}`,
      title: h1Change > 0 ? 'Collaborative Loop Formation' : 'Collaboration Breakdown',
      severity,
      source: 'Wikipedia Stream',
      timestamp: formatTimeAgo(now),
      description: h1Change > 0
        ? `New editing cycles detected - users forming interconnected editing patterns`
        : `Collaborative patterns dissolving - isolated editing increasing`,
      confidence: Math.min(92, 65 + Math.abs(h1Change) * 2),
      bettiChange: `β₁: ${h1Change > 0 ? '+' : ''}${h1Change}`,
      events: recentEvents.slice(0, 5),
    });
  }

  // Bot activity surge
  const botEvents = recentEvents.filter(e => e.bot).length;
  const botRatio = recentEvents.length > 0 ? botEvents / recentEvents.length : 0;
  if (botRatio > 0.6 && recentEvents.length > 50) {
    anomalies.push({
      id: `anomaly-bot-${Date.now()}`,
      title: 'High Bot Activity Detected',
      severity: 'info',
      source: 'Wikipedia Stream',
      timestamp: formatTimeAgo(now),
      description: `${Math.round(botRatio * 100)}% of recent edits are from bots - automated maintenance in progress`,
      confidence: 88,
      bettiChange: `Bot: ${Math.round(botRatio * 100)}%`,
      events: recentEvents.filter(e => e.bot).slice(0, 5),
    });
  }

  // Large edit detection
  const largeEdits = recentEvents.filter(e => Math.abs(e.delta || 0) > 10000);
  if (largeEdits.length > 3) {
    anomalies.push({
      id: `anomaly-large-${Date.now()}`,
      title: 'Unusual Large Edit Volume',
      severity: 'warning',
      source: 'Wikipedia Stream',
      timestamp: formatTimeAgo(now),
      description: `${largeEdits.length} edits with >10KB changes detected - potential content restructuring`,
      confidence: 78,
      bettiChange: `Δ: ${largeEdits.length} large`,
      events: largeEdits.slice(0, 5),
    });
  }

  return anomalies;
}

// Compute risk heatmap from wiki/namespace activity
export function computeRiskHeatmap(
  events: WikipediaEvent[]
): { grid: number[][]; labels: { x: string[]; y: string[] } } {
  const wikis = ['enwiki', 'dewiki', 'frwiki', 'eswiki', 'jawiki', 'zhwiki', 'commons'];
  const namespaces = ['Main', 'Talk', 'User', 'Wiki', 'File', 'Template'];

  const grid: number[][] = [];
  
  for (let i = 0; i < namespaces.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < wikis.length; j++) {
      const matchingEvents = events.filter(e => 
        e.wiki === wikis[j] && 
        getNamespaceCategory(e.namespace) === namespaces[i]
      );
      
      // Calculate risk based on edit volume and characteristics
      const volume = matchingEvents.length;
      const largeEdits = matchingEvents.filter(e => Math.abs(e.delta || 0) > 5000).length;
      const botEdits = matchingEvents.filter(e => e.bot).length;
      
      let risk = Math.min(volume / 50, 0.5);
      risk += (largeEdits / 10) * 0.3;
      risk += (1 - botEdits / Math.max(volume, 1)) * 0.2; // Human edits are riskier
      
      row.push(Math.min(Math.max(risk, 0.05), 1));
    }
    grid.push(row);
  }

  return {
    grid,
    labels: {
      x: wikis.map(w => w.replace('wiki', '').toUpperCase()),
      y: namespaces,
    },
  };
}

function getNamespaceCategory(ns: number): string {
  if (ns === 0) return 'Main';
  if (ns === 1) return 'Talk';
  if (ns === 2 || ns === 3) return 'User';
  if (ns === 4 || ns === 5) return 'Wiki';
  if (ns === 6 || ns === 7) return 'File';
  return 'Template';
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// Build timeline data from events
export function buildTimeline(
  events: WikipediaEvent[],
  intervalMs: number = 30000,
  points: number = 24
): TimelinePoint[] {
  const now = Date.now();
  const timeline: TimelinePoint[] = [];
  
  for (let i = points - 1; i >= 0; i--) {
    const start = now - (i + 1) * intervalMs;
    const end = now - i * intervalMs;
    
    const intervalEvents = events.filter(e => {
      const t = e.timestamp.getTime();
      return t >= start && t < end;
    });

    const eventCount = intervalEvents.length;
    const value = Math.min(eventCount / 100, 1); // Normalize to 0-1
    
    // Detect anomalies in this interval
    const largeEdits = intervalEvents.filter(e => Math.abs(e.delta || 0) > 5000).length;
    const isAnomaly = eventCount > 80 || largeEdits > 5;
    const severity = eventCount > 120 || largeEdits > 10 ? 'critical' : 'warning';

    const date = new Date(end);
    timeline.push({
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: date,
      value,
      anomaly: isAnomaly,
      severity: isAnomaly ? severity : undefined,
      eventCount,
    });
  }

  return timeline;
}
