
export interface GameSummary {
    id: string;
    player_count: number;
    location_count: number;
}

export interface Location {
    id: string;
    name: string;
    description: string;
    connections: string[];
}

export interface Player {
    id: string;
    name: string;
    current_location: string;
    health: number;
}

export interface GameEvent {
    type: string;
    player_id?: string;
    location?: string;
    target_id?: string;
    message: string;
    timestamp: string;
}

export interface PlayerContext {
    player: Player;
    current_location: Location;
    connected_locations: Location[];
    players_here: Player[];
}