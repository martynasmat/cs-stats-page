import { LeetifyStats } from "../../../api/leetify";
import tier1 from "../../../assets/premiere-backgrounds/tier1.webp";
import tier2 from "../../../assets/premiere-backgrounds/tier2.webp";
import tier3 from "../../../assets/premiere-backgrounds/tier3.webp";
import tier4 from "../../../assets/premiere-backgrounds/tier4.webp";
import tier5 from "../../../assets/premiere-backgrounds/tier5.webp";
import tier6 from "../../../assets/premiere-backgrounds/tier6.webp";
import tier7 from "../../../assets/premiere-backgrounds/tier7.webp";
import skillgroup1 from "../../../assets/csgo-ranks/skillgroup1.png";
import skillgroup2 from "../../../assets/csgo-ranks/skillgroup2.png";
import skillgroup3 from "../../../assets/csgo-ranks/skillgroup3.png";
import skillgroup4 from "../../../assets/csgo-ranks/skillgroup4.png";
import skillgroup5 from "../../../assets/csgo-ranks/skillgroup5.png";
import skillgroup6 from "../../../assets/csgo-ranks/skillgroup6.png";
import skillgroup7 from "../../../assets/csgo-ranks/skillgroup7.png";
import skillgroup8 from "../../../assets/csgo-ranks/skillgroup8.png";
import skillgroup9 from "../../../assets/csgo-ranks/skillgroup9.png";
import skillgroup10 from "../../../assets/csgo-ranks/skillgroup10.png";
import skillgroup11 from "../../../assets/csgo-ranks/skillgroup11.png";
import skillgroup12 from "../../../assets/csgo-ranks/skillgroup12.png";
import skillgroup13 from "../../../assets/csgo-ranks/skillgroup13.png";
import skillgroup14 from "../../../assets/csgo-ranks/skillgroup14.png";
import skillgroup15 from "../../../assets/csgo-ranks/skillgroup15.png";
import skillgroup16 from "../../../assets/csgo-ranks/skillgroup16.png";
import skillgroup17 from "../../../assets/csgo-ranks/skillgroup17.png";
import skillgroup18 from "../../../assets/csgo-ranks/skillgroup18.png";
import "./style.css";

type LeetifyCardContentProps = {
    stats: LeetifyStats;
};

const csgo_ranks: Record<number, string> = {
    1: skillgroup1,
    2: skillgroup2,
    3: skillgroup3,
    4: skillgroup4,
    5: skillgroup5,
    6: skillgroup6,
    7: skillgroup7,
    8: skillgroup8,
    9: skillgroup9,
    10: skillgroup10,
    11: skillgroup11,
    12: skillgroup12,
    13: skillgroup13,
    14: skillgroup14,
    15: skillgroup15,
    16: skillgroup16,
    17: skillgroup17,
    18: skillgroup18,
};

const rating_tiers: Record<number, string> = {
    1: tier1,
    2: tier2,
    3: tier3,
    4: tier4,
    5: tier5,
    6: tier6,
    7: tier7,
};

export function LeetifyCardContent({ stats }: LeetifyCardContentProps) {
    return (
        <div className="content__leetify">
            <div className="content__wrapper__inside">
                <a className="user__link" href={stats.leetify_url}>
                    <div className="user__wrapper leetify">
                        <img
                            className="user__avatar"
                            src={stats.avatar}
                            alt="Leetify profile avatar"
                        />
                        <p className="user__name">{stats.nickname}</p>
                    </div>
                </a>
                <div className="user__stats">
                    <div className="stat__grid">
                        {stats.rating_tier !== null && (
                            <div className="stat">
                                <p className="stat__name">Max rating</p>
                                <div className="rating__wrapper">
                                    <img
                                        src={
                                            stats.max_rating <= 18
                                                ? csgo_ranks[stats.rating_tier]
                                                : rating_tiers[
                                                      stats.rating_tier
                                                  ]
                                        }
                                        alt="Counter strike rating"
                                    />
                                    <p
                                        className={`stat__value tier${stats.rating_tier}`}
                                    >
                                        {stats.max_rating > 18
                                            ? stats.max_rating
                                            : ""}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="stat">
                            <p className="stat__name">Matches</p>
                            <p className="stat__value">{stats.matches}</p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Banned mates</p>
                            <p className="stat__value">{stats.banned_mates}%</p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Aim</p>
                            <p
                                className={`${
                                    stats.aim >= 75 ? "positive" : ""
                                } ${
                                    stats.aim <= 50 ? "negative" : ""
                                } stat__value`}
                            >
                                {stats.aim}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">utility</p>
                            <p
                                className={`${
                                    stats.utility >= 75 ? "positive" : ""
                                } ${
                                    stats.utility <= 50 ? "negative" : ""
                                } stat__value`}
                            >
                                {stats.utility}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Positioning</p>
                            <p
                                className={`${
                                    stats.position >= 75 ? "positive" : ""
                                } ${
                                    stats.position <= 50 ? "position" : ""
                                } stat__value`}
                            >
                                {stats.position}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Rating</p>
                            <p
                                className={`${
                                    stats.rating >= 0 ? "positive" : "negative"
                                } stat__value`}
                            >
                                {stats.rating >= 0 ? "+" : ""}
                                {stats.rating}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Opening</p>
                            <p
                                className={`${
                                    stats.opening >= 0 ? "positive" : "negative"
                                } stat__value`}
                            >
                                {stats.opening >= 0 ? "+" : ""}
                                {stats.opening}
                            </p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Clutch</p>
                            <p
                                className={`${
                                    stats.clutch >= 0 ? "positive" : "negative"
                                } stat__value`}
                            >
                                {stats.clutch >= 0 ? "+" : ""}
                                {stats.clutch}
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
                            <p className="stat__value">{stats.preaim}°</p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">Party</p>
                            {stats.party != null && (
                                <p
                                    className={`${
                                        stats.party > 0
                                            ? "positive"
                                            : "negative"
                                    } stat__value`}
                                >
                                    {stats.party > 0 ? "+" : ""}
                                    {stats.party}
                                </p>
                            )}
                        </div>
                        <div className="stat">
                            <p className="stat__name">HE dmg</p>
                            <p className="stat__value">{stats.avg_he}</p>
                        </div>
                        <div className="stat">
                            <p className="stat__name">WIN %</p>
                            <p className="stat__value">{stats.winrate}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
