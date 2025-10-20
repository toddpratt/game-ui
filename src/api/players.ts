// src/api/players.ts
import { apiRequest, getAuthHeaders } from './client';
import type { Player, PlayerContext } from './types';

export async function joinGame(gameId: string, name: string) {
    return apiRequest<{ player: Player; token: string }>(
        `/games/${gameId}/players`,
        {
            method: 'POST',
            body: JSON.stringify({ name }),
        }
    );
}

export async function getPlayerContext(gameId: string, token: string) {
    return apiRequest<PlayerContext>(
        `/games/${gameId}/players/me`,
        {
            headers: getAuthHeaders(token),
        }
    );
}

export async function movePlayer(
    gameId: string,
    token: string,
    locationId: string
) {
    return apiRequest<{ status: string; message: string }>(
        `/games/${gameId}/actions`,
        {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ action: 'move', target: locationId }),
        }
    );
}

export async function attackPlayer(
    gameId: string,
    token: string,
    targetPlayerId: string
) {
    return apiRequest<{ status: string; message: string }>(
        `/games/${gameId}/actions`,
        {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ action: 'attack', target: targetPlayerId }),
        }
    );
}