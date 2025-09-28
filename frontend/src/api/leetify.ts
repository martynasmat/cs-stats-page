import {api} from ".";

export type LeetifyStats = {
    avatar: string;
    aim: number;
    preaim: number;
    matches: number;
    kd: number;
    opening: number;
    avg_he: number;
    rating: number;
    position: number;
    banned_mates: number | null;
    party: number | null;
    reaction_time: number;
    winrate: number;
    utility: number;
    clutch: number;
    max_rating: number;
    nickname: string;
    leetify_url: string;
    rating_tier: number | null;
};

export async function getLeetifyStats(
    steamId: string | number
): Promise<unknown> {
    return await api
        .get<LeetifyStats>(`api/leetify/profile/${steamId}/`)
        .json();
}
