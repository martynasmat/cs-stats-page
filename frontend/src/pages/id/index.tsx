import { useLocation, useRoute } from "preact-iso";
import { getSteamId } from "../../api/steam";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../components/ui/spinner";

export default function Id() {
    const { route } = useLocation();
    const { params } = useRoute();
    const { data, isLoading } = useQuery({
        queryKey: ["steamId"],
        queryFn: () => getSteamId(params.vanity),
    });

    if (isLoading)
        return (
            <div
                style={{
                    height: "100dvh",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Spinner size={50} center />
            </div>
        );

    route(`/profiles/${data}`, true);
}
