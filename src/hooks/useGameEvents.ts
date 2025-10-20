// src/hooks/useGameEvents.ts
import { useEffect, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { GameEvent } from '../api/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useGameEvents(gameId: string, token: string) {
    const [events, setEvents] = useState<GameEvent[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ctrl = new AbortController();

        fetchEventSource(`${API_BASE}/games/${gameId}/events`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal: ctrl.signal,
            onopen: async () => {
                setConnected(true);
                setError(null);
            },
            onmessage: (e) => {
                if (e.data) {
                    const event = JSON.parse(e.data) as GameEvent;
                    setEvents((prev) => [...prev, event]);
                }
            },
            onerror: (err) => {
                setConnected(false);
                setError('Connection lost');
                throw err; // Rethrow to stop reconnection
            },
        });

        return () => {
            ctrl.abort();
        };
    }, [gameId, token]);

    return { events, connected, error };
}
