import { useRoute } from "preact-iso";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMatchStats } from "../../api/match";
import { MiniProfile } from "../../components/ui/mini-profile";
import styles from "./matchroom.module.css";
import { Map } from "../../components/ui/map";
import { Spinner } from "../../components/ui/spinner";
import { useCallback, useState } from "preact/hooks";
import { round } from "../../lib/utils";

export default function Matchroom() {
  const location = useRoute();
  const matchId = location.params.id;
  const TRACKING_ID = "G-Y3C1F7ZBQ1";

  const serverCountryCode = {
    moscow: "ru",
    netherlands: "nl",
    uk: "uk",
    germany: "de",
    sweden: "se",
    france: "fr",
    finland: "fi",
    kazakhstan: "kz",
    california: "us",
    dallas: "us",
    denver: "us",
    "new york": "us",
    chicago: "us",
    miami: "us",
  };

  const {
    data: stats,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`matchStats-${matchId}`],
    staleTime: 180000,
    queryFn: () => getMatchStats(matchId),
  });

  const [bestPlayers, setBestPlayers] = useState<{
    [key in "faction1" | "faction2"]?: { playerId: string; score: number };
  }>({});

  const handleStatsLoaded = useCallback(
    (teamKey: "faction1" | "faction2", playerId: string, score: number) => {
      setBestPlayers((previous) => {
        const current = previous[teamKey];

        if (!current || score > current.score) {
          return { ...previous, [teamKey]: { playerId, score } };
        }

        return previous;
      });
    },
    [],
  );

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({
      hitType: "pageview",
      page: `/match/${matchId}`,
      title: "Match room",
    });
  });

  return (
    <main className={styles.matchroom__wrapper}>
      <div className={styles.matchroom}>
        <div className={styles.faction}>
          <h3 className={styles.faction__name}>
            {stats?.teams?.faction1?.name}
          </h3>
          {(stats?.teams?.faction1.roster ?? []).map((player) => (
            <MiniProfile
              key={player.game_player_id}
              steamId={player.game_player_id}
              teamKey="faction1"
              onStatsLoaded={handleStatsLoaded}
              showStar={
                bestPlayers.faction1?.playerId === player.game_player_id
              }
            />
          ))}
        </div>
        <div className={styles.match_stats}>
          <div className={styles.server_info}>
            <div className={styles.server_stat}>
              <p className={styles.server_stat__label}>competition name</p>
              <p className={styles.server_stat__value}>
                {stats?.competition_name}
              </p>
            </div>
            <div className={styles.server_stat}>
              <p className={styles.server_stat__label}>server location</p>
              <div className={styles.server_stat__grid}>
                {isLoading ? (
                  <Spinner center />
                ) : (
                  <img
                    className="stat__country"
                    src={`https://flagcdn.com/${serverCountryCode[stats?.voting?.location?.pick[0].toLowerCase()]}.svg`}
                    alt="Country"
                  />
                )}
                <p className={styles.server_stat__value}>
                  {stats?.voting?.location?.pick}
                </p>
              </div>
            </div>
            <div className={styles.server_stat}>
              <p className={styles.server_stat__label}>picked map</p>
              <div className={styles.server_stat__grid}>
                <Map map={stats?.voting?.map?.pick} />
                <p className={styles.server_stat__value}>
                  {stats?.voting?.map?.pick}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.match_info}>
            <p className={styles.match_stat__label}>score</p>
            <div className={styles.match_stat__grid}>
              <p
                className={`${styles.team_score} ${stats?.results?.score["faction1"] > stats?.results?.score["faction2"] ? "positive" : ""}`}
              >
                {stats?.results?.score["faction1"]}
              </p>
              <p className={styles.dash}>-</p>
              <p
                className={`${styles.team_score} ${stats?.results?.score["faction2"] > stats?.results?.score["faction1"] ? "positive" : ""}`}
              >
                {stats?.results?.score["faction2"]}
              </p>
            </div>
          </div>
          <div className={styles.team_info}>
            <div className={styles.team_stat}>
              <p className={styles.team_info__label}>Win probability</p>
              <div className={styles.team_info__values}>
                <p
                  className={
                    stats?.teams?.faction1.stats?.winProbability > 0.5
                      ? "positive"
                      : ""
                  }
                >
                  {stats?.teams?.faction1.stats?.winProbability != null
                    ? round(stats?.teams?.faction1.stats?.winProbability * 100)
                    : 0}
                  %
                </p>
                <p
                  className={
                    stats?.teams?.faction2.stats?.winProbability > 0.5
                      ? "positive"
                      : ""
                  }
                >
                  {stats?.teams?.faction2.stats?.winProbability != null
                    ? round(stats?.teams?.faction2.stats?.winProbability * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className={styles.team_stat}>
              <p className={styles.team_info__label}>average elo</p>
              <div className={styles.team_info__values}>
                <p
                  className={
                    stats?.teams?.faction1.stats?.rating >
                    stats?.teams?.faction2.stats?.rating
                      ? "positive"
                      : ""
                  }
                >
                  {stats?.teams?.faction1.stats?.rating}
                </p>
                <p
                  className={
                    stats?.teams?.faction2.stats?.rating >
                    stats?.teams?.faction1.stats?.rating
                      ? "positive"
                      : ""
                  }
                >
                  {stats?.teams?.faction2.stats?.rating}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.faction}>
          <h3 className={styles.faction__name}>
            {stats?.teams?.faction2?.name}
          </h3>
          {stats?.teams?.faction2.roster.map((player) => (
            <MiniProfile
              key={player.game_player_id}
              steamId={player.game_player_id}
              teamKey="faction2"
              onStatsLoaded={handleStatsLoaded}
              showStar={
                bestPlayers.faction2?.playerId === player.game_player_id
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
