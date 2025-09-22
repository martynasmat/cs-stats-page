import {FaceitPeakElo} from "../../../api/faceit";

type FaceitCardContentProps = {
    stats: FaceitPeakElo
};

export function FaceitPeakContent({ stats }: FaceitCardContentProps) {
    return (
        <div className="content__leetify"></div>
    )
}
