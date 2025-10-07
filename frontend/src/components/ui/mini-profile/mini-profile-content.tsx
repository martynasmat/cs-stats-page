import { Spinner } from "../spinner";
import { FaceitStats, getFaceitPeakElo } from "../../../api/faceit";
import { useQuery } from "@tanstack/react-query";
import styles from "./styles.module.css"
import { FaceitLevel } from "../faceit-level";
import star from "../../../assets/star.svg"

type MiniProfileContentProps = {
    stats: FaceitStats;
    showStar?: boolean;
};

export function MiniProfileContent({ stats, showStar }: MiniProfileContentProps) {
    const { data: peak, isLoading } = useQuery({
        queryKey: [`peakFaceitElo-${stats.cs2?.statsCS2?.game_player_id}`],
        queryFn: () => getFaceitPeakElo(stats.player_uuid!),
        enabled: !!stats.player_uuid,
    });

    return (
        <a className={`${styles.mini_profile__wrapper} ${showStar ? styles.star_player : ""}`} href={`/profiles/${stats.cs2?.statsCS2?.game_player_id}`}>
            {showStar && (
                <img src={star} alt={"Star icon"} className={styles.star__icon}/>
            )}
            <div className={styles.player__info}>
                <img className={styles.user__avatar} src={stats.cs2?.avatar}  alt={"Player avatar"}/>
                <p className={styles.player__name}>{stats.cs2?.nickname}</p>
            </div>
            <hr className={styles.matchroom__divider} />
            <div className={styles.matchroom__player__stats}>
                <div className={styles.matchroom__elo__wrapper}>
                    <div className={styles.matchroom__stat__elo}>
                        <p className={styles.matchroom__stat__name}>Elo</p>
                    </div>
                    <p className={styles.matchroom__stat__value}>
                        {stats.cs2?.statsCS2.faceit_elo}
                    </p>
                    <FaceitLevel
                        level={stats.cs2?.statsCS2.skill_level}
                    />
                </div>
                {isLoading ? (
                    <Spinner center />
                ) : (
                    peak && (
                        <div className={`${styles.matchroom__elo__wrapper} ${styles.current_elo}`}>
                            <div className={styles.matchroom__stat__elo}>
                                <p className={styles.matchroom__stat__name}>
                                    Peak elo
                                </p>
                            </div>
                            <p className={styles.matchroom__stat__value}>
                                {peak?.peakElo}
                            </p>
                            <FaceitLevel level={peak.peakLevel}/>
                        </div>
                    )
                )}
                <div className={styles.average_kills}>
                    <p className={styles.matchroom__stat__name}>Kills</p>
                    <p className={styles.matchroom__stat__value}>
                        {stats.recentGameStats.kills}
                    </p>
                </div>
                <div className={styles.winrate}>
                    <p className={styles.matchroom__stat__name}>Win %</p>
                    <p className={styles.matchroom__stat__value}>
                        {stats.recentGameStats.win_percentage}%
                    </p>
                </div>
            </div>
        </a>
    );
}
