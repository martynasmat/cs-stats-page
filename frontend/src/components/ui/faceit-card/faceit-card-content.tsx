import {FaceitPeakElo, FaceitStats} from "../../../api/faceit";
import level1 from '../../../assets/faceit-levels/1.png';
import level2 from '../../../assets/faceit-levels/2.png';
import level3 from '../../../assets/faceit-levels/3.png';
import level4 from '../../../assets/faceit-levels/4.png';
import level5 from '../../../assets/faceit-levels/5.png';
import level6 from '../../../assets/faceit-levels/6.png';
import level7 from '../../../assets/faceit-levels/7.png';
import level8 from '../../../assets/faceit-levels/8.png';
import level9 from '../../../assets/faceit-levels/9.png';
import level10 from '../../../assets/faceit-levels/10.png';
import de_ancient from '../../../assets/maps/de_ancient.webp';
import de_dust2 from '../../../assets/maps/de_dust2.webp';
import de_inferno from '../../../assets/maps/de_inferno.webp';
import de_mirage from '../../../assets/maps/de_mirage.webp';
import de_nuke from '../../../assets/maps/de_nuke.webp';
import de_overpass from '../../../assets/maps/de_overpass.webp';
import de_train from '../../../assets/maps/de_train.webp';
import de_vertigo from '../../../assets/maps/de_vertigo.webp';
import "./style.css"

type FaceitCardContentProps = {
    stats: FaceitStats;
    peak: FaceitPeakElo
};

const levels: Record<number, string> = {
    1: level1,
    2: level2,
    3: level3,
    4: level4,
    5: level5,
    6: level6,
    7: level7,
    8: level8,
    9: level9,
    10: level10,
};

const maps: Record<string, string> = {
    "de_ancient": de_ancient,
    "de_dust2": de_dust2,
    "de_inferno": de_inferno,
    "de_mirage": de_mirage,
    "de_nuke": de_nuke,
    "de_overpass": de_overpass,
    "de_train": de_train,
    "de_vertigo": de_vertigo,
};

