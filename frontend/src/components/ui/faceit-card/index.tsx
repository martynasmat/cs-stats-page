import { useFetch } from "../../../hooks/use-fetch";
import { getFaceitStats } from "../../../api/faceit";
import { Spinner } from "../spinner";
import { CardHeader } from "../card-header";
import faceitLogo from "../../../assets/faceit_logo.webp";

type FaceitCardProps = {
    steamId: string;
};

export function FaceitCard({ steamId }: FaceitCardProps) {
    const isLoading = true;
    const { data: faceitStats } = useFetch({
        fn: () => getFaceitStats(steamId),
    });

    console.log(faceitStats);

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
            />
            {isLoading ? (
                <Spinner color="red" center />
            ) : (
                <div>Faceit card</div>
            )}
        </div>
    );
}
