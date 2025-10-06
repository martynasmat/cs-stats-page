import { useRoute } from "preact-iso";
import ReactGA from "react-ga4";
import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {getMatchStats} from "../../api/match";
import {MiniProfile} from "../../components/ui/mini-profile";
import styles from "./matchroom.module.css"

export default function Matchroom() {
    const location = useRoute();
    const matchId = location.params.id;
    const TRACKING_ID = "G-Y3C1F7ZBQ1";
    console.log("matchId", matchId);
    const {
        data: stats,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["matchStats"],
        queryFn: () => getMatchStats(matchId),
    });

    console.log(stats?.teams?.faction1.roster);

    useEffect(() => {
        ReactGA.initialize(TRACKING_ID);
        ReactGA.send({ hitType: "pageview", page: `/match/${matchId}`, title: "Match room" });
    })

    return (
        <main className={styles.matchroom}>
            <div className={styles.faction}>
                {(stats?.teams?.faction1.roster ?? []).map((player) => (
                    <MiniProfile steamId={player.game_player_id} />
                ))}
            </div>
            <div className={styles.match_stats}></div>
            <div className={styles.faction}>
                {stats?.teams?.faction2.roster.map((player) => (
                    <MiniProfile steamId={player.game_player_id} />
                ))}
            </div>
        </main>
    );
}