export function FaceitCardContent({ stats }: FaceitCardContentProps) {
    return (
        <div className="content__faceit">
            <div className="content__wrapper__inside">
                <a
                    className="user__link"
                    href={`${'error' in stats.cs2 ? stats.csgo.profileURL : stats.cs2.profileURL}`}
                >
                    <div className="user__wrapper faceit">
                        <img
                            className="user__avatar"
                            src={`${'error' in stats.cs2 ? stats.csgo.avatar : stats.cs2.avatar}`}
                            alt="Faceit profile avatar"
                        />
                        <div className="header__faceit">
                            <p className="user__name">
                                {
                                    'error' in stats.cs2 ? stats.cs2.nickname : stats.csgo.nickname
                                }
                            </p>
                        </div>
                    </div>
                </a>
                <div className="tab">
                    <button
                        className={`tablinks
                            ${'error' in stats.cs2 ? 'hidden' : 'active'}
                        onClick="openTab(event, 'CS2')`}
                    >
                        CS2
                    </button>
                    <button
                        className={`tablinks
                            ${'error' in stats.csgo ? 'hidden' : ''}
                            ${'error' in stats.cs2 ? 'active' : ''}
                        onClick="openTab(event, 'CSGO')`}
                    >
                        CSGO
                    </button>

                    <span className="tab__indicator" aria-hidden="true"></span>
                </div>
                {!('error' in stats.cs2) && (
                <div className="user__stats tabcontent default" id="CS2">
                    <div className="stat__wrapper">
                        <div className="stat">
                            <p className="stat__name">Registered</p>
                            <p className="stat__value">
                                {new Date(stats.cs2.createdAt).toLocaleString(undefined, {dateStyle: 'medium'})}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Country</p>
                            <img
                                className="stat__country"
                                src={`https://flagcdn.com/${ stats.cs2.country }.svg`}
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
                            <img
                                className="stat__fc-level"
                                src={levels[stats.cs2.statsCS2.skill_level]}
                                alt="Faceit Level"
                            />
                        </div>
                        {/*{% if 'error' not in user_stats.faceit.peak %}*/}
                        {/*<div className="elo__wrapper">*/}
                        {/*    <div className="stat__elo">*/}
                        {/*        <p className="stat__name">peak elo</p>*/}
                        {/*    </div>*/}
                        {/*    <p className="stat__value">*/}
                        {/*        {{user_stats.faceit.peak.peak_elo}}*/}
                        {/*    </p>*/}
                        {/*    <img*/}
                        {/*        className="stat__fc-level"*/}
                        {/*        src="{{*/}
                        {/*                url_for('static', filename='images/faceit/' ~*/}
                        {/*                user_stats.faceit.peak.peak_level ~ '.png')*/}
                        {/*            }}"*/}
                        {/*        alt="Faceit Level"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*{% endif %}*/}
                        <div className="stat">
                            <p className="stat__name">Hs%</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.hs_percentage}%
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Clutch 1v1</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.clutch_1v1}%
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Winrate</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.winrate}%
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Kd</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.kd}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Clutch 1v2</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.clutch_1v2}%
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Matches</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.matches}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Adr</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.adr}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Util dmg</p>
                            <p className="stat__value">
                                {stats.cs2.lifetime.utility_damage}
                            </p>
                        </div>
                    </div>
                    <div className="stat__wrapper">
                        <div className="stat">
                            <p className="stat__name">Last match</p>
                            <time className="stat__value">{new Date(stats.cs2.last_game).toLocaleString(undefined, {dateStyle: 'medium'})}</time>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Recent</p>
                            <div className="stat__recent-games">
                                {stats.cs2.lifetime.recent.map((r, i) => (
                                    <span
                                        key={i}
                                        className={`stat__recent-games--${r === 'W' ? 'win' : 'loss'}`}
                                    >
                                  {r}
                                </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="divider"></div>
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
                                    <img
                                        className="map"
                                        src={maps[stats.recentGameStats.best_map]}
                                        alt="CS2 map banner"
                                    />
                                    <p className="stat__value">
                                        {stats.recentGameStats.best_map_winrate}%
                                    </p>
                                </div>
                            </div>
                            <div className="stat stat__worst-map">
                                <p className="stat__name">worst map</p>
                                <div className="stat__value__wrapper stat__map">
                                    <img
                                        className="map"
                                        src={maps[stats.recentGameStats.worst_map]}
                                        alt="CS2 map picture"
                                    />
                                    <p className="stat__value">
                                        {stats.recentGameStats.worst_map_winrate}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )} {/* CSGO tab (render only if there is NO error in stats.csgo) */}
                {!('error' in stats.csgo) ? (
                    <div
                        className="user__stats tabcontent"
                        id="CSGO"
                        // mirrors your original logic: hide when NO error in faceit.cs2
                        style={{ display: !('error' in (stats.cs2 ?? {})) ? 'none' : undefined }}
                    >
                        <div className="stat__wrapper">
                            <div className="stat">
                                <p className="stat__name">Registered</p>
                                <p className="stat__value">{stats.csgo.createdAt}</p>
                            </div>

                            <div className="stat">
                                <p className="stat__name">Country</p>
                                <img
                                    className="stat__country"
                                    src={`https://flagcdn.com/${stats.csgo?.country}.svg`}
                                    alt="Country"
                                />
                            </div>
                        </div>

                        <div className="stat__grid">
                            <div className="stat">
                                <div className="elo__wrapper">
                                    <p className="stat__name">ELO</p>
                                    <p className="stat__value">{stats.csgo.statsCSGO.faceit_elo}</p>
                                    <img
                                        className="stat__fc-level"
                                        src={`/images/faceit/${stats.csgo.statsCSGO.skill_level}.png`}
                                        alt="Faceit Level"
                                    />
                                </div>
                            </div>

                            {/* lifetime block (render only if there is NO error in stats.csgo.lifetime) */}
                            {!('error' in (stats.csgo.lifetime ?? {})) && (
                                <>
                                    <div className="stat">
                                        <p className="stat__name">HS%</p>
                                        <p className="stat__value">{stats.csgo.lifetime.hs_percentage}%</p>
                                    </div>

                                    <div className="stat">
                                        <p className="stat__name">WINRATE</p>
                                        <p className="stat__value">{stats.csgo.lifetime.winrate}%</p>
                                    </div>

                                    <div className="stat">
                                        <p className="stat__name">KD</p>
                                        <p className="stat__value">{stats.csgo.lifetime.kd}</p>
                                    </div>

                                    <div className="stat">
                                        <p className="stat__name">matches</p>
                                        <p className="stat__value">{stats.csgo.lifetime.matches}</p>
                                    </div>

                                    <div className="stat">
                                        <p className="stat__name">LAST GAMES</p>
                                        <div className="stat__recent-games">
                                            {stats.csgo.lifetime.recent.map((r: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className={`stat__recent-games--${r === 'W' ? 'win' : 'loss'}`}
                                                >
                                                  {r}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (<div></div>)}
        </div>
    </div>
)
}
