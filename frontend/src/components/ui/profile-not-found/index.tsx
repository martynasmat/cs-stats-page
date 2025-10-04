import notFound from "../../../assets/profile-not-found.svg";

export function ProfileNotFound() {
    return (
        <div class="not_found__wrapper">
            <p class="not_found_heading">Not found</p>
            <img
                class="not_found_icon"
                alt="Profile not found"
                src={notFound}
            />
        </div>
    );
}
