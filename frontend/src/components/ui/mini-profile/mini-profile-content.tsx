import { CardHeader } from "../card-header";
import { Spinner } from "../spinner";
import { ProfileNotFound } from "../profile-not-found";
import {FaceitStats, getFaceitPeakElo} from "../../../api/faceit";
import { useQuery } from "@tanstack/react-query";
import styles from "./styles.module.css"
import {FaceitLevel} from "../faceit-level";

type MiniProfileContentProps = {
    stats: FaceitStats;
};

export function MiniProfileContent({ stats }: MiniProfileContentProps) {
    const { data: peak, isLoading } = useQuery({
        queryKey: [`peakFaceitElo-${stats.cs2?.statsCS2?.game_player_id}`],
        queryFn: () => getFaceitPeakElo(stats.player_uuid!),
        enabled: !!stats.player_uuid,
    });

    return (
        <a className={styles.mini_profile__wrapper} href={`/profiles/${stats.cs2?.statsCS2?.game_player_id}`}>
            <div className={styles.player__info}>
                <img className={styles.user__avatar} src={stats.cs2?.avatar}  alt={"Player avatar"}/>
                <p className={styles.player__name}>{stats.cs2?.nickname}</p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.player__stats}>
                <div className={styles.current__level}>
                    <div className={styles.elo__wrapper}>
                        <div className={styles.stat__elo}>
                            <p className={styles.stat__name}>Elo</p>
                        </div>
                        <p className={styles.stat__value}>
                            {stats.cs2?.statsCS2.faceit_elo}
                        </p>
                        <FaceitLevel
                            level={stats.cs2?.statsCS2.skill_level}
                        />
                    </div>
                </div>
                <div className={styles.peak__level}>
                    {isLoading ? (
                        <Spinner center />
                    ) : (
                        peak && (
                            <div className={styles.elo__wrapper}>
                                <div className={styles.stat__elo}>
                                    <p className={styles.stat__name}>
                                        Peak elo
                                    </p>
                                </div>
                                <p className={styles.stat__value}>
                                    {peak?.peakElo}
                                </p>
                                <FaceitLevel level={peak.peakLevel} />
                            </div>
                        )
                    )}
                </div>
                <div className={styles.average_kills}>
                    <p className={styles.stat__name}>Kills</p>
                    <p className={styles.stat__value}>
                        {stats.recentGameStats.kills}
                    </p>
                </div>
                <div className={styles.winrate}>
                    <p className={styles.stat__name}>Win %</p>
                    <p className={styles.stat__value}>
                        {stats.recentGameStats.win_percentage}%
                    </p>
                </div>
            </div>
        </a>
    );
}
