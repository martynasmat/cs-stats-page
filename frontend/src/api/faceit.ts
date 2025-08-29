import { api } from ".";

export async function getFaceitStats(
    steamId: string | number
): Promise<unknown> {
    const data = await api.get(`api/faceit/profile/${steamId}/`);

    return data;
}
