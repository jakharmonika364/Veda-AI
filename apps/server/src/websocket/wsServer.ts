import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage, Server } from 'http';
import type { WsEvent } from '@vedaai/shared';

type SubscriptionMap = Map<string, Set<WebSocket>>;

const subscriptions: SubscriptionMap = new Map();

export function setupWebSocket(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
    let subscribedTo: Set<string> = new Set();

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as { event: string; assignmentId: string };

        if (msg.event === 'subscribe' && msg.assignmentId) {
          if (!subscriptions.has(msg.assignmentId)) {
            subscriptions.set(msg.assignmentId, new Set());
          }
          subscriptions.get(msg.assignmentId)!.add(ws);
          subscribedTo.add(msg.assignmentId);
        }

        if (msg.event === 'unsubscribe' && msg.assignmentId) {
          subscriptions.get(msg.assignmentId)?.delete(ws);
          subscribedTo.delete(msg.assignmentId);
        }
      } catch {
        // ignore malformed messages
      }
    });

    ws.on('close', () => {
      for (const assignmentId of subscribedTo) {
        subscriptions.get(assignmentId)?.delete(ws);
      }
      subscribedTo.clear();
    });

    // Ping/pong heartbeat
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30_000);

    ws.on('close', () => clearInterval(interval));
  });

  return wss;
}

export function emitToAssignment<T>(assignmentId: string, event: WsEvent, data: T): void {
  const clients = subscriptions.get(assignmentId);
  if (!clients || clients.size === 0) return;

  const payload = JSON.stringify({ event, data });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}
