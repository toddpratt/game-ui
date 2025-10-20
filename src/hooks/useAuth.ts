// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface AuthState {
    gameId: string | null;
    playerId: string | null;
    token: string | null;
}

const STORAGE_KEY = 'game_auth';

export function useAuth() {
    const [auth, setAuth] = useState<AuthState>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : { gameId: null, playerId: null, token: null };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    }, [auth]);

    const login = (gameId: string, playerId: string, token: string) => {
        setAuth({ gameId, playerId, token });
    };

    const logout = () => {
        setAuth({ gameId: null, playerId: null, token: null });
        localStorage.removeItem(STORAGE_KEY);
    };

    return { auth, login, logout, isAuthenticated: !!auth.token };
}