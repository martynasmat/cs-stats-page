import os
import requests as r
import time
from flask import Blueprint
from .helpers import get_faceit_level, get_average_stats

FACEIT_API_KEY_NAME = os.getenv("FACEIT_API_KEY_NAME")
FACEIT_API_KEY = os.getenv("FACEIT_API_KEY")

faceit_bp = Blueprint("faceit", __name__)


@faceit_bp.route("/profile/<steam_id>/", methods=["GET"])
def get_faceit_profile(steam_id: str) -> tuple[dict, int]:
    headers = {"Authorization": f"Bearer {FACEIT_API_KEY}"}
    stats = {
        "csgo": None,
        "cs2": {},
        "recentGameStats": {},
    }
    has_cs2 = False
    has_csgo = False

    # Get FACEIT CS2 statistics
    url = f"https://open.faceit.com/data/v4/players?game=cs2&game_player_id={steam_id}"
    response_cs2 = r.get(url, headers=headers)
    player_uuid = None

    if response_cs2.status_code != 200:
        stats["cs2"] = None
    else:
        has_cs2 = True
        response_cs2 = response_cs2.json()
        player_uuid = response_cs2["player_id"]
        url = f"https://open.faceit.com/data/v4/players/{player_uuid}/stats/cs2"
        response_lifetime = r.get(url, headers=headers)
        if response_lifetime.status_code == 200:
            lifetime = response_lifetime.json()["lifetime"]
            lifetime_dict = {
                "hs_percentage": lifetime["Average Headshots %"],
                "clutch_1v1": round(
                    float(lifetime["1v1 Win Rate"]) * 100) if "1v1 Win Rate" in lifetime is not None else None,
                "clutch_1v2": round(
                    float(lifetime["1v2 Win Rate"]) * 100) if "1v2 Win Rate" in lifetime is not None else None,
                "winrate": lifetime["Win Rate %"],
                "kd": lifetime["Average K/D Ratio"],
                "matches": lifetime["Matches"],
                "adr": lifetime["ADR"] if "ADR" in lifetime is not None else None,
                "utility_damage": lifetime[
                    "Utility Damage per Round"] if "Utility Damage per Round" in lifetime is not None else None,
                "recent": list(map(lambda x: "W" if x == "1" else "L", lifetime["Recent Results"]))
            }
        else:
            lifetime_dict = None

        stats["cs2"] = {
            "createdAt": response_cs2["activated_at"],
            "profileURL": str(response_cs2["faceit_url"]).replace('{lang}', 'en'),
            "avatar": response_cs2["avatar"],
            "country": response_cs2["country"],
            "language": response_cs2["settings"]["language"],
            "statsCS2": response_cs2["games"]["cs2"],
            "statsCSGO": response_cs2["games"]["csgo"] if "csgo" in response_cs2["games"] else None,
            "memberships": response_cs2["memberships"],
            "nickname": response_cs2["nickname"],
            "playerID": response_cs2["player_id"],
            "lifetime": lifetime_dict,
        }

    # Get FACEIT CS:GO statistics
    url = f"https://open.faceit.com/data/v4/players?game=csgo&game_player_id={steam_id}"
    response_csgo = r.get(url, headers=headers)
    if response_csgo.status_code != 200:
        stats["csgo"] = None
    else:
        has_csgo = True
        response_csgo = response_csgo.json()
        url = f"https://open.faceit.com/data/v4/players/{player_uuid}/stats/csgo"
        response_lifetime = r.get(url, headers=headers)
        if response_lifetime.status_code == 200:
            lifetime = response_lifetime.json()["lifetime"]
            lifetime_dict = {
                "hs_percentage": lifetime["Average Headshots %"],
                "winrate": lifetime["Win Rate %"],
                "kd": lifetime["Average K/D Ratio"],
                "matches": lifetime["Matches"],
                "recent": list(map(lambda x: "W" if x == "1" else "L", lifetime["Recent Results"]))
            }
        else:
            lifetime_dict = None

        stats["csgo"] = {
            "createdAt": response_csgo["activated_at"],
            "nickname": response_csgo["nickname"],
            "profileURL": str(response_csgo["faceit_url"]).replace('{lang}', 'en'),
            "avatar": response_csgo["avatar"],
            "country": response_csgo["country"],
            "statsCSGO": response_csgo["games"]["csgo"],
            "memberships": response_csgo["memberships"],
            "lifetime": lifetime_dict,
        }

    if not has_cs2 and not has_csgo:
        return {"message": "Profile not found"}, 404

    stats["player_uuid"] = player_uuid

    if has_cs2 and player_uuid is not None:
        # Get FACEIT statistics for the last 50 games
        url = f"https://open.faceit.com/data/v4/players/{player_uuid}/games/cs2/stats?limit=50"
        response_recent = r.get(url, headers=headers)
        if response_recent.status_code != 200 or response_recent.json()["items"] == []:
            stats["recentGameStats"] = None
        else:
            response_recent_json = response_recent.json()
            stats["recentGameStats"] = get_average_stats(response_recent_json["items"], response_recent_json["end"])
            stats["cs2"]["last_game"] = response_recent_json["items"][0]["stats"]["Created At"] # type: ignore

        # Get FACEIT bans
        faceit_bans = r.get(f"https://open.faceit.com/data/v4/players/{player_uuid}/bans", headers=headers).json()
        if faceit_bans["items"]:
            stats["cs2"]["bans"] = faceit_bans["items"] # type: ignore

    # Get Faceit bans
    url = f"https://open.faceit.com/data/v4/players/{player_uuid}/bans"
    response_bans = r.get(url, headers=headers)
    bans_json = response_bans.json()
    stats["banned"] = bans_json["items"] != []

    url = f"https://www.faceit.com/api/match/v1/matches/groupByState?userId={player_uuid}"
    response_match = r.get(url)
    response_match_json = response_match.json()
    if response_match_json["payload"] == {} or "ONGOING" not in response_match_json["payload"]:
        stats["active_match"] = None
    else:
        stats["active_match"] = {"id": response_match_json["payload"]["ONGOING"][0]["id"]}

    return stats, 200


@faceit_bp.route("/peak-elo/<player_uuid>/", methods=["GET"])
def get_faceit_peak_elo(player_uuid: str) -> tuple[dict, int]:
    # 2235828605000 = Nov 06 2040
    url = (f"https://api.faceit.com/stats/v1/stats/time/users/{player_uuid}/games/cs2?size=1000&page=0&"
            f"from={round((time.time() * 1000) - (6 * 30 * 24 * 60 * 60 * 1000))}&to=2235828605000")
    response = r.get(url)
    peak = 0
    for item in response.json():
        try:
            if int(item["elo"]) > peak:
                peak = int(item["elo"])
        except KeyError:
            continue

    peak_lvl = get_faceit_level(peak)

    if peak == 0 and peak_lvl == "":
        return {"message": "Peak elo not found"}, 404

    return {
        "peakElo": peak,
        "peakLevel": peak_lvl,
    }, 200