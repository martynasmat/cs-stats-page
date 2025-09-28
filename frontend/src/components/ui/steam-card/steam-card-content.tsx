import { SteamStats } from "../../../api/steam";
import { formatDate, round } from "../../../lib/utils";
import styles from "./steam-card.module.css";

type SteamCardContentProps = {
    stats: SteamStats;
};

export function SteamCardContent({ stats }: SteamCardContentProps) {
    const tier = Math.trunc((stats.general.steam_level % 100) / 10) + 1;

    return (
        <div class="content__wrapper__inside">
            <a class="user__link" href={stats.general.profileurl}>
                <div class="user__wrapper steam">
                    <img
                        class="user__avatar"
                        alt="Steam profile avatar"
                        src={stats.general.avatarfull}
                    />
                    <p class="user__name">{stats.general.personaname}</p>
                    <div
                        style={`background-image: url('${stats.general.steam_level_bg}');`}
                        class={`${styles.steam_level__wrapper} ${
                            styles[`tier-${tier}`]
                        }`}
                    >
                        <p>{stats.general.steam_level}</p>
                    </div>
                </div>
            </a>
            <div class="user__stats">
                <div class="stat__wrapper">
                    <div class="stat">
                        <p class="stat__name">Registered</p>
                        <time class="stat__value">
                            {formatDate(stats.general.timecreated * 1000)}
                        </time>
                    </div>
                    <div class="stat">
                        <p class="stat__name">Country</p>
                        <img
                            class="stat__country"
                            src={`https://flagcdn.com/${
                                stats.general.loccountrycode?.toLowerCase() ??
                                "un"
                            }.svg`}
                            alt="Country"
                        />
                    </div>
                </div>
                <div class="stat__grid">
                    {stats.friends && (
                        <div class="stat">
                            <p class="stat__name">Friends</p>
                            <div class="stat__wrapper">
                                {stats.friends.count}
                            </div>
                        </div>
                    )}
                    <div class="stat">
                        <p class="stat__name">XP level</p>
                        <div class="stat__wrapper">
                            {stats.general.steam_xp}
                        </div>
                    </div>
                    {stats.playtime && (
                        <>
                            <div class="stat">
                                <p class="stat__name">Games</p>
                                <div class="stat__wrapper">
                                    {stats.playtime.games_played}
                                </div>
                            </div>
                            <div class="stat">
                                <p class="stat__name">CS played</p>
                                <div class="stat__wrapper">
                                    {round(
                                        stats.playtime.playtime_total / 60,
                                        2
                                    )}{" "}
                                    hrs
                                </div>
                            </div>
                            <div class="stat">
                                <p class="stat__name">Last 2 wks</p>
                                <div class="stat__wrapper">
                                    {round(
                                        stats.playtime.playtime_2weeks / 60,
                                        2
                                    )}{" "}
                                    hrs
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
