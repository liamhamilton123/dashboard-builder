import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { handleClientMessage } from './handlers.js';

export interface WebSocketConnection {
  ws: WebSocket;
  sessionId?: string;
  isAlive: boolean;
}

// Track active connections
const connections = new Map<WebSocket, WebSocketConnection>();

/**
 * Initialize WebSocket server
 */
export function initWebSocketServer(httpServer: HTTPServer): WebSocketServer {
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws/chat',
  });

  console.log('[WebSocket] Server initialized on /ws/chat');

  // Connection handler
  wss.on('connection', (ws: WebSocket) => {
    console.log('[WebSocket] New client connected');

    // Initialize connection tracking
    const connection: WebSocketConnection = {
      ws,
      isAlive: true,
    };
    connections.set(ws, connection);

    // Send welcome message
    sendMessage(ws, {
      type: 'connected',
      message: 'Connected to dashboard builder backend',
    });

    // Message handler
    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        await handleClientMessage(ws, message, connection);
      } catch (error) {
        console.error('[WebSocket] Message handling error:', error);
        sendMessage(ws, {
          type: 'error',
          sessionId: connection.sessionId || 'unknown',
          error: 'MessageParseError',
          message: 'Failed to parse message',
        });
      }
    });

    // Pong handler (for heartbeat)
    ws.on('pong', () => {
      const conn = connections.get(ws);
      if (conn) {
        conn.isAlive = true;
      }
    });

    // Error handler
    ws.on('error', (error) => {
      console.error('[WebSocket] Connection error:', error);
    });

    // Close handler
    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
      connections.delete(ws);
    });
  });

  // Heartbeat interval (ping every 30 seconds)
  const heartbeatInterval = setInterval(() => {
    connections.forEach((connection, ws) => {
      if (!connection.isAlive) {
        console.log('[WebSocket] Terminating inactive connection');
        connections.delete(ws);
        return ws.terminate();
      }

      connection.isAlive = false;
      ws.ping();
    });
  }, 30000);

  // Cleanup on server close
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
    console.log('[WebSocket] Server closed');
  });

  return wss;
}

/**
 * Send a message to a WebSocket client
 */
export function sendMessage(ws: WebSocket, message: unknown): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Get connection info
 */
export function getConnection(ws: WebSocket): WebSocketConnection | undefined {
  return connections.get(ws);
}

/**
 * Get all active connections
 */
export function getAllConnections(): WebSocketConnection[] {
  return Array.from(connections.values());
}
