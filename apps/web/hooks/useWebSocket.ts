'use client';

import { useEffect, useRef } from 'react';
import { useSocketStore } from '@/store/socketStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useCreateFormStore } from '@/store/createFormStore';
import type { WsJobProgressData, WsJobCompletedData, WsJobFailedData } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000';
const MAX_RETRIES = 5;

export function useWebSocket() {
  // Use individual selectors so Zustand can compare primitives/stable refs with Object.is
  const socket = useSocketStore((s) => s.socket);
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const connected = useSocketStore((s) => s.connected);
  const subscribe = useSocketStore((s) => s.subscribe);
  const unsubscribe = useSocketStore((s) => s.unsubscribe);

  const updateAssignmentStatus = useAssignmentStore((s) => s.updateAssignmentStatus);
  const setJobProgress = useCreateFormStore((s) => s.setJobProgress);

  const retryCount = useRef(0);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    connect(WS_URL);
    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    function handleMessage(event: MessageEvent) {
      try {
        const msg = JSON.parse(event.data as string) as { event: string; data: unknown };

        switch (msg.event) {
          case 'job:progress': {
            const d = msg.data as WsJobProgressData;
            setJobProgress({ percent: d.percent, message: d.message, status: 'processing' });
            break;
          }
          case 'job:started': {
            setJobProgress({ status: 'processing', percent: 5, message: 'Starting...' });
            break;
          }
          case 'job:queued': {
            setJobProgress({ status: 'queued', percent: 0, message: 'Queued...' });
            break;
          }
          case 'job:completed': {
            const d = msg.data as WsJobCompletedData;
            updateAssignmentStatus(d.assignmentId, 'completed');
            setJobProgress({ status: 'completed', percent: 100, message: 'Done!' });
            break;
          }
          case 'job:failed': {
            const d = msg.data as WsJobFailedData;
            updateAssignmentStatus(d.assignmentId, 'failed');
            setJobProgress({ status: 'failed', percent: 0, message: d.error });
            break;
          }
        }
      } catch {
        // ignore malformed messages
      }
    }

    function handleClose() {
      if (retryCount.current < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30_000);
        retryCount.current++;
        retryTimeout.current = setTimeout(() => connect(WS_URL), delay);
      }
    }

    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', handleClose);

    return () => {
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('close', handleClose);
    };
  }, [socket, connect, updateAssignmentStatus, setJobProgress]);

  return { connected, subscribe, unsubscribe };
}
