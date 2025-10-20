// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listGames, createGame } from '../api/games';
import type { GameSummary } from '../api/types';

export function Home() {
    const [games, setGames] = useState<GameSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadGames();
    }, []);

    async function loadGames() {
        try {
            const data = await listGames();
            setGames(data.games);
        } catch (error) {
            console.error('Failed to load games:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateGame() {
        try {
            const { game_id } = await createGame();
            navigate(`/games/${game_id}/join`);
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Active Games</h1>
            <button onClick={handleCreateGame}>Create New Game</button>

            <div className="game-list">
                {games.map(game => (
                    <div key={game.id} onClick={() => navigate(`/games/${game.id}/join`)}>
                        <h3>Game {game.id}</h3>
                        <p>{game.player_count} players</p>
                    </div>
                ))}
            </div>
        </div>
    );
}