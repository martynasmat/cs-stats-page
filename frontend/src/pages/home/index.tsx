import { useState } from "preact/hooks";
import { Search } from "../../components/icons/search";
import styles from "./home.module.css";
import { TargetedEvent } from "preact/compat";
import { useLocation } from "preact-iso";
import { checkLink } from "../../api/steam";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../../components/ui/spinner";

export default function Home() {
    const location = useLocation();
    const [profile, setProfile] = useState("");
    const [error, setError] = useState<string | undefined>();
    const { mutateAsync: check, isPending } = useMutation({
        mutationFn: (profile: string) => checkLink(profile),
    });

    async function handleSubmit(event: TargetedEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const { id } = await check(profile);

            if (!id) {
                setError("Invalid Steam URL");
                return;
            }

            location.route(`/profiles/${id}`);
        } catch {
            setError("Invalid Steam URL");
        }
    }

    return (
        <main class={styles.content}>
            <div>
                <div class={styles.app_title}>
                    <p>steamcommunity.</p>
                    <div>
                        <p class={styles.win}>win</p>
                        <p class={styles.com}>com</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div class={styles.search_form}>
                        <div class={styles.floating_input_wrapper}>
                            <label for="profile-input">
                                Steam profile link
                            </label>
                            <input
                                id="profile-input"
                                class={styles.profile_input}
                                placeholder=""
                                value={profile}
                                onInput={(event) => {
                                    if (error) {
                                        setError(undefined);
                                    }

                                    setProfile(event.currentTarget.value);
                                }}
                            />
                        </div>
                        <button class={styles.search_btn}>
                            {isPending ? (
                                <Spinner size={20} center />
                            ) : (
                                <Search />
                            )}
                        </button>
                    </div>
                    {error && <small class={styles.error}>{error}</small>}
                </form>
            </div>
        </main>
    );
}
