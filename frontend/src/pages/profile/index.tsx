import { useRoute } from "preact-iso";
import styles from "./profile.module.css";
import { SteamCard } from "../../components/ui/steam-card";
import { FaceitCard } from "../../components/ui/faceit-card";
import { LeetifyCard } from "../../components/ui/leetify-card";
import ReactGA from "react-ga4";
import {useEffect} from "react";
import {getFaceitStats} from "../../api/faceit";
import {useQuery} from "@tanstack/react-query";
import {ActiveMatch} from "../../components/ui/active-match";

export default function Profile() {
    const location = useRoute();
    const steamId = location.params.id;
    const TRACKING_ID = "G-Y3C1F7ZBQ1";

    const {
        data: faceitStats,
        error: faceitError,
        isLoading: isFaceitLoading,
    } = useQuery({
        queryKey: ["faceitStats"],
        queryFn: () => getFaceitStats(steamId),
    });

    useEffect(() => {
        ReactGA.initialize(TRACKING_ID);
        ReactGA.send({ hitType: "pageview", page: `/profiles/${steamId}`, title: "Steam profile" });
    })

    return (
        <main class={styles.content}>
            <ActiveMatch match_id={faceitStats?.active_match?.id} />
            <div class={`${styles.content__wrapper} ${
                faceitStats?.active_match?.id ? styles.match_found : ""
            }`}>
                <SteamCard steamId={steamId} />
                <FaceitCard
                    steamId={steamId}
                    faceitStats={faceitStats}
                    isLoading={isFaceitLoading}
                    error={faceitError}
                />
                <LeetifyCard steamId={steamId} />
            </div>
            <div class={styles.contact}>
                <p class={"contact-info"}>Contact us on Discord - tsitrina & mykolas_</p>
            </div>
        </main>
    );
}
