import { useEffect, useRef, useCallback, useState } from 'react';

export interface WikipediaEvent {
  id: string;
  type: 'edit' | 'new' | 'log' | 'categorize';
  title: string;
  user: string;
  bot: boolean;
  minor: boolean;
  namespace: number;
  timestamp: Date;
  oldLength?: number;
  newLength?: number;
  delta?: number;
  comment?: string;
  wiki: string;
  serverUrl: string;
}

interface UseWikipediaStreamOptions {
  onEvent?: (event: WikipediaEvent) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoConnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

interface StreamState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  eventsReceived: number;
  lastEventTime: Date | null;
}

export function useWikipediaStream(options: UseWikipediaStreamOptions = {}) {
  const {
    onEvent,
    onError,
    onConnect,
    onDisconnect,
    autoConnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isConnectingRef = useRef(false);
  const callbacksRef = useRef({ onEvent, onError, onConnect, onDisconnect });
  
  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = { onEvent, onError, onConnect, onDisconnect };
  }, [onEvent, onError, onConnect, onDisconnect]);
  
  const [state, setState] = useState<StreamState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    eventsReceived: 0,
    lastEventTime: null,
  });

  const parseEvent = useCallback((data: string): WikipediaEvent | null => {
    try {
      const parsed = JSON.parse(data);
      
      // Filter for actual edit events
      if (!['edit', 'new', 'log', 'categorize'].includes(parsed.type)) {
        return null;
      }

      return {
        id: parsed.id?.toString() || crypto.randomUUID(),
        type: parsed.type,
        title: parsed.title || 'Unknown',
        user: parsed.user || 'Anonymous',
        bot: parsed.bot || false,
        minor: parsed.minor || false,
        namespace: parsed.namespace || 0,
        timestamp: new Date(parsed.timestamp * 1000 || Date.now()),
        oldLength: parsed.length?.old,
        newLength: parsed.length?.new,
        delta: parsed.length ? (parsed.length.new - parsed.length.old) : 0,
        comment: parsed.comment,
        wiki: parsed.wiki || 'unknown',
        serverUrl: parsed.server_url || '',
      };
    } catch (e) {
      console.error('Failed to parse Wikipedia event:', e);
      return null;
    }
  }, []);

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connections
    if (isConnectingRef.current || eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    isConnectingRef.current = true;
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      console.log('[Wikipedia SSE] Connecting to stream...');
      
      // Wikipedia EventStreams SSE endpoint
      const eventSource = new EventSource(
        'https://stream.wikimedia.org/v2/stream/recentchange'
      );

      eventSource.onopen = () => {
        console.log('[Wikipedia SSE] Connected successfully');
        isConnectingRef.current = false;
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
        reconnectAttemptsRef.current = 0;
        callbacksRef.current.onConnect?.();
      };

      eventSource.onmessage = (e) => {
        const event = parseEvent(e.data);
        if (event) {
          setState(prev => ({
            ...prev,
            eventsReceived: prev.eventsReceived + 1,
            lastEventTime: new Date(),
          }));
          callbacksRef.current.onEvent?.(event);
        }
      };

      eventSource.onerror = () => {
        console.warn('[Wikipedia SSE] Connection error, will retry...');
        isConnectingRef.current = false;
        
        const wasConnected = eventSourceRef.current?.readyState !== EventSource.CONNECTING;
        
        // Don't treat initial connection attempts as errors immediately
        // EventSource will auto-reconnect
        if (wasConnected) {
          const error = new Error('SSE connection lost');
          setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: true,
            error,
          }));
          callbacksRef.current.onDisconnect?.();
        }
      };

      eventSourceRef.current = eventSource;
    } catch (e) {
      console.error('[Wikipedia SSE] Failed to create EventSource:', e);
      isConnectingRef.current = false;
      const error = e instanceof Error ? e : new Error('Failed to connect');
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error,
      }));
      callbacksRef.current.onError?.(error);
    }
  }, [parseEvent]);

  const disconnect = useCallback(() => {
    console.log('[Wikipedia SSE] Disconnecting...');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    isConnectingRef.current = false;
    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }));
    callbacksRef.current.onDisconnect?.();
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      // Small delay to ensure component is fully mounted
      const timeout = setTimeout(() => {
        connect();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [autoConnect]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    reconnect: () => {
      reconnectAttemptsRef.current = 0;
      disconnect();
      setTimeout(connect, 100);
    },
  };
}
