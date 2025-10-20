import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface WebSocketData {
  [key: string]: any;
}

interface WebSocketContextType {
  wsData: WebSocketData | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  subscribe: (endpoint: string) => void;
  unsubscribe: (endpoint: string) => void;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url = import.meta.env.VITE_PURIFICATION_SERVICE_URL?.replace('http', 'ws').replace('https', 'wss') + '/ws' || 'ws://localhost:8087/purification-service/ws'
}) => {
  const [wsData, setWsData] = useState<WebSocketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());

  const connect = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('ShuddhiDoot WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        setSocket(ws);

        // Re-subscribe to any existing subscriptions
        subscriptions.forEach(endpoint => {
          ws.send(JSON.stringify({ type: 'subscribe', endpoint }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setWsData(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('ShuddhiDoot WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setSocket(null);

        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error('ShuddhiDoot WebSocket error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
      // Retry connection after 5 seconds
      setTimeout(connect, 5000);
    }
  }, [url, subscriptions]);

  const subscribe = useCallback((endpoint: string) => {
    setSubscriptions(prev => new Set(prev).add(endpoint));

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'subscribe', endpoint }));
    }
  }, [socket]);

  const unsubscribe = useCallback((endpoint: string) => {
    setSubscriptions(prev => {
      const newSet = new Set(prev);
      newSet.delete(endpoint);
      return newSet;
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'unsubscribe', endpoint }));
    }
  }, [socket]);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  }, [socket]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  const value: WebSocketContextType = {
    wsData,
    isConnected,
    connectionStatus,
    subscribe,
    unsubscribe,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (endpoint?: string) => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  const { subscribe, unsubscribe, ...rest } = context;

  useEffect(() => {
    if (endpoint) {
      subscribe(endpoint);
      return () => unsubscribe(endpoint);
    }
  }, [endpoint, subscribe, unsubscribe]);

  return rest;
};

export default WebSocketContext;