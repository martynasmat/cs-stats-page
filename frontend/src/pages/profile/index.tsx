import { useRoute } from "preact-iso";
import { useFetch } from "../../hooks/use-fetch";
import { getSteamStats } from "../../api/steam";
import { getLeetifyStats } from "../../api/leetify";
import { getFaceitStats } from "../../api/faceit";

export default function Profile() {
    const location = useRoute();
    const steamId = location.params.id;
    const { data: steamStats, error } = useFetch({
        fn: () => getSteamStats(steamId),
    });
    const { data: leetifyStats } = useFetch({
        fn: () => getLeetifyStats(steamId),
    });
    const { data: faceitStats } = useFetch({
        fn: () => getFaceitStats(steamId),
    });

    return steamId;
}
