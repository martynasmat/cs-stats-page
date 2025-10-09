import requests as r
from urllib.parse import urlsplit

STEAM_TIERS = [
    "circles",
    "hexagons",
    "shields",
    "books",
    "chevrons",
    "circle2",
    "angle",
    "flag",
    "wings",
    "arrows",
    "crystals",
    "space",
    "waterelement",
    "fireelement",
    "earthelement",
    "airelement_1-2",
    "airelement_3-4",
    "airelement_5-6",
    "airelement_7-8",
    "airelement_9-10",
    "geo_1-2",
    "geo_3-4",
    "geo_5-6",
    "geo_7-8",
    "geo_9-10",
    "mandala_1-2",
    "mandala_3-4",
    "mandala_5-6",
    "mandala_7-8",
    "mandala_9-10",
    "spiro_1-2",
    "spiro_3-4",
    "spiro_5-6",
    "spiro_7-8",
    "spiro_9-10",
    "patterns_1-2",
    "patterns_3-4",
    "patterns_5-6",
    "patterns_7-8",
    "patterns_9-10",
    "shapes_1",
    "shapes_2",
    "shapes_3",
    "shapes_4",
    "shapes_5",
    "grunge_1",
    "grunge_2",
    "grunge_3",
    "grunge_4",
    "grunge_5",
    "halftone_1",
    "halftone_2",
    "halftone_3",
    "5300_dashes",
    "5400_crosshatch",
    "5500_spiral",
    "5600_leaves",
    "5700_mountain",
    "5800_rain",
    "5900_tornado",
    "6000_snowflake",
    "6100_crown",
]

def resolve_steam_id(vanity_name: str, api_key: str | None) -> int | None:
    url = (f"https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key="
            f"{api_key}&vanityurl={vanity_name}")

    try:
        response = r.get(url).json()
        data = response["response"]

        if data["success"]:
            return data["steamid"]
        else:
            return None
    except:
        return None


def resolve_steam_id_from_url(profile_url: str, api_key: str | None) -> int | None:
    split = urlsplit(profile_url)
    host = split.hostname
    path = split.path

    if host != "steamcommunity.com" and host != "www.steamcommunity.com":
        return None

    _, segment_1, segment_2 = path.split("/")

    if segment_1 != "id" and segment_1 != "profiles" or segment_2 == "":
        return None

    if segment_1 == "profiles":
        return int(segment_2)

    return resolve_steam_id(segment_2, api_key)


def get_steam_level_shape_link(xp: int) -> str:
    base_url = 'https://community.fastly.steamstatic.com/public/shared/images/community/levels_'
    tier = min(xp // 100, len(STEAM_TIERS) - 1)

    return f"{base_url}{STEAM_TIERS[tier]}.png"
