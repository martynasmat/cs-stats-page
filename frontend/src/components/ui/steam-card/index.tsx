import { getSteamStats } from "../../../api/steam";
import { CardHeader } from "../card-header";
import { Spinner } from "../spinner";
import steamLogo from "../../../assets/steam_logo.webp";
import { ProfileNotFound } from "../profile-not-found";
import { SteamCardContent } from "./steam-card-content";
import { useQuery } from "@tanstack/react-query";

type SteamCardProps = {
    steamId: string;
};

export function SteamCard({ steamId }: SteamCardProps) {
    const {
        data: stats,
        error,
        isLoading,
    } = useQuery({
        queryKey: [`steamStats-${steamId}`],
        queryFn: () => getSteamStats(steamId),
    });

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
                banned={stats?.banned}
            />
            {isLoading ? (
                <Spinner center />
            ) : error || !stats ? (
                <ProfileNotFound />
            ) : (
                <SteamCardContent stats={stats} />
            )}
        </div>
    );
}
