import { useLocation, useRoute } from "preact-iso";
import { getSteamId } from "../../api/steam";
import { useFetch } from "../../hooks/use-fetch";

export default function Id() {
    const { route } = useLocation();
    const { params } = useRoute();
    const { data } = useFetch({
        fn: () => getSteamId(params.vanity),
    });

    if (!data) return <>Profile doesn't exist</>;

    route(`/profiles/${data}`, true);
}
