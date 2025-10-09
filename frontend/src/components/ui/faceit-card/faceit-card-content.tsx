import { FaceitStats, getFaceitPeakElo } from "../../../api/faceit";
import "./style.css";
import { useState } from "preact/hooks";
import { formatDate } from "../../../lib/utils";
import { FaceitLevel } from "../faceit-level";
import { Map } from "../map";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../spinner";

type FaceitCardContentProps = {
    stats: FaceitStats;
};

export function FaceitCardContent({ stats }: FaceitCardContentProps) {
    const { data: peak, isLoading } = useQuery({
        queryKey: ["peakFaceitElo"],
        queryFn: () => getFaceitPeakElo(stats.player_uuid!),
        enabled: !!stats.player_uuid,
    });
    const tabs = [stats.cs2 ? "CS2" : null, stats.csgo ? "CSGO" : null];
    const [activeTabIndex, setActiveTabIndex] = useState(() =>
        tabs.findIndex((tab) => tab !== null)
    );
    const filteredTabs = tabs.filter((tab) => tab !== null);
    const activeFilteredIndex =
        tabs.slice(0, activeTabIndex + 1).filter((tab) => tab !== null).length -
        1;

    return (
        <div className={"content__faceit"}>
            <div className="content__wrapper__inside">
                <a
                    className="user__link"
                    href={`${
                        stats.cs2
                            ? stats.cs2.profileURL
                            : stats.csgo?.profileURL
                    }`}
                >
                    <div className="user__wrapper faceit">
                        <img
                            className="user__avatar"
                            src={`${
                                stats.cs2
                                    ? stats.cs2.avatar
                                    : stats.csgo?.avatar
                            }`}
                            alt="Faceit profile avatar"
                        />
                        <div className="header__faceit">
                            <p className="user__name">
                                {stats.cs2
                                    ? stats.cs2.nickname
                                    : stats.csgo?.nickname ?? ""}
                            </p>
                        </div>
                    </div>
                </a>
                <div className="tab">
                    <span
                        className="tab__indicator"
                        style={{
                            width: `calc(${
                                100 / filteredTabs.length
                            }% - 0.25rem)`,
                            transform: `translateX(calc(${
                                activeFilteredIndex * 100
                            }% + ${activeFilteredIndex * 0.25}rem))`,
                        }}
                        aria-hidden="true"
                    />

                    {tabs.map(
                        (tab, idx) =>
                            tab && (
                                <button
                                    key={idx}
                                    className={
                                        activeTabIndex === idx ? "active" : ""
                                    }
                                    onClick={() => setActiveTabIndex(idx)}
                                >
                                    {tab}
                                </button>
                            )
                    )}
                </div>
                {activeTabIndex === 0 && stats.cs2 && (
                    <div className="user__stats tabcontent default" id="CS2">
                        <div className="stat__wrapper">
                            <div className="stat">
                                <p className="stat__name">Registered</p>
                                <p className="stat__value">
                                    {formatDate(stats.cs2.createdAt)}
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Country</p>
                                <img
                                    className="stat__country"
                                    src={`https://flagcdn.com/${
                                        stats.cs2!.country
                                    }.svg`}
                                    alt="Country"
                                />
                            </div>
                        </div>
                        <div className="stat__grid">
                            <div className="elo__wrapper">
                                <div className="stat__elo">
                                    <p className="stat__name">Elo</p>
                                </div>
                                <p className="stat__value">
                                    {stats.cs2.statsCS2.faceit_elo}
                                </p>
                                <FaceitLevel
                                    level={stats.cs2.statsCS2.skill_level}
                                />
                            </div>
                            {isLoading ? (
                                <Spinner center />
                            ) : (
                                peak && (
                                    <div className="elo__wrapper">
                                        <div className="stat__elo">
                                            <p className="stat__name">
                                                Peak elo
                                            </p>
                                        </div>
                                        <p className="stat__value">
                                            {peak?.peakElo}
                                        </p>
                                        <FaceitLevel level={peak.peakLevel} />
                                    </div>
                                )
                            )}
                            <div className="stat">
                                <p className="stat__name">Hs%</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.hs_percentage}%
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Clutch 1v1</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.clutch_1v1}%
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Winrate</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.winrate}%
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Kd</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.kd}
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Clutch 1v2</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.clutch_1v2}%
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Matches</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.matches}
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Adr</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.adr}
                                </p>
                            </div>
                            <div className="stat">
                                <p className="stat__name">Util dmg</p>
                                <p className="stat__value">
                                    {stats.cs2.lifetime?.utility_damage}
                                </p>
                            </div>
                        </div>
                        <div className="stat__wrapper">
                            { stats.cs2.last_game != null && (
                            <div className="stat">
                                <p className="stat__name">Last match</p>
                                <time className="stat__value">
                                    {formatDate(stats.cs2.last_game)}
                                </time>
                            </div>
                                )}
                            <div className="stat">
                                <p className="stat__name">Recent</p>
                                <div className="stat__recent-games">
                                    {stats.cs2.lifetime?.recent.map((r, i) => (
                                        <span
                                            key={i}
                                            className={`stat__recent-games--${
                                                r === "W" ? "win" : "loss"
                                            }`}
                                        >
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        { stats.recentGameStats != null && (
                        <div className="divider"></div>
                        )}
                        { stats.recentGameStats != null && (
                        <div className="faceit__wrapper__recent">
                            <p className="stat__name">LAST 50 GAMES</p>
                            <div className="stat__wrapper__recent">
                                <div className="stat">
                                    <p className="stat__name">ADR</p>
                                    <p className="stat__value">
                                        {stats.recentGameStats.adr}
                                    </p>
                                </div>
                                <div className="stat">
                                    <p className="stat__name">Kills</p>
                                    <p className="stat__value">
                                        {stats.recentGameStats.kills}
                                    </p>
                                </div>
                                <div className="stat">
                                    <p className="stat__name">Deaths</p>
                                    <p className="stat__value">
                                        {stats.recentGameStats.deaths}
                                    </p>
                                </div>
                                <div className="stat">
                                    <p className="stat__name">Assists</p>
                                    <p className="stat__value">
                                        {stats.recentGameStats.assists}
                                    </p>
                                </div>
                                <div className="stat">
                                    <p className="stat__name">K/D</p>
                                    <p className="stat__value">
                                        {stats.recentGameStats.kd_ratio}
                                    </p>
                                </div>
                                <div className="stat">
                                    <p className="stat__name">Win %</p>
                                    <p className="stat__value">
                                        {stats.recentGameStats.win_percentage}%
                                    </p>
                                </div>
                                <div className="stat stat__rounds-won">
                                    <p className="stat__name">RNDS won</p>
                                    <p className="stat__value">
                                        {stats.recentGameStats.rounds_won}
                                    </p>
                                </div>
                                <div className="stat stat__best-map">
                                    <p className="stat__name">best map</p>
                                    <div className="stat__value__wrapper stat__map">
                                        <Map
                                            map={stats.recentGameStats.best_map}
                                        />
                                        <p className="stat__value">
                                            {
                                                stats.recentGameStats
                                                    .best_map_winrate
                                            }
                                            %
                                        </p>
                                    </div>
                                </div>
                                <div className="stat stat__worst-map">
                                    <p className="stat__name">worst map</p>
                                    <div className="stat__value__wrapper stat__map">
                                        <Map
                                            map={
                                                stats.recentGameStats.worst_map
                                            }
                                        />
                                        <p className="stat__value">
                                            {
                                                stats.recentGameStats
                                                    .worst_map_winrate
                                            }
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                )}
                {activeTabIndex === 1 && stats.csgo && (
                    <div className="user__stats tabcontent" id="CSGO">
                        <div className="stat__wrapper">
                            <div className="stat">
                                <p className="stat__name">Registered</p>
                                <p className="stat__value">
                                    {formatDate(stats.csgo.createdAt)}
                                </p>
                            </div>

                            <div className="stat">
                                <p className="stat__name">Country</p>
                                <img
                                    className="stat__country"
                                    src={`https://flagcdn.com/${stats.csgo.country}.svg`}
                                    alt="Country"
                                />
                            </div>
                        </div>

                        <div className="stat__grid">
                            {stats.csgo.statsCSGO && (
                                <div className="stat">
                                    <div className="elo__wrapper">
                                        <p className="stat__name">ELO</p>
                                        <p className="stat__value">
                                            {stats.csgo.statsCSGO.faceit_elo}
                                        </p>
                                        <FaceitLevel
                                            level={
                                                stats.csgo.statsCSGO.skill_level
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {stats.csgo.lifetime && (
                                <>
                                    <div className="stat">
                                        <p className="stat__name">HS%</p>
                                        <p className="stat__value">
                                            {stats.csgo.lifetime.hs_percentage}%
                                        </p>
                                    </div>
                                    <div className="stat">
                                        <p className="stat__name">WINRATE</p>
                                        <p className="stat__value">
                                            {stats.csgo.lifetime.winrate}%
                                        </p>
                                    </div>
                                    <div className="stat">
                                        <p className="stat__name">KD</p>
                                        <p className="stat__value">
                                            {stats.csgo.lifetime.kd}
                                        </p>
                                    </div>
                                    <div className="stat">
                                        <p className="stat__name">matches</p>
                                        <p className="stat__value">
                                            {stats.csgo.lifetime.matches}
                                        </p>
                                    </div>
                                    <div className="stat">
                                        <p className="stat__name">LAST GAMES</p>
                                        <div className="stat__recent-games">
                                            {stats.csgo.lifetime.recent.map(
                                                (r: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className={`stat__recent-games--${
                                                            r === "W"
                                                                ? "win"
                                                                : "loss"
                                                        }`}
                                                    >
                                                        {r}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
