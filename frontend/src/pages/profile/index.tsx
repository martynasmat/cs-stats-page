import { useRoute } from "preact-iso";
import styles from "./profile.module.css";
import { SteamCard } from "../../components/ui/steam-card";
import { FaceitCard } from "../../components/ui/faceit-card";
import { LeetifyCard } from "../../components/ui/leetify-card";

export default function Profile() {
    const location = useRoute();
    const steamId = location.params.id;

    return (
        <main class={styles.content}>
            <div class={styles.content__wrapper}>
                <SteamCard steamId={steamId} />
                <FaceitCard steamId={steamId} />
                <LeetifyCard steamId={steamId} />
            </div>
        </main>
    );
}
