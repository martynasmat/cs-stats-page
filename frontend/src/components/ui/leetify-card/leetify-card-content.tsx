import { LeetifyStats } from "../../../api/leetify";

type LeetifyCardContentProps = {
    stats: LeetifyStats;
};

export function LeetifyCardContent({ stats }: LeetifyCardContentProps) {


    return (
        <div className="content__leetify">
            <div className="content__wrapper__inside">
                <a className="user__link" href="{{ stats.leetify_url }}">
                    <div className="user__wrapper leetify">
                        <img
                            className="user__avatar"
                            src="{{ user_stats.steam.general.avatarfull }}"
                            alt="Leetify profile avatar"
                        />
                        <p className="user__name">{stats.nickname}</p>
                    </div>
                </a>
                <div className="user__stats">
                    <div className="stat__grid">
                        <div className="stat">
                            <p className="stat__name">Max rating</p>
                            <div className="rating__wrapper">
                                <img
                                    src={
                                        stats.max_rating <= 18
                                            ? `/images/csgo-ranks/skillgroup${stats.max_rating}.png`
                                            : `/images/premiere-backgrounds/${stats.rating_tier}.webp`
                                    }
                                    alt="Counter strike rating"
                                />
                                <p
                                    className={`stat__value ${stats.rating_tier}}`}
                                >
                                    {
                                        stats.max_rating > 18 ? stats.max_rating : stats.max_rating
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Matches</p>
                            <p className="stat__value">
                                {stats.matches}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Banned mates</p>
                            <p className="stat__value">
                                {stats.banned_mates}%
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Aim</p>
                            <p
                                className={`${stats.aim >= 75 ?  'positive' : ''} ${stats.aim <= 50 ? 'negative' : ''} stat__value`}
                            >
                                {stats.aim}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">utility</p>
                            <p
                                className={`${stats.utility >= 75 ? 'positive' : ''} ${stats.utility <= 50 ? 'negative' : ''} stat__value`}
                            >
                                {stats.utility}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Positioning</p>
                            <p
                                className={`${stats.position >= 75 ? 'positive' : ''} ${stats.position <= 50 ? 'position' : ''} stat__value`}
                            >
                                {stats.position}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Rating</p>
                            <p
                                className={`${stats.rating >= 0 ? 'positive' : 'negative'} stat__value`}
                            >
                                {stats.rating >= 0 ? '+' : ''}{
                                stats.rating
                            }
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Opening</p>
                            <p
                                className={`${stats.opening >= 0 ? 'positive' : 'negative' } stat__value`}
                            >
                                {stats.opening >= 0 ? '+' : ''}{
                                stats.opening
                            }
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Clutch</p>
                            <p
                                className={`${stats.clutch >= 0 ? 'positive' : 'negative' } stat__value`}
                            >
                                {stats.clutch >= 0 ? '+' : ''}{stats.clutch}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">K/D</p>
                            <p className="stat__value">{stats.kd}</p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Reaction</p>
                            <p className="stat__value">
                                {stats.reaction_time}
                                <span>ms</span>
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Preaim</p>
                            <p className="stat__value">
                                {stats.preaim}°
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Party</p>
                        {stats.party != null && (
                            <p
                                className={`${stats.party > 0 ? 'positive' : 'negative' } stat__value`}
                            >
                                {stats.party > 0 ? '+' : ''}{stats.party}
                            </p>
                        )}
                        </div>
                        <div className="stat">
                            <p className="stat__name">he dmg</p>
                            <p className="stat__value">
                                {stats.avg_he}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">WIN %</p>
                            <p className="stat__value">
                                {stats.winrate}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
)
    ;
}
