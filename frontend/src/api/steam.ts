import { api } from ".";

export type SteamStats = {
    banned: boolean;
    friends: {
        count: number;
    } | null;
    general: {
        avatar: string;
        avatarfull: string;
        avatarhash: string;
        avatarmedium: string;
        commentpermission: number;
        communityvisibilitystate: number;
        lastlogoff: number;
        loccountrycode?: string;
        personaname: string;
        personastate: number;
        personastateflags: number;
        primaryclanid: string;
        profilestate: number;
        profileurl: string;
        steam_level: number;
        steam_level_bg: string;
        steam_xp: number;
        steamid: string;
        timecreated: number;
    };
    playtime: {
        games_played: number;
        playtime_2weeks: number;
        playtime_total: number;
    } | null;
};

export async function getSteamId(vanityName: string): Promise<string | null> {
    const data = await api
        .get<{ id: string | null }>(`api/steam/resolve-id/${vanityName}/`)
        .json();

    return data.id;
}

export async function checkLink(
    profileLink: string
): Promise<{ id: string | null }> {
    const data = await api
        .post<{ id: string | null }>("api/steam/resolve-url/", {
            json: { profileLink },
        })
        .json();

    return data;
}

export async function getSteamStats(
    steamId: string | number
): Promise<SteamStats> {
    return await api
        .get<SteamStats>(`api/steam/profile/${steamId}/`)
        .json();
}
