// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { GameLobby } from './pages/GameLobby';
import { GamePlay } from './pages/GamePlay';
import { useAuth } from './hooks/useAuth';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games/:gameId/join" element={<GameLobby />} />
                    <Route path="/games/:gameId/play" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

// Protect the gameplay route - requires authentication
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default App;