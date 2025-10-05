import level1 from "../../../assets/faceit-levels/1.png";
import level2 from "../../../assets/faceit-levels/2.png";
import level3 from "../../../assets/faceit-levels/3.png";
import level4 from "../../../assets/faceit-levels/4.png";
import level5 from "../../../assets/faceit-levels/5.png";
import level6 from "../../../assets/faceit-levels/6.png";
import level7 from "../../../assets/faceit-levels/7.png";
import level8 from "../../../assets/faceit-levels/8.png";
import level9 from "../../../assets/faceit-levels/9.png";
import level10 from "../../../assets/faceit-levels/10.png";

type FaceitLevelProps = {
    level: number;
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

export function FaceitLevel({ level }: FaceitLevelProps) {
    const url = levels[level];

    if (!url) return;

    return (
        <img
            className="stat__fc-level"
            alt={`Faceit Level ${level}`}
            src={url}
        />
    );
}
