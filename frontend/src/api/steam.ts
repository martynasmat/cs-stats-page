import { api } from ".";

export async function getSteamId(vanityName: string): Promise<string> {
    const data = await api
        .get<{ id: string }>(`api/steam/resolve-id/${vanityName}/`)
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
): Promise<unknown> {
    const data = await api.get<unknown>(`api/steam/profile/${steamId}/`);

    return data;
}
