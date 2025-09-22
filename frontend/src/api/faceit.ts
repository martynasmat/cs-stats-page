import { api } from ".";

export type FaceitStats = {
    csgo: {
        createdAt: string;
        nickname: string;
        profileURL: string;
        avatar: string;
        country: string;
        statsCSGO: {
            region: string;
            game_player_id: string;
            skill_level: number;
            faceit_elo: number;
            game_player_name: string;
            skill_level_label: string;
            regions: any;
            game_profile_id: string;
        } | null;
        memberships: any;
        lifetime: {
            hs_percentage: number;
            winrate: number;
            kd: number;
            matches: number;
            recent: any;
        };
    };
    cs2: {
        createdAt: string;
        profileURL: string;
        avatar: string;
        country: string;
        language: string;
        statsCS2: {
            region: string;
            game_player_id: string;
            skill_level: number;
            faceit_elo: number;
            game_player_name: string;
            skill_level_label: string;
            regions: any;
            game_profile_id: string;
        };
        statsCSGO: {
            region: string;
            game_player_id: string;
            skill_level: number;
            faceit_elo: number;
            game_player_name: string;
            skill_level_label: string;
            regions: any;
            game_profile_id: string;
        } | null;
        memberships: string;
        nickname: string;
        playerID: string;
        lifetime: {
            hs_percentage: number;
            clutch_1v1: number | null;
            clutch_1v2: number | null;
            winrate: number;
            kd: number;
            matches: number;
            adr: number | null;
            utility_damage: number | null;
            recent: any;
        };
    };
    recentGameStats: {
        adr: number;
        kills: number;
        deaths: number;
        assists: number;
        kd_ratio: number;
        rounds_won: number;
        win_percentage: number;
        headshot_percentage: number;
        best_map: number;
        best_map_winrate: number;
        worst_map: number;
        worst_map_winrate: number;
    };
    player_uuid: string | null;
    banned: boolean;
    active_match: {
        id: string;
    };
};

export type FaceitPeakElo = {
    peakElo: number;
    peakLevel: number;
}

export async function getFaceitStats(
    steamId: string | number
): Promise<unknown> {
    return await api
        .get(`api/faceit/profile/${steamId}/`)
        .json();
}

export async function getFaceitPeakElo(
    uuid: string | number
): Promise<unknown> {
    return await api
        .get(`api/faceit/peak-elo/${uuid}/`)
        .json();
}

