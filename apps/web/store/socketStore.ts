import { create } from 'zustand';

interface SocketState {
  socket: WebSocket | null;
  connected: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  subscribe: (assignmentId: string) => void;
  unsubscribe: (assignmentId: string) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,

  connect: (url: string) => {
    const existing = get().socket;
    // Don't open a new socket if one is already connecting or open
    if (existing && existing.readyState <= WebSocket.OPEN) return;

    const ws = new WebSocket(url + '/ws');
    // Set socket immediately so identity checks work in callbacks
    set({ socket: ws });

    ws.onopen = () => {
      if (get().socket === ws) set({ connected: true });
    };
    ws.onclose = () => {
      // Only clear if this ws is still the current one (guards against StrictMode double-mount)
      if (get().socket === ws) set({ connected: false, socket: null });
    };
    ws.onerror = () => {
      if (get().socket === ws) set({ connected: false });
    };
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.onclose = null; // prevent the onclose from clearing state after intentional disconnect
      socket.close();
    }
    set({ socket: null, connected: false });
  },

  subscribe: (assignmentId: string) => {
    const { socket } = get();
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event: 'subscribe', assignmentId }));
    }
  },

  unsubscribe: (assignmentId: string) => {
    const { socket } = get();
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event: 'unsubscribe', assignmentId }));
    }
  },
}));
