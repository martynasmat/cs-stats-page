import { useFetch } from "../../../hooks/use-fetch";
import { getSteamStats } from "../../../api/steam";
import { CardHeader } from "../card-header";
import { Spinner } from "../spinner";
import steamLogo from "../../../assets/steam_logo.webp";

type SteamCardProps = {
    steamId: string;
};

export function SteamCard({ steamId }: SteamCardProps) {
    const isLoading = true;
    // const { data: steamStats, error } = useFetch({
    //     fn: () => getSteamStats(steamId),
    // });

    return (
        <div>
            <CardHeader
                image={
                    <img
                        style={{
                            objectFit: "cover",
                            width: "80%",
                            height: "auto",
                        }}
                        alt="Steam logo"
                        src={steamLogo}
                    />
                }
            />
            {isLoading ? <Spinner color="red" center /> : <p>Steam card</p>}
        </div>
    );
}
