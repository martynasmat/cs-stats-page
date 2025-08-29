import { CSSProperties } from "react";
import styles from "./spinner.module.css";

type SpinnerProps = {
    size?: number | string;
    thickness?: number;
    color?: string;
    trackColor?: string;
    className?: string;
    style?: CSSProperties;
    center?: boolean;
};

export function Spinner({
    size = 24,
    thickness = 3,
    color = "currentColor",
    trackColor = "rgba(0,0,0,0.12)",
    className,
    style,
    center,
}: SpinnerProps) {
    const s = typeof size === "number" ? `${size}px` : size;
    const spinner = (
        <span
            role="status"
            aria-live="polite"
            className={`${styles.spinner} ${className ?? ""}`}
            style={{
                "--spinner-size": s,
                "--spinner-thickness": `${thickness}px`,
                "--spinner-color": color,
                "--spinner-track": trackColor,
                ...style,
            }}
        />
    );

    if (center) {
        return <div class={styles.spinner__wrapper}>{spinner}</div>;
    }

    return spinner;
}
