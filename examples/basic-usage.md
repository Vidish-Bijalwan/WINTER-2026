# Basic Usage Examples

## Connecting to a Data Stream

```typescript
import { useTopoForge } from './hooks/useTopoForge';

function DataMonitor() {
  const { isConnected, lastEvent } = useTopoForge();

  return (
    <div>
      <h2>Status: {isConnected ? '🟢 Online' : '🔴 Offline'}</h2>
      <pre>{JSON.stringify(lastEvent, null, 2)}</pre>
    </div>
  );
}
```

## Configuring Anomaly Thresholds

```typescript
// src/config/thresholds.ts

export const ANOMALY_CONFIG = {
  // Sensitivity for Betti-1 loops (coordinated rings)
  loopSensitivity: 0.8,
  
  // Minimum nodes to consider a cluster
  minClusterSize: 5,
  
  // Window size for analysis (seconds)
  windowSize: 60
};
```
