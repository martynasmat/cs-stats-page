import { useRoute } from "preact-iso";
import styles from "./profile.module.css";
import { SteamCard } from "../../components/ui/steam-card";
import { FaceitCard } from "../../components/ui/faceit-card";
import { LeetifyCard } from "../../components/ui/leetify-card";
import ReactGA from "react-ga4";
import {useEffect} from "react";

export default function Profile() {
    const location = useRoute();
    const steamId = location.params.id;
    const TRACKING_ID = "G-Y3C1F7ZBQ1";

    useEffect(() => {
        ReactGA.initialize(TRACKING_ID);
        ReactGA.send({ hitType: "pageview", page: `/profiles/${steamId}`, title: "Steam profile" });
    })

    return (
        <main class={styles.content}>
            <div class={styles.content__wrapper}>
                <SteamCard steamId={steamId} />
                <FaceitCard steamId={steamId} />
                <LeetifyCard steamId={steamId} />
            </div>
            <div class={styles.contact}>
                <p class={"contact-info"}>Contact us on Discord - tsitrina & mykolas_</p>
            </div>
        </main>
    );
}
