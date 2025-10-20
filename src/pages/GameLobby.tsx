// src/pages/GameLobby.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinGame } from '../api/players';
import { useAuth } from '../hooks/useAuth';

export function GameLobby() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleJoin(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) {
            setError('Please enter a name');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { player, token } = await joinGame(gameId!, name);

            // Save auth info
            login(gameId!, player.id, token);

            // Navigate to game
            navigate(`/games/${gameId}/play`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to join game');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-2">Join Game</h1>
                <p className="text-gray-600 mb-6">Game ID: <code className="bg-gray-100 px-2 py-1 rounded">{gameId}</code></p>

                <form onSubmit={handleJoin}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Joining...' : 'Join Game'}
                    </button>
                </form>

                <button
                    onClick={() => navigate('/')}
                    className="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm"
                >
                    ← Back to games list
                </button>
            </div>
        </div>
    );
}