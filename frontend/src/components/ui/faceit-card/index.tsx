import { getFaceitStats } from "../../../api/faceit";
import { Spinner } from "../spinner";
import { CardHeader } from "../card-header";
import faceitLogo from "../../../assets/faceit_logo.webp";
import { ProfileNotFound } from "../profile-not-found";
import { FaceitCardContent } from "./faceit-card-content";
import { useQuery } from "@tanstack/react-query";

type FaceitCardProps = {
    steamId: string;
};

export function FaceitCard({ steamId }: FaceitCardProps) {
    const {
        data: faceitStats,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["faceitStats"],
        queryFn: () => getFaceitStats(steamId),
    });

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
            {isLoading ? (
                <Spinner color="red" center />
            ) : error || !faceitStats ? (
                <ProfileNotFound />
            ) : (
                <FaceitCardContent stats={faceitStats} />
            )}
        </div>
    );
}
