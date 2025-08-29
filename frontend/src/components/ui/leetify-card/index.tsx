import { getLeetifyStats } from "../../../api/leetify";
import { CardHeader } from "../card-header";
import { Spinner } from "../spinner";
import leetifyLogo from "../../../assets/leetify_logo.webp";

type LeetifyCardProps = {
    steamId: string;
};

export function LeetifyCard({ steamId }: LeetifyCardProps) {
    const isLoading = true;
    // const { data: leetifyStats } = useFetch({
    //     fn: () => getLeetifyStats(steamId),
    // });

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
                        alt="Leetify logo"
                        src={leetifyLogo}
                    />
                }
            />
            {isLoading ? (
                <Spinner color="red" center />
            ) : (
                <div>Leetify card</div>
            )}
        </div>
    );
}
