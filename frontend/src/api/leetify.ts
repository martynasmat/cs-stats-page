import { api } from ".";

export async function getLeetifyStats(
    steamId: string | number
): Promise<unknown> {
    const data = await api.get(`api/leetify/profile/${steamId}/`);

    return data;
}
