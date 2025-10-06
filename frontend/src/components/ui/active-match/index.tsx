import styles from "./active-match.module.css"

type ActiveMatchProps = {
    match_id: string | undefined;
};

export function ActiveMatch({ match_id }: ActiveMatchProps) {
    if (match_id == undefined || match_id == '') return;

    return (
        <div className={styles.active_match}>
            <div className={styles.playing_text}>
                <p>PLAYING RIGHT NOW</p>
            </div>
            <a href={`/match/${match_id}`} className={"match__btn"}>SEE MATCH STATS</a>
        </div>
    );
}
