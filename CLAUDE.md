# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web UI for a multiplayer location-based game. Players join games, move between locations, interact with other players, and receive real-time game events via Server-Sent Events (SSE).

## Development Commands

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Lint code:**
```bash
npm run lint
```

**Preview production build:**
```bash
npm run preview
```

## Architecture

### Tech Stack
- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Routing:** React Router DOM v7
- **Real-time Events:** Server-Sent Events via `@microsoft/fetch-event-source`
- **Styling:** Tailwind CSS (via classes in components)

### API Communication

The app communicates with a backend game API (default: `http://localhost:8080`). The API base URL is configurable via the `VITE_API_URL` environment variable.

**Key API patterns:**
- **Authentication:** JWT tokens stored in localStorage, passed via `Authorization: Bearer <token>` headers
- **Real-time Updates:** SSE endpoint at `/games/{gameId}/events` streams game events
- **REST Endpoints:** Standard REST API for game/player operations (see `src/api/`)

### Application Flow

1. **Home Page** (`/`) - Lists active games, allows creating new games
2. **Game Lobby** (`/games/:gameId/join`) - Player enters name to join a game, receives JWT token
3. **Game Play** (`/games/:gameId/play`) - Protected route showing current location, available actions, other players, and real-time event feed

### State Management

**Authentication State** (`useAuth` hook):
- Stored in localStorage under key `game_auth`
- Contains: `gameId`, `playerId`, `token`
- Persists across page refreshes

**Game Context:**
- Fetched on-demand from `/games/{gameId}/players/me`
- Returns: current player, location, connected locations, players at location
- Refetched after player actions (move, attack)

**Event Stream** (`useGameEvents` hook):
- Establishes SSE connection when component mounts
- Accumulates events in component state
- Automatically reconnects on connection loss

### Directory Structure

```
src/
├── api/           # API client functions
│   ├── client.ts  # Base API request wrapper with error handling
│   ├── games.ts   # Game-related endpoints (list, create, get)
│   ├── players.ts # Player actions (join, move, attack, get context)
│   └── types.ts   # TypeScript interfaces for API responses
├── components/    # Reusable React components
├── hooks/         # Custom React hooks
│   ├── useAuth.ts       # Authentication state management
│   ├── useGameEvents.ts # SSE connection for real-time events
│   └── useGameState.ts  # (Currently empty/unused)
├── pages/         # Route components
│   ├── Home.tsx       # Game list and creation
│   ├── GameLobby.tsx  # Join game form
│   └── GamePlay.tsx   # Main gameplay interface
├── store/         # Global state (currently minimal/unused)
└── utils/         # Utility functions (currently minimal/unused)
```

### Protected Routes

The `/games/:gameId/play` route uses a `ProtectedRoute` wrapper that checks `useAuth().isAuthenticated`. Unauthenticated users are redirected to home.

### Error Handling

API errors throw `APIError` instances with HTTP status codes. Components typically catch errors and display them via local state or console logging.

## Important Implementation Notes

- **SSE Connection Management:** The `useGameEvents` hook creates a new SSE connection on mount and aborts it on unmount. Ensure the abort controller is properly cleaned up to avoid memory leaks.

- **Context Refresh:** After player actions (move, attack), manually call `loadContext()` to refresh the player's view. The SSE event stream provides real-time updates, but the context API gives the full current state.

- **Token Storage:** Authentication tokens are stored in localStorage. This is acceptable for this game but note it's vulnerable to XSS. For production apps, consider httpOnly cookies.

- **Environment Variables:** API base URL defaults to `http://localhost:8080`. Override with `VITE_API_URL` environment variable (must be set at build time, not runtime).

- **Empty Files:** Some files (`src/store/gameStore.ts`, `src/hooks/useGameState.ts`, `src/utils/storage.ts`) are currently nearly empty placeholders.
