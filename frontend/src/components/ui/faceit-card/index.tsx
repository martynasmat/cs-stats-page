import { getFaceitStats } from "../../../api/faceit";
import { Spinner } from "../spinner";
import { CardHeader } from "../card-header";
import faceitLogo from "../../../assets/faceit_logo.webp";
import { ProfileNotFound } from "../profile-not-found";
import { FaceitCardContent } from "./faceit-card-content";

type FaceitCardProps = {
    steamId: string;
    faceitStats?: Awaited<ReturnType<typeof getFaceitStats>>;
    isLoading?: boolean;
    error?: unknown;
};

export function FaceitCard({ faceitStats, isLoading, error }: FaceitCardProps) {
    const shouldQuery = faceitStats === undefined;

    const stats = shouldQuery ? undefined : faceitStats;
    const loading = shouldQuery ? isLoading : !!isLoading;
    const err = shouldQuery ? error : error;

    return (
        <div>
            <CardHeader
                image={
                    <img
                        style={{
                            objectFit: "cover",
                            width: "80%",
                            height: "auto",
                        }}
                        alt="Faceit logo"
                        src={faceitLogo}
                    />
                }
                banned={faceitStats?.banned}
            />
            {loading ? (
                <Spinner center />
            ) : err || !stats ? (
                <ProfileNotFound />
            ) : (
                <FaceitCardContent stats={stats} />
            )}
        </div>
    );
}
