import { SteamStats } from "../../../api/steam";

type SteamCardContentProps = {
    stats: SteamStats;
};

export function SteamCardContent({ stats }: SteamCardContentProps) {
    return (
        <div class="content__wrapper__inside">
            <a
                class="user__link"
                href="{{ user_stats.steam.general.profileurl }}"
            >
                <div class="user__wrapper steam">
                    <img
                        class="user__avatar"
                        src="{{ user_stats.steam.general.avatarfull }}"
                        alt="Steam profile avatar"
                    />
                    <p class="user__name">{stats.general.personaname}</p>
                    <div
                        style="background-image: url('{{ user_stats.steam.general.steam_level_bg }}');"
                        class="steam_level__wrapper {{ 'tier-' ~ (user_stats.steam.general.steam_level % 100 // 10 + 1) }} {{ 'shape-' ~ (user_stats.steam.general.steam_level // 100 + 1) }}"
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
                            {stats.general.timecreated}
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
                                    {stats.playtime.playtime_total / 60} hrs
                                </div>
                            </div>
                            <div class="stat">
                                <p class="stat__name">Last 2 wks</p>
                                <div class="stat__wrapper">
                                    {stats.playtime.playtime_2weeks / 60} hrs
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
