import { ReactNode } from "preact/compat";
import { Hammer } from "../../icons/hammer";
import styles from "./card-header.module.css";

type CardHeaderProps = {
    image?: ReactNode;
    banned?: boolean;
};

export function CardHeader({ image, banned }: CardHeaderProps) {
    return (
        <div class={`${styles.card_header} ${banned ? styles.banned : ""}`}>
            {banned && (
                <div class={styles.bans__wrapper}>
                    <p>BANNED</p>
                    <Hammer class={styles.ban_hammer} />
                </div>
            )}
            <div class={styles.logo__wrapper}>{image}</div>
        </div>
    );
}
