import { useFetch } from "../../../hooks/use-fetch";
import { CardHeader } from "../card-header";
import { Spinner } from "../spinner";
import leetifyLogo from "../../../assets/leetify_logo.webp";
import { ProfileNotFound } from "../profile-not-found";
import { LeetifyCardContent } from "./leetify-card-content";
import { getLeetifyStats } from "../../../api/leetify";

type LeetifyCardProps = {
    steamId: string;
};

export function LeetifyCard({ steamId }: LeetifyCardProps) {
    const {
        data: stats,
        error,
        isLoading,
    } = useFetch({
        fn: () => getLeetifyStats(steamId),
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
                        alt="Steam logo"
                        src={leetifyLogo}
                    />
                }
            />
            {isLoading ? (
                <Spinner color="red" center />
            ) : error || !stats ? (
                <ProfileNotFound />
            ) : (
                <LeetifyCardContent stats={stats} />
            )}
        </div>
    );
}
