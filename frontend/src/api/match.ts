import { api } from ".";

export type MatchStats = {
    match_id: string;
    version: number;
    game: string;
    region: string;
    competition_id: string;
    competition_type: string;
    competition_name: string;
    organizer_id: string;
    teams: {
        faction1: {
            faction_id: string;
            leader: string;
            avatar: string;
            roster: [
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
            ];
            stats: {
                winProbability: number;
                skillLevel: {
                    average: number;
                    range: {
                        min: number;
                        max: number;
                    };
                    rating: number;
                };
                substituted: boolean;
                name: string;
                type: string;
            };
            substituted: boolean;
            name: string;
            type: string;
        },
        faction2: {
            faction_id: string;
            leader: string;
            avatar: string;
            roster: [
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
                {
                    player_id: string;
                    nickname: string;
                    avatar: string;
                    membership: string;
                    game_player_id: string;
                    game_player_name: string;
                    game_skill_level: number;
                    anticheat_required: boolean;
                },
            ];
            stats: {
                winProbability: number;
                skillLevel: {
                    average: number;
                    range: {
                        min: number;
                        max: number;
                    };
                    rating: number;
                };
                substituted: boolean;
                name: string;
                type: string;
            };
            substituted: boolean;
            name: string;
            type: string;
        }
    };
    voting: {
        map: {
            entities: [];
            pick: [];
        };
        voted_entity_types: [];
        location: {
            entities: [];
            pick: [];
        };
    };
    calculate_elo: boolean;
    configured_at: number;
    started_at: number;
    finished_at: number;
    demo_url: [];
    chat_room_id: string;
    best_of: number;
    results: {
        winner: string;
        score: {};
    };
    detailed_results: [];
    status: string;
    faceit_url: string;
};

export async function getMatchStats(
    matchId: string | number
): Promise<MatchStats> {
    return await api.get<MatchStats>(`api/match/${matchId}/`).json();
}
