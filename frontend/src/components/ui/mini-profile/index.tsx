import { CardHeader } from "../card-header";
import { Spinner } from "../spinner";
import { ProfileNotFound } from "../profile-not-found";
import { getFaceitStats } from "../../../api/faceit";
import { useQuery } from "@tanstack/react-query";
import { MiniProfileContent } from "./mini-profile-content"
import {useEffect} from "react";

type MiniProfileProps = {
    steamId: string;
    teamKey?: "faction1" | "faction2";
    onStatsLoaded?: (teamKey: "faction1" | "faction2", playerId: string, score: number) => void;
    showStar?: boolean;
};

export function MiniProfile({ steamId, teamKey, onStatsLoaded, showStar }: MiniProfileProps) {
    const {
        data: stats,
        error,
        isLoading,
    } = useQuery({
        queryKey: [`faceitStatsMatch-${steamId}`],
        staleTime: 180000,
        queryFn: () => getFaceitStats(steamId),
    });

    useEffect(() => {
        if (!stats || !teamKey || !onStatsLoaded) {
            return;
        }

        const recentGameStats = stats.recentGameStats;
        const score =
                0.35 * (Math.min(recentGameStats.adr, 110) / 110)
                + 0.35 * (recentGameStats.kd_ratio)
                + 0.1 * (Math.min(recentGameStats.headshot_percentage, 80) / 80)
                + 0.2 * (recentGameStats.win_percentage / 100)

        onStatsLoaded(teamKey, steamId, score);
    }, [onStatsLoaded, stats, steamId, teamKey]);

    return (
        <div>
            {isLoading ? (
                <Spinner center />
            ) : error || !stats ? (
                <ProfileNotFound />
            ) : (
                <MiniProfileContent stats={stats} showStar={showStar} />
            )}
        </div>
    );
}
