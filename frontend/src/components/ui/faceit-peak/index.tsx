import { useFetch } from "../../../hooks/use-fetch";
import { getFaceitPeakElo } from "../../../api/faceit";
import { Spinner } from "../spinner";
import {FaceitPeakContent} from "./faceit-peak-content";

type FaceitPeakProps = {
    uuid: string;
};

export function FaceitCard({ uuid }: FaceitPeakProps) {
    const {
        data: stats,
        error,
        isLoading
    } = useFetch({
        fn: () => getFaceitPeakElo(uuid),
    })

    return (
        <div>
            {isLoading ? (
                <Spinner color="red" center />
            ) : (
                <FaceitPeakContent stats={stats} />
            )}
        </div>
    );
}