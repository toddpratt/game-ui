import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGameEvents } from '../hooks/useGameEvents';
import { getPlayerContext, movePlayer } from '../api/players';
import type { PlayerContext } from '../api/types';

export function GamePlay() {
    const { gameId } = useParams<{ gameId: string }>();
    const { auth } = useAuth();
    const [context, setContext] = useState<PlayerContext | null>(null);
    const { events, connected } = useGameEvents(gameId!, auth.token!);

    useEffect(() => {
        if (gameId && auth.token) {
            loadContext();
        }
    }, [gameId, auth.token]);

    useEffect(() => {
        if (events.length === 0) return;
        const latestEvent = events[events.length - 1];
        // Refresh player list when players move, join, leave, or are defeated
        if (latestEvent.type === 'player_moved' || latestEvent.type === 'player_joined' || latestEvent.type === 'player_left') {
            loadContext();
        }
    }, [events]);

    async function loadContext() {
        try {
            const data = await getPlayerContext(gameId!, auth.token!);
            setContext(data);
        } catch (error) {
            console.error('Failed to load context:', error);
        }
    }

    async function handleMove(locationId: string) {
        try {
            await movePlayer(gameId!, auth.token!, locationId);
            await loadContext(); // Refresh context
        } catch (error) {
            console.error('Failed to move:', error);
        }
    }

    if (!context) return <div>Loading...</div>;

    return (
        <div>
            <h1>{context.current_location.name}</h1>
            <p>{context.current_location.description}</p>

            <h2>Exits</h2>
            {context.connected_locations.map(loc => (
                <button key={loc.id} onClick={() => handleMove(loc.id)}>
                    Go to {loc.name}
                </button>
            ))}

            <h2>Players Here</h2>
            {context.players_here.map(p => (
                <div key={p.id}>{p.name} (HP: {p.health})</div>
            ))}

            <h2>Events</h2>
            <div className="event-feed">
                {events.map((e, i) => (
                    <div key={i}>{e.message}</div>
                ))}
            </div>

            <div>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
        </div>
    );
}