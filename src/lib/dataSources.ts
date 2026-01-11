// Mock Data Source Implementations for Multiple Feeds
// Simulates real-time threat intelligence, financial, and social data streams

export interface ThreatEvent {
    id: string;
    timestamp: Date;
    source: string;
    threatType: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'vulnerability' | 'suspicious';
    severity: 'critical' | 'high' | 'medium' | 'low';
    indicator: string;
    indicatorType: 'ip' | 'domain' | 'hash' | 'url' | 'email';
    confidence: number;
    country?: string;
    description: string;
    tags: string[];
}

export interface CryptoEvent {
    id: string;
    timestamp: Date;
    symbol: string;
    price: number;
    change: number;
    volume: number;
    anomaly?: boolean;
}

export interface GitHubEvent {
    id: string;
    timestamp: Date;
    type: 'push' | 'pull_request' | 'issues' | 'release' | 'fork' | 'star';
    repo: string;
    user: string;
    action: string;
}

export interface RedditEvent {
    id: string;
    timestamp: Date;
    subreddit: string;
    title: string;
    upvotes: number;
    comments: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    anomaly?: boolean;
}

// Kaspersky-style Threat Feed Generator
export function generateKasperskyThreat(): ThreatEvent {
    const threatTypes: ThreatEvent['threatType'][] = ['malware', 'phishing', 'intrusion', 'vulnerability'];
    const severities: ThreatEvent['severity'][] = ['critical', 'high', 'medium', 'low'];
    const countries = ['RU', 'CN', 'US', 'BR', 'IN', 'KR', 'DE', 'FR', 'GB', 'JP'];

    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    const generateIP = () =>
        `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        source: 'Kaspersky Threat Intelligence',
        threatType: type,
        severity,
        indicator: generateIP(),
        indicatorType: 'ip',
        confidence: 70 + Math.random() * 30,
        country: countries[Math.floor(Math.random() * countries.length)],
        description: `${type.toUpperCase()} activity detected via Kaspersky Global Threat Network`,
        tags: ['kaspersky', type, severity, 'apt'],
    };
}

// Bitdefender-style Threat Feed Generator
export function generateBitdefenderThreat(): ThreatEvent {
    const malwareFamilies = ['zeus', 'emotet', 'trickbot', 'ryuk', 'wannacry', 'locky'];
    const family = malwareFamilies[Math.floor(Math.random() * malwareFamilies.length)];

    const generateDomain = () => `malicious-${Math.random().toString(36).substr(2, 8)}.com`;

    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        source: 'Bitdefender Threat Intel',
        threatType: 'malware',
        severity: Math.random() > 0.7 ? 'critical' : 'high',
        indicator: generateDomain(),
        indicatorType: 'domain',
        confidence: 80 + Math.random() * 20,
        description: `${family.toUpperCase()} malware family detected by GravityZone`,
        tags: ['bitdefender', 'malware', family, 'c2'],
    };
}

// ANY.RUN Malware Sandbox Generator
export function generateAnyRunSandbox(): ThreatEvent {
    const behaviors = ['file-encryption', 'registry-modification', 'network-scan', 'credential-theft'];
    const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];

    const generateHash = () =>
        Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        source: 'ANY.RUN Sandbox',
        threatType: 'malware',
        severity: behavior === 'file-encryption' ? 'critical' : 'high',
        indicator: generateHash(),
        indicatorType: 'hash',
        confidence: 90 + Math.random() * 10,
        description: `Behavioral analysis: ${behavior} detected in sandbox environment`,
        tags: ['anyrun', 'sandbox', behavior, 'dynamic-analysis'],
    };
}

// Cryptocurrency Market Feed Generator
export function generateCryptoEvent(): CryptoEvent {
    const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'LINK'];
    const basePrices: Record<string, number> = {
        BTC: 45000, ETH: 2500, SOL: 100, ADA: 0.5, DOT: 7, MATIC: 1, AVAX: 35, LINK: 15
    };

    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const change = (Math.random() - 0.5) * 15; // -7.5% to +7.5%
    const basePrice = basePrices[symbol];
    const price = basePrice * (1 + change / 100);

    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        symbol,
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        volume: Math.floor(Math.random() * 5000000),
        anomaly: Math.abs(change) > 7,
    };
}

// GitHub Events Feed Generator
export function generateGitHubEvent(): GitHubEvent {
    const types: GitHubEvent['type'][] = ['push', 'pull_request', 'issues', 'release', 'fork', 'star'];
    const repos = [
        'tensorflow/tensorflow',
        'facebook/react',
        'microsoft/vscode',
        'torvalds/linux',
        'kubernetes/kubernetes',
        'nodejs/node',
        'python/cpython',
    ];

    const type = types[Math.floor(Math.random() * types.length)];

    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type,
        repo: repos[Math.floor(Math.random() * repos.length)],
        user: `dev_${Math.floor(Math.random() * 10000)}`,
        action: `${type} event on repository`,
    };
}

// Reddit Trending Feed Generator
export function generateRedditEvent(): RedditEvent {
    const subreddits = ['technology', 'programming', 'machinelearning', 'datascience', 'cybersecurity', 'devops'];
    const topics = ['AI', 'Security', 'Cloud Computing', 'DevOps', 'Blockchain', 'Quantum'];
    const sentiments: RedditEvent['sentiment'][] = ['positive', 'neutral', 'negative'];

    const upvotes = Math.floor(Math.random() * 15000);
    const topic = topics[Math.floor(Math.random() * topics.length)];

    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        subreddit: subreddits[Math.floor(Math.random() * subreddits.length)],
        title: `Discussion: ${topic} trends and predictions for 2025`,
        upvotes,
        comments: Math.floor(upvotes * (0.05 + Math.random() * 0.15)),
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        anomaly: upvotes > 10000,
    };
}

// Combined event type for unified handling
export type UnifiedEvent = ThreatEvent | CryptoEvent | GitHubEvent | RedditEvent;

// Export all generators
export const dataSourceGenerators = {
    kaspersky: generateKasperskyThreat,
    bitdefender: generateBitdefenderThreat,
    anyrun: generateAnyRunSandbox,
    crypto: generateCryptoEvent,
    github: generateGitHubEvent,
    reddit: generateRedditEvent,
};
