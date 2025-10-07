import { CardHeader } from "../card-header";
import { Spinner } from "../spinner";
import { ProfileNotFound } from "../profile-not-found";
import { getFaceitStats } from "../../../api/faceit";
import { useQuery } from "@tanstack/react-query";
import { MiniProfileContent } from "./mini-profile-content"

type MiniProfileProps = {
    steamId: string;
};

export function MiniProfile({ steamId }: MiniProfileProps) {
    const {
        data: stats,
        error,
        isLoading,
    } = useQuery({
        queryKey: [`faceitStatsMatch-${steamId}`],
        staleTime: 180000,
        queryFn: () => getFaceitStats(steamId),
    });

    return (
        <div>
            {isLoading ? (
                <Spinner center />
            ) : error || !stats ? (
                <ProfileNotFound />
            ) : (
                <MiniProfileContent stats={stats} />
            )}
        </div>
    );
}
