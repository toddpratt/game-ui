import { apiRequest } from './client';
import type { GameSummary, Location } from './types';

export async function listGames() {
    return apiRequest<{ games: GameSummary[]; count: number }>('/games');
}

export async function createGame() {
    return apiRequest<{ game_id: string; locations: Record<string, Location> }>(
        '/games',
        { method: 'POST' }
    );
}

export async function getGame(gameId: string) {
    return apiRequest<{
        game_id: string;
        locations: Record<string, Location>;
        players: Record<string, any>;
    }>(`/games/${gameId}`);
}