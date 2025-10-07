import de_ancient from "../../../assets/maps/de_ancient.png";
import de_dust2 from "../../../assets/maps/de_dust2.png";
import de_inferno from "../../../assets/maps/de_inferno.png";
import de_mirage from "../../../assets/maps/de_mirage.png";
import de_nuke from "../../../assets/maps/de_nuke.png";
import de_overpass from "../../../assets/maps/de_overpass.png";
import de_train from "../../../assets/maps/de_train.png";
import de_vertigo from "../../../assets/maps/de_vertigo.png";

type MapProps = {
    map: string;
};

const maps: Record<string, string> = {
    de_ancient: de_ancient,
    de_dust2: de_dust2,
    de_inferno: de_inferno,
    de_mirage: de_mirage,
    de_nuke: de_nuke,
    de_overpass: de_overpass,
    de_train: de_train,
    de_vertigo: de_vertigo,
};

export function Map({ map }: MapProps) {
    const url = maps[map];

    if (!url) return;

    return <img className="map" alt={`CS2 map ${map} banner`} src={url} />;
}
